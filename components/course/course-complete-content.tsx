"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { toPng } from "html-to-image"
import { Linkedin, Download } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import type { UIStrings } from "@/lib/translations"
import { replaceParams } from "@/lib/translations"
import { courseDurationHours } from "@/lib/course-config"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface CourseCompleteContentProps {
  locale: Locale
  t: UIStrings["courseComplete"]
  termsHref: string
}

function formatCompletionDate(locale: Locale): string {
  return new Date().toLocaleDateString(locale === "pt-br" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function CourseCompleteContent({ locale, t, termsHref }: CourseCompleteContentProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloadingImage, setDownloadingImage] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    if (!trimmedName || !trimmedEmail || !termsAccepted) {
      setError(t.errorInvalidFields)
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setError(t.errorInvalidFields)
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: trimmedName,
          email: trimmedEmail,
          idioma: locale,
          consentimento_noticia: termsAccepted,
        }),
      })
      if (!res.ok) {
        setError(t.errorSendFailed)
        return
      }
      setSubmitted(true)
    } catch {
      setError(t.errorSendFailed)
    } finally {
      setLoading(false)
    }
  }

  async function handleDownloadImage() {
    if (!certificateRef.current) return
    setDownloadingImage(true)
    try {
      const dataUrl = await toPng(certificateRef.current, {
        backgroundColor: "oklch(0.16 0 0)",
        pixelRatio: 2,
        cacheBust: true,
      })
      const link = document.createElement("a")
      link.download = "certificado-frodex.png"
      link.href = dataUrl
      link.click()
    } finally {
      setDownloadingImage(false)
    }
  }

  const linkedInShareUrl = "https://www.linkedin.com/feed/"
  const shareText = t.linkedInShareText

  if (submitted) {
    const completionDate = formatCompletionDate(locale)
    const durationText = replaceParams(t.certificateDurationValue, { hours: courseDurationHours })

    return (
      <div className="space-y-6">
        <div
          id="certificate"
          ref={certificateRef}
          className="certificate-card w-full max-w-4xl mx-auto rounded-2xl border border-border bg-card overflow-hidden shadow-lg flex flex-col"
        >
          {/* Accent bar */}
          <div className="h-1.5 bg-primary shrink-0" />
          <div className="p-8 sm:p-10 lg:p-12 flex-1 flex flex-col justify-center">
            {/* Logo + Frodex */}
            <div className="flex justify-center items-center gap-3 mb-6">
              <Image
                src="/frodex-logo.png"
                alt=""
                width={64}
                height={64}
                className="w-12 h-12 sm:w-14 sm:h-14"
              />
              <span className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                Frodex
              </span>
            </div>
            {/* Title */}
            <p className="text-center text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
              {t.certificateTitle}
            </p>
            <div className="w-16 h-px bg-primary/50 mx-auto mb-6" aria-hidden />
            <p className="text-center text-muted-foreground text-sm sm:text-base mb-3">
              {t.certificateCertifies}
            </p>
            <p className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 tracking-tight">
              {name.trim()}
            </p>
            <p className="text-center text-muted-foreground text-sm sm:text-base mb-1">
              {t.certificateCompleted}
            </p>
            <p className="text-center text-lg sm:text-xl font-semibold text-foreground mb-8">
              {t.courseName}
            </p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-2 text-sm text-muted-foreground border-t border-border pt-5">
              <span>
                {t.certificateDuration}: {durationText}
              </span>
              <span>
                {t.certificateDate}: {completionDate}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-6 max-w-2xl mx-auto space-y-4">
          <h2 className="text-lg font-semibold text-foreground text-center">
            {t.shareTitle}
          </h2>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {t.shareBody}
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-1">
            <Button
              onClick={handleDownloadImage}
              disabled={downloadingImage}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {downloadingImage ? t.downloadImageSending : t.downloadImageButton}
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <a
                href={linkedInShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={shareText}
              >
                <Linkedin className="w-4 h-4" />
                {t.linkedInButton}
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {t.linkedInHint}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Card className="p-6 sm:p-8 max-w-xl mx-auto">
      <p className="text-muted-foreground mb-6">{t.congrats}</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="course-complete-name">{t.nameLabel}</Label>
          <Input
            id="course-complete-name"
            type="text"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-complete-email">{t.emailLabel}</Label>
          <Input
            id="course-complete-email"
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            autoComplete="email"
          />
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-4 columns-1">
          <div className="flex items-start gap-3">
            <Checkbox
              id="course-complete-terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              disabled={loading}
              className="size-5 shrink-0 mt-0.5 border-2 border-foreground/40 bg-background data-[state=checked]:border-primary data-[state=checked]:bg-primary"
            />
            <Label
              htmlFor="course-complete-terms"
              className="text-sm text-muted-foreground font-normal cursor-pointer leading-relaxed flex-1 min-w-0"
            >
              <span className="inline">
                {t.termsAgreePrefix}
                <Link href={termsHref} className="text-primary underline underline-offset-2">
                  {t.termsLink}
                </Link>
                {t.termsAgreeSuffix}
              </span>
            </Label>
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? t.submitSending : t.submitButton}
        </Button>
      </form>
    </Card>
  )
}
