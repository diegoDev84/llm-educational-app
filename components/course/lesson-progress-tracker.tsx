"use client"

import { useEffect } from "react"
import type { Locale } from "@/lib/i18n"
import { useCourseProgress } from "@/lib/client-progress"

interface LessonProgressTrackerProps {
  locale: Locale
  slug: string
}

export function LessonProgressTracker({ locale, slug }: LessonProgressTrackerProps) {
  const { progress, setLastLesson, markCompleted, completionDelayMs } = useCourseProgress(locale)

  // Sempre registra a última lição acessada para o comportamento de "continuar de onde parei".
  useEffect(() => {
    setLastLesson(slug)
  }, [setLastLesson, slug])

  // Marca como concluída apenas depois de um tempo mínimo com a aba visível.
  useEffect(() => {
    const alreadyCompleted = progress.completedSlugs.includes(slug)
    if (alreadyCompleted) return

    if (typeof document === "undefined") return

    let timeoutId: number | undefined

    const schedule = () => {
      if (document.visibilityState === "visible" && timeoutId === undefined) {
        timeoutId = window.setTimeout(() => {
          markCompleted(slug)
        }, completionDelayMs)
      }
    }

    const clear = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
    }

    const handleVisibilityChange = () => {
      clear()
      if (document.visibilityState === "visible") {
        schedule()
      }
    }

    schedule()
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clear()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [progress.completedSlugs, slug, markCompleted, completionDelayMs])

  return null
}

