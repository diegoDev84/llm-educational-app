"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { modules, lessons } from "@/lib/lessons"
import { ChevronDown, ChevronRight, BookOpen, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarNavigationProps {
  className?: string
}

export function SidebarNavigation({ className }: SidebarNavigationProps) {
  const pathname = usePathname()
  const [expandedModules, setExpandedModules] = useState<number[]>([1, 2, 3, 4, 5])
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentSlug = pathname.split("/").pop()

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">LLM Mastery</h1>
            <p className="text-xs text-muted-foreground">Learn AI Development</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {modules.map((module) => {
            const moduleLessons = lessons.filter(l => l.moduleId === module.id)
            const isExpanded = expandedModules.includes(module.id)
            const hasActiveLesson = moduleLessons.some(l => l.slug === currentSlug)

            return (
              <div key={module.id} className="space-y-1">
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    "hover:bg-secondary text-muted-foreground hover:text-foreground",
                    hasActiveLesson && "text-primary"
                  )}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Module {module.id}
                  </span>
                </button>

                {/* Module Title */}
                <div className="px-3 py-1">
                  <span className="text-sm font-medium text-foreground">
                    {module.name}
                  </span>
                </div>

                {/* Lessons */}
                {isExpanded && (
                  <div className="ml-3 border-l border-border pl-3 space-y-1">
                    {moduleLessons.map((lesson, index) => {
                      const isActive = lesson.slug === currentSlug
                      const lessonNumber = lessons.findIndex(l => l.slug === lesson.slug) + 1

                      return (
                        <Link
                          key={lesson.slug}
                          href={`/lesson/${lesson.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                            "hover:bg-secondary",
                            isActive
                              ? "bg-primary/10 text-primary border-l-2 border-primary -ml-[13px] pl-[23px]"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          )}>
                            {lessonNumber}
                          </span>
                          <span className="line-clamp-1">{lesson.title.replace(/^\d+\.\s*/, "").split(":")[0]}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>14 lessons</p>
          <p className="mt-1">Built for developers</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-sidebar-border z-50",
          "transform transition-transform duration-200 ease-in-out",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
