import { NextRequest, NextResponse } from "next/server"
import { generateText, streamTextChunks } from "@/lib/openrouter"
import { rateLimit, generateSessionId } from "@/lib/rate-limit"
import { logError, logRequest } from "@/lib/logging"

// Configuration
const MAX_PROMPT_LENGTH = 1000 // Limit prompt size
const SESSION_COOKIE_NAME = "llm_session"
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const PLAYGROUND_SYSTEM_PROMPT = `
You are a text generation engine used in an educational LLM playground.

Behavior rules:
- Respond only with the content requested by the user.
- Always respond in the same language as the user's prompt. If the user writes in Portuguese, answer in Portuguese; if in English, answer in English.
- Do not include conversational phrases, greetings, apologies, or meta-commentary.
- Do not add introductions (e.g. "Sure", "Claro", "Here are", "Aqui estão") or closing sentences.
- Do not explain your reasoning or describe what you are doing unless the user explicitly asks for an explanation.
- Keep answers as short and direct as possible while satisfying the request.

Output discipline:
- If the user asks for a list, return only the list in the requested format.
- If the user asks for JSON, return only valid JSON with no extra text before or after (no backticks, comments, or explanations).
- If the user asks for a classification, return only the classification result(s) in the requested format.
- When the user provides example patterns (e.g. several lines in the form "X" → Y) and ends with an incomplete line, continue the pattern by filling in only the missing part, following exactly the same format as the previous examples.
- If the user specifies an exact output format, follow it strictly and do not add any extra tokens.

Tone:
- Never use assistant-style phrases such as "Sure", "Of course", "Let me help you", "Claro", "Com certeza", "Aqui está" or similar, in any language.

User request:
`.trim()

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

  // Fallback header provided by some hosting platforms
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
  const startedAt = performance.now()

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
      
      logRequest({
        context: "chat-api",
        method: "POST",
        path: "/api/chat",
        status: 429,
        durationMs: Math.round(performance.now() - startedAt),
        ip: clientIP,
        sessionId,
      })

      return response
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      const response = NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )

      logRequest({
        context: "chat-api",
        method: "POST",
        path: "/api/chat",
        status: 400,
        durationMs: Math.round(performance.now() - startedAt),
        ip: clientIP,
        sessionId,
      })

      return response
    }

    if (!body || typeof body !== "object") {
      const response = NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )

      logRequest({
        context: "chat-api",
        method: "POST",
        path: "/api/chat",
        status: 400,
        durationMs: Math.round(performance.now() - startedAt),
        ip: clientIP,
        sessionId,
      })

      return response
    }

    const { prompt, stream: useStream } = body as { prompt?: unknown; stream?: unknown }

    if (!prompt || typeof prompt !== "string") {
      const response = NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      )

      logRequest({
        context: "chat-api",
        method: "POST",
        path: "/api/chat",
        status: 400,
        durationMs: Math.round(performance.now() - startedAt),
        ip: clientIP,
        sessionId,
      })

      return response
    }

    const trimmedPrompt = prompt.trim()

    if (trimmedPrompt.length === 0) {
      const response = NextResponse.json(
        { error: "Prompt cannot be empty" },
        { status: 400 }
      )

      logRequest({
        context: "chat-api",
        method: "POST",
        path: "/api/chat",
        status: 400,
        durationMs: Math.round(performance.now() - startedAt),
        ip: clientIP,
        sessionId,
      })

      return response
    }

    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
      const response = NextResponse.json(
        { error: `Your prompt is too long. Please keep it under ${MAX_PROMPT_LENGTH} characters.` },
        { status: 400 }
      )

      logRequest({
        context: "chat-api",
        method: "POST",
        path: "/api/chat",
        status: 400,
        durationMs: Math.round(performance.now() - startedAt),
        ip: clientIP,
        sessionId,
      })

      return response
    }

    const fullPrompt = `${PLAYGROUND_SYSTEM_PROMPT}\n\n${trimmedPrompt}`
    const streamRequested = useStream === true

    if (streamRequested) {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamTextChunks(fullPrompt)) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)
              )
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          } catch (err) {
            const message = err instanceof Error ? err.message : "Stream failed"
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
            )
          } finally {
            controller.close()
          }
        },
      })

      const response = new NextResponse(stream, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.resetIn),
        },
      })

      if (isNewSession) {
        response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: SESSION_COOKIE_MAX_AGE,
          path: "/",
        })
      }

      logRequest({
        context: "chat-api",
        method: "POST",
        path: "/api/chat",
        status: 200,
        durationMs: Math.round(performance.now() - startedAt),
        ip: clientIP,
        sessionId,
      })

      return response
    }

    // Non-streaming: full response then JSON
    const result = await generateText(fullPrompt)

    if (result.error) {
      const response = NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
      logRequest({
        context: "chat-api",
        method: "POST",
        path: "/api/chat",
        status: 500,
        durationMs: Math.round(performance.now() - startedAt),
        ip: clientIP,
        sessionId,
      })
      return response
    }

    const response = NextResponse.json(
      { text: result.text },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.resetIn),
        },
      }
    )

    if (isNewSession) {
      response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: SESSION_COOKIE_MAX_AGE,
        path: "/",
      })
    }

    logRequest({
      context: "chat-api",
      method: "POST",
      path: "/api/chat",
      status: 200,
      durationMs: Math.round(performance.now() - startedAt),
      ip: clientIP,
      sessionId,
    })

    return response
  } catch (error) {
    logError({ context: "chat-api", error })

    const response = NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )

    logRequest({
      context: "chat-api",
      method: "POST",
      path: "/api/chat",
      status: 500,
      durationMs: Math.round(performance.now() - startedAt),
      ip: getClientIP(request),
      sessionId: getOrCreateSessionId(request).sessionId,
    })

    return response
  }
}
