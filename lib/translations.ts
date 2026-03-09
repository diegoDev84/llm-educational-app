import type { Locale } from "@/lib/i18n"
import en from "@/content/ui/en.json"
import ptBr from "@/content/ui/pt-br.json"

const ui = { en, "pt-br": ptBr } as const

export type UIStrings = typeof en

export function getTranslations(locale: Locale): UIStrings {
  return ui[locale]
}

/** Replace {key} placeholders in string (e.g. "Lesson {current} of {total}") */
export function replaceParams(text: string, params: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`))
}
