/**
 * Lightweight in-memory rate limiter.
 *
 * This implementation is process-local (in-memory) and is adequada para:
 * - Desenvolvimento local
 * - Deploys de pequena escala com uma única instância
 *
 * Em ambientes com múltiplas instâncias ou serverless, os limites serão
 * aplicados por instância. Para uso em produção com mais escala, troque
 * apenas a implementação interna por um store compartilhado (ex.: Redis/KV),
 * mantendo a mesma assinatura de `rateLimit(ip, sessionId)`.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory stores for rate limiting
const ipStore = new Map<string, RateLimitEntry>()
const sessionStore = new Map<string, RateLimitEntry>()

// Configuration
// Janela deslizante de 1 minuto
const WINDOW_MS = 60 * 1000

// Limites pensados para playground educacional:
// - IP: protege contra abusos de uma mesma rede
// - Sessão: incentiva uso responsável por usuário individual
//
// Com estes valores, um aluno consegue interagir bastante (várias execuções
// por minuto) sem risco real de abuso acidental, enquanto scripts/bots
// batem rapidamente no limite.
const MAX_REQUESTS_PER_IP = 20 // 20 requests per minute per IP
const MAX_REQUESTS_PER_SESSION = 10 // 10 requests per minute per session

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
