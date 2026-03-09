import { notFound } from "next/navigation"
import { isValidLocale } from "@/lib/i18n"
import { LocaleProvider } from "@/components/locale-provider"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  return <LocaleProvider locale={locale}>{children}</LocaleProvider>
}
