const OPENROUTER_MODEL = "mistralai/mistral-nemo"
const MAX_OUTPUT_TOKENS = 1000

export interface GenerateTextResult {
  text: string
  error?: string
}

export async function generateText(prompt: string): Promise<GenerateTextResult> {
  const rawKey = process.env.OPENROUTER_API_KEY
  const apiKey = typeof rawKey === "string" ? rawKey.trim() : ""

  if (!apiKey) {
    const message =
      process.env.NODE_ENV === "production"
        ? "Server misconfiguration: OPENROUTER_API_KEY is not set on the server."
        : "OPENROUTER_API_KEY environment variable is not configured"

    return {
      text: "",
      error: message,
    }
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: true,
      }),
    })

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`

      try {
        const errorBody = (await response.json()) as { error?: { message?: string } }
        if (errorBody?.error?.message) {
          errorMessage = errorBody.error.message
        }
      } catch {
        // ignore JSON parse errors and keep fallback message
      }

      return {
        text: "",
        error: errorMessage,
      }
    }

    const reader = response.body?.getReader()
    if (!reader) {
      return {
        text: "",
        error: "Streaming response is not available from the AI provider",
      }
    }

    const decoder = new TextDecoder()
    let buffer = ""
    let fullText = ""

    // Parse Server-Sent Events (SSE) stream from OpenRouter
    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""

      for (const line of lines) {
        const trimmed = line.trim()

        if (!trimmed || !trimmed.startsWith("data:")) {
          continue
        }

        const data = trimmed.slice("data:".length).trim()

        if (data === "[DONE]") {
          break
        }

        try {
          const json = JSON.parse(data) as {
            choices?: Array<{
              delta?: {
                content?:
                  | string
                  | Array<{
                      type?: string
                      text?: string
                    }>
              }
            }>
          }

          const choice = json.choices?.[0]
          const deltaContent = choice?.delta?.content

          if (!deltaContent) {
            continue
          }

          if (typeof deltaContent === "string") {
            fullText += deltaContent
            continue
          }

          if (Array.isArray(deltaContent)) {
            for (const part of deltaContent) {
              if (typeof part?.text === "string") {
                fullText += part.text
              }
            }
          }
        } catch {
          // Ignore individual malformed SSE events and continue
          continue
        }
      }
    }

    if (!fullText) {
      return {
        text: "",
        error: "No text generated from the AI provider",
      }
    }

    return { text: fullText }
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      const isAuthError =
        message.includes("unauthorized") ||
        message.includes("forbidden") ||
        message.includes("invalid api key") ||
        message.includes("invalid openrouter_api_key") ||
        message.includes("401") ||
        message.includes("403")

      if (isAuthError) {
        return {
          text: "",
          error:
            "Invalid or unauthorized OpenRouter API key. Please verify the OPENROUTER_API_KEY server configuration.",
        }
      }

      return {
        text: "",
        error: error.message,
      }
    }

    return {
      text: "",
      error: "An unexpected error occurred while talking to the AI provider",
    }
  }
}

