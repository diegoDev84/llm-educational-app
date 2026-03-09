import { NextResponse } from "next/server"
import { generateText } from "@/lib/gemini"

const MAX_PROMPT_LENGTH = 4000

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Input validation
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { prompt } = body

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      )
    }

    const trimmedPrompt = prompt.trim()

    if (trimmedPrompt.length === 0) {
      return NextResponse.json(
        { error: "Prompt cannot be empty" },
        { status: 400 }
      )
    }

    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` },
        { status: 400 }
      )
    }

    const result = await generateText(trimmedPrompt)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ text: result.text })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
