import { notFound } from "next/navigation"
import { getLessonBySlug, lessons } from "@/lib/lessons"
import { SidebarNavigation } from "@/components/course/sidebar-navigation"
import { LessonContent } from "@/components/course/lesson-content"
import { PlaygroundPanel } from "@/components/course/playground-panel"

interface LessonPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }))
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { slug } = await params
  const lesson = getLessonBySlug(slug)

  if (!lesson) {
    return {
      title: "Lesson Not Found | LLM Mastery",
    }
  }

  return {
    title: `${lesson.title} | LLM Mastery`,
    description: lesson.summary,
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params
  const lesson = getLessonBySlug(slug)

  if (!lesson) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <SidebarNavigation />

      {/* Main Content Area */}
      <div className="lg:pl-72">
        <div className="flex flex-col xl:flex-row min-h-screen">
          {/* Lesson Content */}
          <main className="flex-1 px-6 py-12 lg:px-12 xl:pr-6">
            <LessonContent lesson={lesson} />
          </main>

          {/* Playground Panel - Sticky on desktop, below content on mobile */}
          <aside className="xl:w-[400px] xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto border-t xl:border-t-0 border-border">
            <PlaygroundPanel playground={lesson.playground} />
          </aside>
        </div>
      </div>
    </div>
  )
}
