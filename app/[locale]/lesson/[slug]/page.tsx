import { notFound } from "next/navigation"
import { getLessonBySlug, getLessonSlugs } from "@/lib/lessons"
import { SidebarNavigation } from "@/components/course/sidebar-navigation"
import { LessonContent } from "@/components/course/lesson-content"
import { PlaygroundPanel } from "@/components/course/playground-panel"
import type { Locale } from "@/lib/i18n"

interface LessonPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const locales: Locale[] = ["en", "pt-br"]
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    const slugs = getLessonSlugs(locale)
    for (const slug of slugs) {
      params.push({ locale, slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { locale, slug } = await params
  const lesson = getLessonBySlug(slug, locale as Locale)
  if (!lesson) return { title: "Lesson Not Found | LLM Mastery" }
  return { title: `${lesson.title} | LLM Mastery`, description: lesson.summary }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { locale, slug } = await params
  const lesson = getLessonBySlug(slug, locale as Locale)
  if (!lesson) notFound()

  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation />
      <div className="lg:pl-72 pt-14 lg:pt-0">
        <div className="flex flex-col xl:flex-row min-h-screen">
          <main className="flex-1 px-4 py-8 sm:px-6 lg:py-12 lg:px-12 xl:pr-6">
            <LessonContent lesson={lesson} locale={locale as Locale} />
          </main>
          <aside className="xl:w-[400px] xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto border-t xl:border-t-0 border-border">
            <PlaygroundPanel playground={lesson.playground} lessonSlug={slug} locale={locale as Locale} />
          </aside>
        </div>
      </div>
    </div>
  )
}
