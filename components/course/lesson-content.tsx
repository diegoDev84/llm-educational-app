"use client"

import { cn } from "@/lib/utils"
import type { Lesson } from "@/lib/lessons"
import { getLessonProgress, getNextLesson, getPreviousLesson } from "@/lib/lessons"
import { getTranslations, replaceParams } from "@/lib/translations"
import type { Locale } from "@/lib/i18n"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Target,
  AlertTriangle,
  Lightbulb,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface LessonContentProps {
  lesson: Lesson
  locale: Locale
  className?: string
}

export function LessonContent({ lesson, locale, className }: LessonContentProps) {
  const t = getTranslations(locale)
  const progress = getLessonProgress(lesson.slug, locale)
  const nextLesson = getNextLesson(lesson.slug, locale)
  const prevLesson = getPreviousLesson(lesson.slug, locale)

  return (
    <article className={cn("max-w-3xl mx-auto", className)}>
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground mb-2">
          <span className="text-xs uppercase tracking-wide font-medium">
            {lesson.module}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {lesson.duration}
            </span>
            <span>
              {replaceParams(t.lesson.lessonOf, { current: progress.current, total: progress.total })}
            </span>
          </div>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance leading-tight tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {lesson.summary}
        </p>
      </header>

      {/* Learning Goals */}
      <section className="mb-12">
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground mb-3 text-base">{t.lesson.learningGoals}</h2>
              <ul className="space-y-2.5 text-muted-foreground leading-relaxed">
                {lesson.goals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="text-primary mt-1 shrink-0">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      {lesson.sections.map((section, index) => (
        <section key={index} className="mb-12">
          <h2 className="text-xl font-semibold mb-5 text-foreground tracking-tight">
            {section.title}
          </h2>
          <div className="space-y-5">
            {section.content.split("\n\n").map((paragraph, pIndex) => {
              // Handle headers
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={pIndex} className="text-lg font-medium mt-7 mb-3 text-foreground tracking-tight">
                    {paragraph.replace("### ", "")}
                  </h3>
                )
              }

              // Handle code blocks
              if (paragraph.startsWith("```")) {
                const lines = paragraph.split("\n")
                const code = lines.slice(1, -1).join("\n")
                return (
                  <pre key={pIndex} className="bg-secondary rounded-lg p-4 overflow-x-auto text-sm my-5 font-mono leading-relaxed">
                    <code className="text-foreground">{code}</code>
                  </pre>
                )
              }

              // Handle lists
              if (paragraph.includes("\n- ") || paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").filter(line => line.startsWith("- "))
                return (
                  <ul key={pIndex} className="list-disc list-inside space-y-2.5 text-muted-foreground pl-1">
                    {items.map((item, i) => (
                      <li key={i} className="leading-relaxed pl-0.5">
                        {formatInlineCode(item.replace(/^- /, ""))}
                      </li>
                    ))}
                  </ul>
                )
              }

              if (paragraph.match(/^\d+\./)) {
                const items = paragraph.split("\n").filter(line => line.match(/^\d+\./))
                return (
                  <ol key={pIndex} className="list-decimal list-inside space-y-2.5 text-muted-foreground pl-1">
                    {items.map((item, i) => (
                      <li key={i} className="leading-relaxed pl-0.5">
                        {formatInlineCode(item.replace(/^\d+\.\s*/, ""))}
                      </li>
                    ))}
                  </ol>
                )
              }

              // Regular paragraphs
              return (
                <p key={pIndex} className="text-muted-foreground leading-[1.7]">
                  {formatInlineCode(paragraph)}
                </p>
              )
            })}
          </div>
        </section>
      ))}

      {/* Common Mistakes */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">{t.lesson.commonMistakes}</h2>
        </div>
        <div className="space-y-3">
          {lesson.commonMistakes.map((mistake, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20 text-sm leading-relaxed"
            >
              <span className="text-destructive font-mono text-xs mt-0.5 shrink-0">×</span>
              <span className="text-muted-foreground">
                {formatInlineCode(mistake)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-success" />
          </div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">{t.lesson.keyTakeaways}</h2>
        </div>
        <div className="space-y-3">
          {lesson.takeaways.map((takeaway, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-success/5 border border-success/20 text-sm leading-relaxed"
            >
              <span className="text-success font-mono text-xs mt-0.5 shrink-0">+</span>
              <span className="text-muted-foreground">
                {formatInlineCode(takeaway)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <nav className="flex flex-wrap items-center justify-between gap-4 pt-10 border-t border-border">
        {prevLesson ? (
          <Link href={`/${locale}/lesson/${prevLesson.slug}`}>
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              <div className="text-left">
                <span className="block text-xs text-muted-foreground">{t.lesson.previous}</span>
                <span className="block text-sm">{prevLesson.title.split(":")[0]}</span>
              </div>
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link href={`/${locale}/lesson/${nextLesson.slug}`}>
            <Button variant="ghost" className="gap-2">
              <div className="text-right">
                <span className="block text-xs text-muted-foreground">{t.lesson.next}</span>
                <span className="block text-sm">{nextLesson.title.split(":")[0]}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Link href={`/${locale}`}>
            <Button className="gap-2">
              {t.lesson.completeCourse}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </nav>
    </article>
  )
}

// Helper to format inline code
function formatInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="bg-secondary px-1.5 py-0.5 rounded text-primary text-sm font-mono">
          {part.slice(1, -1)}
        </code>
      )
    }
    // Handle bold
    if (part.includes("**")) {
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
      return boldParts.map((bp, bi) => {
        if (bp.startsWith("**") && bp.endsWith("**")) {
          return <strong key={`${i}-${bi}`} className="text-foreground font-semibold">{bp.slice(2, -2)}</strong>
        }
        return bp
      })
    }
    return part
  })
}
