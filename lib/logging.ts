type LogLevel = "debug" | "info" | "warn" | "error"

interface BaseLogFields {
  level: LogLevel
  timestamp: string
  context: string
}

interface RequestLogFields extends BaseLogFields {
  method: string
  path: string
  status: number
  durationMs?: number
  ipHash?: string
  sessionId?: string
}

interface ErrorLogFields extends BaseLogFields {
  message: string
  stack?: string
}

function shouldLog(level: LogLevel): boolean {
  const envLevel = (process.env.LOG_LEVEL || "info").toLowerCase() as LogLevel
  const order: LogLevel[] = ["debug", "info", "warn", "error"]
  return order.indexOf(level) >= order.indexOf(envLevel)
}

function baseFields(level: LogLevel, context: string): BaseLogFields {
  return {
    level,
    context,
    timestamp: new Date().toISOString(),
  }
}

// Pequena ajuda para anonimizar IPs em logs (não reversível na prática)
function hashIp(ip: string | null | undefined): string | undefined {
  if (!ip || ip === "unknown") return undefined
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(ip)
    // crypto.subtle não está disponível em todos os runtimes, então caímos em um hash simplificado
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = (hash * 31 + data[i]) | 0
    }
    return `ip_${Math.abs(hash)}`
  } catch {
    return undefined
  }
}

export function logRequest(fields: {
  context: string
  method: string
  path: string
  status: number
  durationMs?: number
  ip?: string | null
  sessionId?: string
}) {
  if (!shouldLog("info")) return

  const log: RequestLogFields = {
    ...baseFields("info", fields.context),
    method: fields.method,
    path: fields.path,
    status: fields.status,
    durationMs: fields.durationMs,
    ipHash: hashIp(fields.ip),
    sessionId: fields.sessionId,
  }

  // Destino padrão: console. Em produção, integre com provedor de logs.
  console.log(JSON.stringify(log))
}

export function logError(fields: { context: string; error: unknown }) {
  if (!shouldLog("error")) return

  const err = fields.error instanceof Error ? fields.error : undefined

  const log: ErrorLogFields = {
    ...baseFields("error", fields.context),
    message: err?.message || "Unknown error",
    stack: err?.stack,
  }

  console.error(JSON.stringify(log))
}

export function logMetric(fields: { context: string; name: string; value: number }) {
  if (!shouldLog("debug")) return

  const log = {
    ...baseFields("debug", fields.context),
    metric: fields.name,
    value: fields.value,
  }

  console.debug(JSON.stringify(log))
}

