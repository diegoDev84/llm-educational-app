"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n"
import { getTranslations } from "@/lib/translations"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"

interface SiteHeaderProps {
  locale: Locale
  /** Canonical link to the course area (e.g. first lesson or current lesson). */
  courseHref: string
}

function getActiveKey(pathname: string | null, locale: Locale): "home" | "course" | "about" | null {
  if (!pathname) return null
  const segments = pathname.split("/").filter(Boolean)

  const hasLocalePrefix = segments[0] === "en" || segments[0] === "pt-br"
  const baseSegments = hasLocalePrefix ? segments.slice(1) : segments

  if (baseSegments.length === 0) return "home"
  if (baseSegments[0] === "lesson") return "course"
  if (baseSegments[0] === "about") return "about"

  // Fallback: highlight home on unknown sections.
  return "home"
}

export function SiteHeader({ locale, courseHref }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const t = getTranslations(locale)

  const activeKey = getActiveKey(pathname, locale)

  const navItems: { key: "home" | "course" | "about"; href: string; label: string }[] = [
    { key: "home", href: `/${locale}`, label: t.nav.links.home },
    { key: "course", href: courseHref, label: t.nav.links.course },
    { key: "about", href: `/${locale}/about`, label: t.nav.links.about },
  ]

  const renderNavLinks = (variant: "desktop" | "mobile") => (
    <nav
      className={cn(
        "flex items-center gap-1",
        variant === "mobile" && "flex-col items-stretch gap-1.5"
      )}
    >
      {navItems.map((item) => {
        const isActive = activeKey === item.key
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              "hover:bg-secondary hover:text-foreground",
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <Link href={`/${locale}`} className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-semibold leading-tight text-foreground truncate">
                {t.nav.appName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {t.nav.tagline}
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center justify-center flex-1">
          {renderNavLinks("desktop")}
        </div>

        {/* Right side: language + mobile toggle */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3">
            {renderNavLinks("mobile")}
          </div>
        </div>
      )}
    </header>
  )
}

