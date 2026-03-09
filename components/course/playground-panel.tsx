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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground">{t.playground.title}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetPlayground}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            {t.playground.reset}
          </Button>
        </div>
      </div>

      {/* Experiment Description */}
      <div className="px-4 py-3 bg-secondary/30 border-b border-border">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {playground.description}
        </p>
      </div>

      {/* Starter Prompts as Cards */}
      <div className="p-4 border-b border-border overflow-auto max-h-[260px] shrink-0">
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          {t.playground.tryExperiments}
        </p>
        <div className="space-y-2">
          {playground.starterPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => selectStarterPrompt(index)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all",
                "border",
                selectedPromptIndex === index && !customPrompt
                  ? "bg-primary/10 border-primary/50 ring-1 ring-primary/20"
                  : "bg-secondary/50 border-border hover:bg-secondary hover:border-border/80"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5",
                    selectedPromptIndex === index && !customPrompt
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      selectedPromptIndex === index && !customPrompt
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {prompt.label}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
                    {prompt.explanation}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
          {t.playground.promptLabel}
        </label>
        <textarea
          value={currentPromptText}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder={t.playground.promptPlaceholder}
          className={cn(
            "w-full h-28 min-h-[88px] px-3 py-2.5 text-sm rounded-lg resize-y max-h-40",
            "bg-secondary border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "font-mono touch-manipulation"
          )}
        />
        <Button
          onClick={runPrompt}
          disabled={isLoading || !!retryAfter || !currentPromptText.trim()}
          className="w-full mt-3 min-h-11 touch-manipulation"
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

      {/* Response */}
      <div className="flex-1 flex flex-col min-h-0 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t.playground.response}
            </label>
            {latency !== null && !isLoading && !error && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                <Clock className="w-3 h-3" />
                {latency}ms
              </span>
            )}
          </div>
          {response && !error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={copyResponse}
              className="h-6 px-2 text-xs"
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
            "flex-1 rounded-lg p-4 overflow-auto",
            "border",
            error
              ? "bg-destructive/10 border-destructive/30"
              : "bg-secondary/50 border-border",
            "min-h-[120px] max-xl:min-h-[140px]"
          )}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Spinner className="w-6 h-6" />
              <span className="text-sm">{t.playground.generating}</span>
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 text-destructive">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t.playground.error}</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
                {retryAfter != null && retryAfter > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.playground.retryAfterLabel
                      ? t.playground.retryAfterLabel.replace("{seconds}", String(retryAfter))
                      : `Try again in ${retryAfter}s`}
                  </p>
                )}
                <Button
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
                <pre className="text-sm text-foreground font-mono whitespace-pre overflow-x-auto">
                  <code>{formatJson(response)}</code>
                </pre>
              </div>
            ) : (
              <div className="text-sm text-foreground whitespace-pre-wrap">
                {response}
              </div>
            )
          ) : (
            <Empty className="min-h-[120px] p-6 border-0 bg-transparent">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageSquare className="size-5 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle className="text-base">{t.playground.emptyTitle}</EmptyTitle>
                <EmptyDescription>
                  {t.playground.emptyDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </div>

      {/* Explanation Panel */}
      {selectedPrompt && !customPrompt && (
        <div className="p-4 border-t border-border">
          <button
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
  )
}
