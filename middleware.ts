import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { defaultLocale, isValidLocale } from "@/lib/i18n"

const LOCALE_COOKIE = "llm-mastery-locale"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple")
  ) {
    return NextResponse.next()
  }

  const segments = pathname.split("/").filter(Boolean)
  const firstSegment = segments[0]

  // Already has a valid locale in path
  if (isValidLocale(firstSegment)) {
    return NextResponse.next()
  }

  // Prefer locale from cookie when visiting /
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  const locale =
    pathname === "/" && cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : defaultLocale
  const newUrl = new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
