import Link from "next/link"
import { getModules, getLessonBySlug, getLessonNumber, getLessonSlugs } from "@/lib/lessons"
import { getTranslations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight, Sparkles, Code, Layers, Cpu, Rocket, Clock } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { SiteHeader } from "@/components/site-header"

const moduleIcons = [BookOpen, Code, Layers, Cpu, Rocket]

const learnCardKeys = ["llms", "prompting", "functionCalling", "cot", "rag", "production"] as const

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const t = getTranslations(locale as Locale)
  const modules = getModules(locale as Locale)
  const slugs = getLessonSlugs(locale as Locale)
  const firstLesson = slugs.length > 0 ? getLessonBySlug(slugs[0], locale as Locale) : null
  const courseHref = firstLesson ? `/${locale}/lesson/${firstLesson.slug}` : `/${locale}`

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader locale={locale as Locale} courseHref={courseHref} />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
          <div className="flex items-center gap-2 text-primary mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">{t.home.badge}</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            {t.home.heroTitle1}
            <br />
            <span className="text-muted-foreground">{t.home.heroTitle2}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-2 leading-relaxed">
            {t.home.heroDescription}
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mb-10">
            Free to use during beta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {firstLesson && (
              <Link href={`/${locale}/lesson/${firstLesson.slug}`}>
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  {t.home.startLearning}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
            <Link href="#curriculum">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {t.home.viewCurriculum}
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-12 pt-8 border-t border-border">
            <div>
              <p className="text-2xl font-bold text-foreground">14</p>
              <p className="text-sm text-muted-foreground">{t.home.lessons}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">5</p>
              <p className="text-sm text-muted-foreground">{t.home.modules}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">50+</p>
              <p className="text-sm text-muted-foreground">{t.home.playgroundExamples}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t.home.whatYouLearn}</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">{t.home.whatYouLearnDesc}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learnCardKeys.map((key) => (
              <div key={key} className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">{t.home.learnCards[key].title}</h3>
                <p className="text-sm text-muted-foreground">{t.home.learnCards[key].description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="curriculum" className="py-12 sm:py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t.home.curriculum}</h2>
          <p className="text-muted-foreground mb-10">{t.home.curriculumDesc}</p>
          <div className="space-y-6">
            {modules.map((module, moduleIndex) => {
              const Icon = moduleIcons[moduleIndex]
              return (
                <div
                  key={module.name}
                  className="rounded-xl bg-card border border-border overflow-hidden"
                >
                  <div className="p-6 border-b border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          {t.home.moduleLabel} {moduleIndex + 1}
                        </p>
                        <h3 className="text-lg font-semibold text-foreground">{module.name}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {module.lessons.map((lesson) => {
                      const lessonNumber = getLessonNumber(lesson.slug, locale as Locale)
                      return (
                        <Link
                          key={lesson.slug}
                          href={`/${locale}/lesson/${lesson.slug}`}
                          className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm text-muted-foreground font-medium">
                              {lessonNumber}
                            </span>
                            <div>
                              <span className="text-foreground group-hover:text-primary transition-colors block">
                                {lesson.title}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                {lesson.duration}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t.home.readyTitle}</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t.home.readyDesc}</p>
          {firstLesson && (
            <Link href={`/${locale}/lesson/${firstLesson.slug}`}>
              <Button size="lg" className="gap-2">
                {t.home.startFirstLesson}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>{t.home.footer}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Frodex is currently in beta. Features and content may change as the platform evolves.
          </p>
        </div>
      </footer>
    </div>
  )
}
