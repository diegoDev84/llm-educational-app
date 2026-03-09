// Modelo atual (gemini-1.5-flash foi descontinuado na v1beta).
// Ver: https://ai.google.dev/gemini-api/docs/models
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"

const MAX_OUTPUT_TOKENS = 256

// Resiliência / limites de chamada à Gemini
const GEMINI_MAX_RETRIES = 1
const GEMINI_RETRY_BASE_DELAY_MS = 10_000
const GEMINI_REQUEST_TIMEOUT_MS = 15_000

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function getBackoffDelayMs(attempt: number): number {
  const base = GEMINI_RETRY_BASE_DELAY_MS * 2 ** attempt
  const jitter = Math.random() * 100
  return base + jitter
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
    finishReason: string
  }>
  error?: {
    code: number
    message: string
    status: string
  }
}

export interface GenerateTextResult {
  text: string
  error?: string
}

async function callGeminiWithRetry(prompt: string, apiKey: string): Promise<GeminiResponse> {
  let lastError: unknown

  for (let attempt = 0; attempt <= GEMINI_MAX_RETRIES; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), GEMINI_REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            temperature: 0.7,
          },
        }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      const maybeErrorBody = await response
        .json()
        .catch(() => ({} as GeminiResponse | { error?: { message?: string } }))

      if (!response.ok) {
        const status = response.status
        const apiMessage =
          (maybeErrorBody as GeminiResponse).error?.message ||
          (maybeErrorBody as { error?: { message?: string } }).error?.message

        if (status === 429) {
          throw new Error(
            apiMessage ||
              "The model is receiving too many requests right now. Please wait a few seconds and try again."
          )
        }

        if (status >= 500 && status < 600) {
          throw new Error(
            apiMessage || "Temporary error from the AI provider. Please try again in a few seconds."
          )
        }

        throw new Error(apiMessage || `API request failed with status ${status}`)
      }

      const data = maybeErrorBody as GeminiResponse

      if (data.error) {
        const status = data.error.status
        const code = data.error.code
        const isRateLimited =
          code === 429 || status === "RESOURCE_EXHAUSTED" || status === "UNAVAILABLE"

        if (isRateLimited) {
          throw new Error(
            data.error.message ||
              "The model is temporarily unavailable due to high load. Please wait a few seconds and try again."
          )
        }

        throw new Error(data.error.message || "The AI provider returned an error for this request.")
      }

      return data
    } catch (error) {
      clearTimeout(timeout)
      lastError = error

      const isAbortError = error instanceof Error && error.name === "AbortError"
      const isNetworkError =
        error instanceof Error &&
        (error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("fetch failed"))

      const canRetry = (isAbortError || isNetworkError) && attempt < GEMINI_MAX_RETRIES

      if (canRetry) {
        await sleep(getBackoffDelayMs(attempt))
        continue
      }

      break
    }
  }

  if (lastError instanceof Error) {
    throw lastError
  }

  throw new Error("Unexpected error while calling the AI provider.")
}

export async function generateText(prompt: string): Promise<GenerateTextResult> {
  const rawKey = process.env.GEMINI_API_KEY
  const apiKey = typeof rawKey === "string" ? rawKey.trim() : ""

  if (!apiKey) {
    const message =
      process.env.NODE_ENV === "production"
        ? "Server misconfiguration: GEMINI_API_KEY is not set on the server."
        : "GEMINI_API_KEY environment variable is not configured"

    return {
      text: "",
      error: message,
    }
  }

  try {
    const data = await callGeminiWithRetry(prompt, apiKey)

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return {
        text: "",
        error: "No text generated from the API",
      }
    }

    return { text }
  } catch (error) {
    return {
      text: "",
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while talking to the AI provider",
    }
  }
}
