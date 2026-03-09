/**
 * Simple i18n config. Add new locales here and create content/lessons/{locale} + content/ui/{locale}.json
 */
export const locales = ["en", "pt-br"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  "pt-br": "Português (BR)",
}

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/")[1]
  return segment && isValidLocale(segment) ? segment : null
}

/** Path without locale prefix (e.g. /lesson/how-llms-work) */
export function pathWithoutLocale(pathname: string): string {
  const segment = pathname.split("/")[1]
  if (segment && isValidLocale(segment)) {
    return pathname.slice(segment.length + 1) || "/"
  }
  return pathname
}
