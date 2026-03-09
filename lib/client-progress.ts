"use client"

import { useEffect, useState, useCallback } from "react"
import type { Locale } from "@/lib/i18n"

const STORAGE_KEY_PREFIX = "llm-mastery-progress"
const DEFAULT_COMPLETION_MS = 60_000

interface StoredProgress {
  lastLessonSlug?: string
  completedSlugs?: string[]
}

export interface CourseProgress {
  lastLessonSlug?: string
  completedSlugs: string[]
}

function getStorageKey(locale: Locale) {
  return `${STORAGE_KEY_PREFIX}:${locale}`
}

function safeParseProgress(value: string | null): CourseProgress {
  if (!value) {
    return { lastLessonSlug: undefined, completedSlugs: [] }
  }
  try {
    const parsed = JSON.parse(value) as StoredProgress
    return {
      lastLessonSlug: parsed.lastLessonSlug,
      completedSlugs: Array.isArray(parsed.completedSlugs) ? parsed.completedSlugs : [],
    }
  } catch {
    return { lastLessonSlug: undefined, completedSlugs: [] }
  }
}

function saveProgress(locale: Locale, progress: CourseProgress) {
  if (typeof window === "undefined") return
  try {
    const key = getStorageKey(locale)
    const payload: StoredProgress = {
      lastLessonSlug: progress.lastLessonSlug,
      completedSlugs: progress.completedSlugs,
    }
    window.localStorage.setItem(key, JSON.stringify(payload))
  } catch {
    // Best effort only; ignore storage failures
  }
}

function clearAllStoredProgress() {
  if (typeof window === "undefined") return
  try {
    const toRemove: string[] = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        toRemove.push(key)
      }
    }
    for (const key of toRemove) {
      window.localStorage.removeItem(key)
    }
  } catch {
    // Ignore storage errors
  }
}

export function getInitialProgress(locale: Locale): CourseProgress {
  if (typeof window === "undefined") {
    return { lastLessonSlug: undefined, completedSlugs: [] }
  }
  const key = getStorageKey(locale)
  const raw = window.localStorage.getItem(key)
  return safeParseProgress(raw)
}

export function useCourseProgress(locale: Locale) {
  const [progress, setProgress] = useState<CourseProgress>(() => ({
    lastLessonSlug: undefined,
    completedSlugs: [],
  }))

  useEffect(() => {
    const initial = getInitialProgress(locale)
    setProgress(initial)
  }, [locale])

  const setLastLesson = useCallback(
    (slug: string) => {
      setProgress(prev => {
        if (prev.lastLessonSlug === slug) return prev
        const next: CourseProgress = {
          ...prev,
          lastLessonSlug: slug,
        }
        saveProgress(locale, next)
        return next
      })
    },
    [locale]
  )

  const markCompleted = useCallback(
    (slug: string) => {
      setProgress(prev => {
        if (prev.completedSlugs.includes(slug)) {
          // Ainda podemos atualizar lastLessonSlug para refletir progresso mais recente.
          if (prev.lastLessonSlug === slug) return prev
          const updated: CourseProgress = {
            ...prev,
            lastLessonSlug: prev.lastLessonSlug ?? slug,
          }
          saveProgress(locale, updated)
          return updated
        }

        const next: CourseProgress = {
          lastLessonSlug: prev.lastLessonSlug ?? slug,
          completedSlugs: [...prev.completedSlugs, slug],
        }
        saveProgress(locale, next)
        return next
      })
    },
    [locale]
  )

  const clearProgress = useCallback(() => {
    clearAllStoredProgress()
    setProgress({ lastLessonSlug: undefined, completedSlugs: [] })
  }, [])

  return { progress, setLastLesson, markCompleted, clearProgress, completionDelayMs: DEFAULT_COMPLETION_MS }
}

