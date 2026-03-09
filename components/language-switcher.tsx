"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { locales, localeNames, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const LOCALE_STORAGE_KEY = "llm-mastery-locale"

function getLocalStorageLocale(): Locale | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    return stored && (locales as readonly string[]).includes(stored) ? (stored as Locale) : null
  } catch {
    return null
  }
}

const LOCALE_COOKIE = "llm-mastery-locale"

export function setStoredLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    // Persist for middleware (e.g. next visit to /)
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`
  } catch {
    // ignore
  }
}

/** Path with a different locale (e.g. /en/lesson/slug -> /pt-br/lesson/slug) */
function pathWithLocale(pathname: string, newLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length > 0 && (segments[0] === "en" || segments[0] === "pt-br")) {
    segments[0] = newLocale
    return "/" + segments.join("/")
  }
  return `/${newLocale}`
}

interface LanguageSwitcherProps {
  currentLocale: Locale
  className?: string
}

export function LanguageSwitcher({ currentLocale, className }: LanguageSwitcherProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex items-center gap-0.5 rounded-lg border border-border bg-secondary/30 p-0.5", className)}>
      {locales.map((locale) => {
        const isActive = locale === currentLocale
        const href = pathWithLocale(pathname ?? `/${currentLocale}`, locale)
        return (
          <Link
            key={locale}
            href={href}
            onClick={() => setStoredLocale(locale)}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {localeNames[locale]}
          </Link>
        )
      })}
    </div>
  )
}

export { getLocalStorageLocale }
