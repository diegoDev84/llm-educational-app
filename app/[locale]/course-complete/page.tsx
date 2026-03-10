import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n"
import { SiteHeader } from "@/components/site-header"
import { CourseCompleteContent } from "@/components/course/course-complete-content"
import { getTranslations } from "@/lib/translations"
import { getLessonSlugs } from "@/lib/lessons"

interface CourseCompletePageProps {
  params: Promise<{ locale: Locale }>
}

const pageCopy: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Course Complete",
    description: "Generate your certificate of completion.",
  },
  "pt-br": {
    title: "Curso concluído",
    description: "Gere seu certificado de conclusão.",
  },
}

export async function generateMetadata({ params }: CourseCompletePageProps): Promise<Metadata> {
  const { locale } = await params
  const copy = pageCopy[locale]
  return {
    title: copy.title,
    description: copy.description,
  }
}

export default async function CourseCompletePage({ params }: CourseCompletePageProps) {
  const { locale } = await params
  const slugs = getLessonSlugs(locale)
  const firstLessonSlug = slugs[0]
  const courseHref = firstLessonSlug ? `/${locale}/lesson/${firstLessonSlug}` : `/${locale}`
  const t = getTranslations(locale)
  const termsHref = `/${locale}/terms`

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader locale={locale} courseHref={courseHref} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16 space-y-8">
        <section className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight text-balance text-center">
            {t.courseComplete.title}
          </h1>
          <CourseCompleteContent
              locale={locale}
              t={t.courseComplete}
              termsHref={termsHref}
          />
        </section>
      </main>
    </div>
  )
}
