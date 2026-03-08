"use client"

import { cn } from "@/lib/utils"
import type { Lesson } from "@/lib/lessons"
import { getLessonProgress, getNextLesson, getPreviousLesson } from "@/lib/lessons"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Target, BookOpen, AlertTriangle, Lightbulb, Code } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LessonContentProps {
  lesson: Lesson
  className?: string
}

export function LessonContent({ lesson, className }: LessonContentProps) {
  const progress = getLessonProgress(lesson.slug)
  const nextLesson = getNextLesson(lesson.slug)
  const prevLesson = getPreviousLesson(lesson.slug)

  return (
    <article className={cn("max-w-3xl mx-auto", className)}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span className="text-xs uppercase tracking-wide font-medium">
            {lesson.moduleName}
          </span>
          <span>
            Lesson {progress.current} of {progress.total}
          </span>
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-4 text-balance">
          {lesson.title}
        </h1>
      </header>

      {/* Goal */}
      <section className="mb-10">
        <div className="flex items-start gap-4 p-5 rounded-xl bg-primary/10 border border-primary/20">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground mb-1">Learning Goal</h2>
            <p className="text-muted-foreground leading-relaxed">
              {lesson.goal}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mb-10 prose-lesson">
        <div className="space-y-4">
          {lesson.content.split("\n\n").map((paragraph, index) => {
            // Handle headers
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className="text-xl font-semibold mt-8 mb-4 text-foreground">
                  {paragraph.replace("## ", "")}
                </h2>
              )
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className="text-lg font-medium mt-6 mb-3 text-foreground">
                  {paragraph.replace("### ", "")}
                </h3>
              )
            }

            // Handle code blocks
            if (paragraph.startsWith("```")) {
              const lines = paragraph.split("\n")
              const language = lines[0].replace("```", "")
              const code = lines.slice(1, -1).join("\n")
              return (
                <pre key={index} className="bg-secondary rounded-lg p-4 overflow-x-auto text-sm">
                  <code className="font-mono text-foreground">{code}</code>
                </pre>
              )
            }

            // Handle lists
            if (paragraph.includes("\n- ")) {
              const items = paragraph.split("\n- ").filter(Boolean)
              return (
                <ul key={index} className="list-disc list-inside space-y-2 text-muted-foreground">
                  {items.map((item, i) => (
                    <li key={i} className="leading-relaxed">
                      {formatInlineCode(item.replace(/^- /, ""))}
                    </li>
                  ))}
                </ul>
              )
            }

            if (paragraph.includes("\n1. ")) {
              const items = paragraph.split(/\n\d+\. /).filter(Boolean)
              return (
                <ol key={index} className="list-decimal list-inside space-y-2 text-muted-foreground">
                  {items.map((item, i) => (
                    <li key={i} className="leading-relaxed">
                      {formatInlineCode(item)}
                    </li>
                  ))}
                </ol>
              )
            }

            // Regular paragraphs
            return (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {formatInlineCode(paragraph)}
              </p>
            )
          })}
        </div>
      </section>

      {/* Examples */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Code className="w-4 h-4 text-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Examples</h2>
        </div>
        <div className="space-y-3">
          {lesson.examples.map((example, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground leading-relaxed"
            >
              {formatInlineCode(example)}
            </div>
          ))}
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Common Mistakes</h2>
        </div>
        <div className="space-y-3">
          {lesson.commonMistakes.map((mistake, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20 text-sm"
            >
              <span className="text-destructive font-mono text-xs mt-0.5">✗</span>
              <span className="text-muted-foreground leading-relaxed">
                {formatInlineCode(mistake)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-success" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Key Takeaways</h2>
        </div>
        <div className="space-y-3">
          {lesson.keyTakeaways.map((takeaway, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-success/5 border border-success/20 text-sm"
            >
              <span className="text-success font-mono text-xs mt-0.5">✓</span>
              <span className="text-muted-foreground leading-relaxed">
                {formatInlineCode(takeaway)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <nav className="flex items-center justify-between pt-8 border-t border-border">
        {prevLesson ? (
          <Link href={`/lesson/${prevLesson.slug}`}>
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              <div className="text-left">
                <span className="block text-xs text-muted-foreground">Previous</span>
                <span className="block text-sm">{prevLesson.title.split(":")[0]}</span>
              </div>
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link href={`/lesson/${nextLesson.slug}`}>
            <Button variant="ghost" className="gap-2">
              <div className="text-right">
                <span className="block text-xs text-muted-foreground">Next</span>
                <span className="block text-sm">{nextLesson.title.split(":")[0]}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Link href="/">
            <Button className="gap-2">
              Complete Course
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
