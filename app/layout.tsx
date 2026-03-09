import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cn } from '@/lib/utils'
import './globals.css'

const geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase:
    process.env.VERCEL_URL != null
      ? new URL(`https://${process.env.VERCEL_URL}`)
      : new URL('http://localhost:3000'),
  title: {
    default: 'LLM Mastery | Learn to Build AI Applications',
    template: '%s | LLM Mastery',
  },
  description: 'Hands-on course on large language models: from transformers and tokens to RAG, function calling, and production deployment. Interactive playground in every lesson.',
  keywords: ['LLM', 'large language models', 'AI', 'prompt engineering', 'RAG', 'OpenAI', 'course', 'tutorial'],
  authors: [{ name: 'LLM Mastery' }],
  openGraph: {
    type: 'website',
    title: 'LLM Mastery | Learn to Build AI Applications',
    description: 'Hands-on course on LLMs: from fundamentals to production. Interactive playground in every lesson.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLM Mastery | Learn to Build AI Applications',
    description: 'Hands-on course on LLMs: from fundamentals to production. Interactive playground in every lesson.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0d' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geist.className, "antialiased")} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
