import '../styles/globals.css'

import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'sonner'
import { SEO } from '@/lib/seo'
import { Providers } from './providers'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap', // Improves loading performance and prevents layout shift
  fallback: ['system-ui', 'sans-serif'], // Better fallback fonts
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SEO.url),
  description: SEO.description,
  title: {
    default: SEO.name,
    template: `%s - ${SEO.name}`,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning>
        <NextTopLoader color='#f59e0b' showSpinner={false} />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
