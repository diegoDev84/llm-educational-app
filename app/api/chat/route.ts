import { NextRequest, NextResponse } from "next/server"
import { generateText } from "@/lib/gemini"
import { rateLimit, generateSessionId } from "@/lib/rate-limit"

// Configuration
const MAX_PROMPT_LENGTH = 2000 // Limit prompt size
const SESSION_COOKIE_NAME = "llm_session"
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getClientIP(request: NextRequest): string {
  // Check common headers for real IP (behind proxies/load balancers)
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  
  const realIP = request.headers.get("x-real-ip")
  if (realIP) {
    return realIP
  }

  // Fallback - Vercel provides this
  const vercelIP = request.headers.get("x-vercel-forwarded-for")
  if (vercelIP) {
    return vercelIP.split(",")[0].trim()
  }

  return "unknown"
}

function getOrCreateSessionId(request: NextRequest): { sessionId: string; isNew: boolean } {
  const existingSession = request.cookies.get(SESSION_COOKIE_NAME)?.value
  
  if (existingSession && existingSession.length === 32) {
    return { sessionId: existingSession, isNew: false }
  }
  
  return { sessionId: generateSessionId(), isNew: true }
}

export async function POST(request: NextRequest) {
  try {
    // Get client identifiers
    const clientIP = getClientIP(request)
    const { sessionId, isNew: isNewSession } = getOrCreateSessionId(request)

    // Check rate limits
    const rateLimitResult = rateLimit(clientIP, sessionId)
    
    if (!rateLimitResult.success) {
      const message = rateLimitResult.limitType === "ip"
        ? "Too many requests from your network. Please wait a moment before trying again."
        : "You're sending requests too quickly. Please slow down and try again."
      
      const response = NextResponse.json(
        { 
          error: message,
          retryAfter: rateLimitResult.resetIn,
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.resetIn),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimitResult.resetIn),
          }
        }
      )
      
      // Still set cookie for new sessions
      if (isNewSession) {
        response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: SESSION_COOKIE_MAX_AGE,
          path: "/",
        })
      }
      
      return response
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { prompt } = body as { prompt?: unknown }

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
        { error: `Your prompt is too long. Please keep it under ${MAX_PROMPT_LENGTH} characters.` },
        { status: 400 }
      )
    }

    // Generate response
    const result = await generateText(trimmedPrompt)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Success response with rate limit headers
    const response = NextResponse.json(
      { text: result.text },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.resetIn),
        }
      }
    )

    // Set session cookie for new sessions
    if (isNewSession) {
      response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: SESSION_COOKIE_MAX_AGE,
        path: "/",
      })
    }

    return response
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
