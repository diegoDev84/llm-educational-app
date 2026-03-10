import { NextResponse } from "next/server"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: { nome?: string; email?: string; idioma?: string; consentimento_noticia?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    )
  }

  const nome = typeof body.nome === "string" ? body.nome.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim() : ""
  const idioma = typeof body.idioma === "string" ? body.idioma : "en"
  const consentimento_noticia = typeof body.consentimento_noticia === "boolean" ? body.consentimento_noticia : false

  if (!nome || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    )
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    )
  }

  const webhookUrl = process.env.ZAPIER_CERTIFICATE_WEBHOOK_URL
  const zapierPayload = {
    nome,
    email,
    idioma,
    consentimento_noticia,
  }

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zapierPayload),
      })
      if (!res.ok) {
        return NextResponse.json(
          { error: "Failed to submit" },
          { status: 500 }
        )
      }
    } catch {
      return NextResponse.json(
        { error: "Failed to submit" },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ ok: true })
}
