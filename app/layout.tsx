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
    default: 'Frodex — Explore how language models actually work',
    template: '%s | Frodex',
  },
  description:
    'Interactive lessons and playground experiments to understand how large language models behave in real systems.',
  keywords: ['LLM', 'large language models', 'AI', 'prompt engineering', 'RAG', 'OpenAI', 'course', 'tutorial'],
  authors: [{ name: 'Frodex' }],
  openGraph: {
    type: 'website',
    title: 'Frodex — Explore how language models actually work',
    description:
      'Interactive lessons and playground experiments to understand how large language models behave in real systems.',
    images: [
      {
        url: '/frodex-logo.png',
        alt: 'Frodex',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frodex — Explore how language models actually work',
    description:
      'Interactive lessons and playground experiments to understand how large language models behave in real systems.',
    images: ['/frodex-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/frodex-logo.png',
        type: 'image/png',
      },
    ],
    shortcut: '/frodex-logo.png',
    apple: '/frodex-logo.png',
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
