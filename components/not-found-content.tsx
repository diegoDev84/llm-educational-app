"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Home } from "lucide-react"
import { getTranslations } from "@/lib/translations"
function getLocaleFromPath(pathname: string | null): "en" | "pt-br" {
  if (!pathname) return "en"
  const segment = pathname.split("/")[1]
  return segment === "pt-br" ? "pt-br" : "en"
}

export function NotFoundContent() {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const t = getTranslations(locale)
  const homeHref = `/${locale}`

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t.notFound.title}</h1>
          <p className="text-muted-foreground">{t.notFound.description}</p>
        </div>
        <Link href={homeHref}>
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            {t.notFound.backHome}
          </Button>
        </Link>
      </div>
    </div>
  )
}
