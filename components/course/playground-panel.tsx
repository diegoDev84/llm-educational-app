"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { Lesson } from "@/lib/lessons"
import { getTranslations } from "@/lib/translations"
import type { Locale } from "@/lib/i18n"
import {
  Play,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"

interface PlaygroundPanelProps {
  playground: Lesson["playground"]
  lessonSlug: string
  locale: Locale
  className?: string
}

export function PlaygroundPanel({
  playground,
  lessonSlug,
  locale,
  className,
}: PlaygroundPanelProps) {
  const t = getTranslations(locale)
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0)
  const [customPrompt, setCustomPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryAfter, setRetryAfter] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [latency, setLatency] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(true)
  const startTimeRef = useRef<number>(0)
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null)

  const clearResponseState = useCallback(() => {
    setCustomPrompt("")
    setResponse("")
    setError(null)
    setRetryAfter(null)
    setLatency(null)
  }, [])

  useEffect(() => {
    setSelectedPromptIndex(0)
    clearResponseState()
  }, [lessonSlug, clearResponseState])

  const selectedPrompt = playground.starterPrompts[selectedPromptIndex]
  const currentPromptText = customPrompt || selectedPrompt?.prompt || ""

  const isJsonResponse = (text: string): boolean => {
    const trimmed = text.trim()
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        JSON.parse(trimmed)
        return true
      } catch {
        return false
      }
    }
    return false
  }

  const formatJson = (text: string): string => {
    try {
      return JSON.stringify(JSON.parse(text.trim()), null, 2)
    } catch {
      return text
    }
  }

  useEffect(() => {
    if (retryAfter == null || retryAfter <= 0) return

    const intervalId = window.setInterval(() => {
      setRetryAfter((current) => {
        if (current == null) return null
        if (current <= 1) {
          window.clearInterval(intervalId)
          return null
        }
        return current - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [retryAfter])

  const runPrompt = async () => {
    if (!currentPromptText.trim()) return

    setIsLoading(true)
    setResponse("")
    setError(null)
    setRetryAfter(null)
    setLatency(null)
    startTimeRef.current = performance.now()

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: currentPromptText }),
      })

      const data = await res.json()
      const endTime = performance.now()
      setLatency(Math.round(endTime - startTimeRef.current))

      if (!res.ok || data.error) {
        if (res.status === 429) {
          if (typeof data.retryAfter === "number") {
            setRetryAfter(data.retryAfter)
          }
          throw new Error(
            data.error ||
              t.playground.rateLimited ||
              "You are sending requests too quickly. Please wait a few seconds and try again."
          )
        }

        if (res.status >= 500) {
          throw new Error(
            data.error ||
              t.playground.serverError ||
              "Temporary error while talking to the model. Please try again in a few seconds."
          )
        }

        if (res.status >= 400) {
          throw new Error(
            data.error ||
              t.playground.badRequestError ||
              "The request was rejected by the server. Please check your prompt and try again."
          )
        }

        throw new Error(
          data.error ||
            t.playground.genericError ||
            "Failed to generate a response from the model."
        )
      }

      setResponse(data.text)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : t.playground.unexpectedError ||
            "An unexpected error occurred while talking to the model. Please try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectStarterPrompt = (index: number) => {
    setSelectedPromptIndex(index)
    clearResponseState()
    promptTextareaRef.current?.scrollTo(0, 0)
  }

  const resetPlayground = () => {
    setSelectedPromptIndex(0)
    clearResponseState()
  }

  const responseIsJson = response && isJsonResponse(response)

  return (
    <div
      className={cn(
        "flex flex-col h-full min-h-0 bg-card border-l border-border",
        "max-xl:border-l-0 max-xl:min-h-[320px]",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">{t.playground.title}</h2>
        </div>
      </div>

      {/* Main scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
        {/* Starter examples – top priority */}
        {playground.starterPrompts.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t.playground.tryExperiments}
              </p>
              <p className="text-[11px] text-muted-foreground/80">
                {t.playground.promptLabel}
              </p>
            </div>
            <div className="space-y-1.5">
              {playground.starterPrompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectStarterPrompt(index)}
                  title={prompt.explanation}
                  className={cn(
                    "group w-full text-left rounded-lg border px-3.5 py-2.5 transition-colors",
                    "bg-secondary/40 hover:bg-secondary/70",
                    selectedPromptIndex === index && !customPrompt
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/70"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-[11px] font-medium text-muted-foreground/80">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          selectedPromptIndex === index && !customPrompt
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {prompt.label}
                      </p>
                      <p className="text-xs text-muted-foreground/80 line-clamp-1">
                        {prompt.prompt}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Experiment context */}
        <section className="rounded-xl border border-border/70 bg-secondary/30 px-3.5 py-3">
          <p className="text-xs font-medium text-muted-foreground/80 mb-1.5 uppercase tracking-wide">
            {t.playground.whyExperiment}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {playground.description}
          </p>
        </section>

        {/* Prompt + Response stacked */}
        <section className="space-y-3">
          {/* Prompt input is the primary focus */}
          <div className="rounded-xl border border-border/70 bg-background px-3.5 py-3 space-y-2.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t.playground.promptLabel}
            </label>
            <textarea
              ref={promptTextareaRef}
              value={currentPromptText}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={t.playground.promptPlaceholder}
              className={cn(
                "w-full h-32 min-h-[112px] max-h-56 px-3 py-2.5 text-sm rounded-lg resize-y",
                "bg-secondary/40 border border-border/70",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                "font-mono leading-relaxed touch-manipulation"
              )}
            />
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetPlayground}
                disabled={isLoading}
                className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                {t.playground.reset}
              </Button>
              <Button
                type="button"
                onClick={runPrompt}
                disabled={isLoading || !!retryAfter || !currentPromptText.trim()}
                className="flex-1 h-10 min-h-10 touch-manipulation"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    {t.playground.running}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {t.playground.runPrompt}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Output and explanation directly below prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t.playground.response}
                </span>
                {latency !== null && !isLoading && !error && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                    <Clock className="w-3 h-3" />
                    {latency}ms
                  </span>
                )}
              </div>
              {response && !error && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copyResponse}
                  className="h-7 px-2 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      {t.playground.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      {t.playground.copy}
                    </>
                  )}
                </Button>
              )}
            </div>

            <div
              className={cn(
                "rounded-xl border px-3.5 py-3.5",
                error
                  ? "bg-destructive/10 border-destructive/30"
                  : "bg-secondary/40 border-border/70"
              )}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-6 text-muted-foreground">
                  <Spinner className="w-6 h-6" />
                  <span className="text-sm">{t.playground.generating}</span>
                </div>
              ) : error ? (
                <div className="flex items-start gap-3 text-destructive">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t.playground.error}</p>
                    <p className="text-sm text-destructive/80 mt-1 leading-relaxed">
                      {error}
                    </p>
                    {retryAfter != null && retryAfter > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t.playground.retryAfterLabel
                          ? t.playground.retryAfterLabel.replace(
                              "{seconds}",
                              String(retryAfter)
                            )
                          : `Try again in ${retryAfter}s`}
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={runPrompt}
                      className="mt-3 h-7 text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      {t.playground.retry}
                    </Button>
                  </div>
                </div>
              ) : response ? (
                responseIsJson ? (
                  <div className="relative">
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-medium rounded-bl rounded-tr-lg uppercase tracking-wide">
                      JSON
                    </div>
                    <pre className="text-xs sm:text-sm text-foreground font-mono whitespace-pre overflow-x-auto leading-relaxed">
                      <code>{formatJson(response)}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {response}
                  </div>
                )
              ) : (
                <Empty className="p-4 border-none bg-transparent">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageSquare className="size-5 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle className="text-sm">
                      {t.playground.emptyTitle}
                    </EmptyTitle>
                    <EmptyDescription className="text-xs text-muted-foreground">
                      {t.playground.emptyDescription}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>

            {selectedPrompt && !customPrompt && (
              <div className="rounded-xl border border-border/70 bg-secondary/30 px-3.5 py-3">
                <button
                  type="button"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                >
                  <span>{t.playground.whyExperiment}</span>
                  {showExplanation ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {showExplanation && (
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {selectedPrompt.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
