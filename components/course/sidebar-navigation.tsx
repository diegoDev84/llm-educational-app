"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getModules, getLessonNumber } from "@/lib/lessons"
import { getTranslations } from "@/lib/translations"
import { useLocale } from "@/components/locale-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarNavigationProps {
  className?: string
}

export function SidebarNavigation({ className }: SidebarNavigationProps) {
  const pathname = usePathname()
  const locale = useLocale()
  const t = getTranslations(locale)
  const modules = getModules(locale)
  const [expandedModules, setExpandedModules] = useState<string[]>(
    modules.map((m) => m.name)
  )
  const [mobileOpen, setMobileOpen] = useState(false)

  const segments = pathname?.split("/").filter(Boolean) ?? []
  const currentSlug = segments[0] === "en" || segments[0] === "pt-br" ? segments[2] : segments[0]

  const toggleModule = (moduleName: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleName)
        ? prev.filter(name => name !== moduleName)
        : [...prev, moduleName]
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <Image
              src="/frodex-logo.png"
              alt={t.nav.appName}
              width={32}
              height={32}
              priority
              className="w-8 h-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-foreground">{t.nav.appName}</h1>
            <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shrink-0">
              Beta
            </span>
          </div>
        </Link>
        <div className="mt-3">
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {modules.map((module, moduleIndex) => {
            const isExpanded = expandedModules.includes(module.name)
            const hasActiveLesson = module.lessons.some(l => l.slug === currentSlug)

            return (
              <div key={module.name} className="space-y-1">
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.name)}
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
                    {t.nav.moduleLabel} {moduleIndex + 1}
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
                    {module.lessons.map((lesson) => {
                      const isActive = lesson.slug === currentSlug
                      const lessonNumber = getLessonNumber(lesson.slug, locale)

                      return (
                        <Link
                          key={lesson.slug}
                          href={`/${locale}/lesson/${lesson.slug}`}
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
          <p>{t.nav.lessonsCount}</p>
          <p className="mt-1">{t.nav.builtFor}</p>
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
        className="fixed top-4 left-4 z-50 lg:hidden h-10 w-10 rounded-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
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
