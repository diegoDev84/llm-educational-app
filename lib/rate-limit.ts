/**
 * Lightweight in-memory rate limiter
 * Uses sliding window algorithm for smooth rate limiting
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory stores for rate limiting
const ipStore = new Map<string, RateLimitEntry>()
const sessionStore = new Map<string, RateLimitEntry>()

// Configuration
const WINDOW_MS = 60 * 1000 // 1 minute window
const MAX_REQUESTS_PER_IP = 30 // 30 requests per minute per IP
const MAX_REQUESTS_PER_SESSION = 20 // 20 requests per minute per session

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000

let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  
  lastCleanup = now
  
  for (const [key, entry] of ipStore) {
    if (now > entry.resetTime) {
      ipStore.delete(key)
    }
  }
  
  for (const [key, entry] of sessionStore) {
    if (now > entry.resetTime) {
      sessionStore.delete(key)
    }
  }
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetIn: number // seconds until reset
  limitType?: "ip" | "session"
}

function checkLimit(
  store: Map<string, RateLimitEntry>,
  key: string,
  maxRequests: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetTime) {
    // Create new window
    store.set(key, {
      count: 1,
      resetTime: now + WINDOW_MS,
    })
    return { allowed: true, remaining: maxRequests - 1, resetIn: Math.ceil(WINDOW_MS / 1000) }
  }

  if (entry.count >= maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn: Math.ceil((entry.resetTime - now) / 1000) 
    }
  }

  entry.count++
  return { 
    allowed: true, 
    remaining: maxRequests - entry.count, 
    resetIn: Math.ceil((entry.resetTime - now) / 1000) 
  }
}

export function rateLimit(ip: string, sessionId: string): RateLimitResult {
  // Run cleanup periodically
  cleanup()

  // Check IP limit first
  const ipResult = checkLimit(ipStore, ip, MAX_REQUESTS_PER_IP)
  if (!ipResult.allowed) {
    return {
      success: false,
      remaining: ipResult.remaining,
      resetIn: ipResult.resetIn,
      limitType: "ip",
    }
  }

  // Check session limit
  const sessionResult = checkLimit(sessionStore, sessionId, MAX_REQUESTS_PER_SESSION)
  if (!sessionResult.allowed) {
    return {
      success: false,
      remaining: sessionResult.remaining,
      resetIn: sessionResult.resetIn,
      limitType: "session",
    }
  }

  return {
    success: true,
    remaining: Math.min(ipResult.remaining, sessionResult.remaining),
    resetIn: Math.min(ipResult.resetIn, sessionResult.resetIn),
  }
}

// Generate a random session ID
export function generateSessionId(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("")
}
