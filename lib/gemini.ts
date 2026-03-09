const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

const MAX_OUTPUT_TOKENS = 1024

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

export async function generateText(prompt: string): Promise<GenerateTextResult> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return {
      text: "",
      error: "GEMINI_API_KEY environment variable is not configured",
    }
  }

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
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        text: "",
        error: errorData.error?.message || `API request failed with status ${response.status}`,
      }
    }

    const data: GeminiResponse = await response.json()

    if (data.error) {
      return {
        text: "",
        error: data.error.message,
      }
    }

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
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
