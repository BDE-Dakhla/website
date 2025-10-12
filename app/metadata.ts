import type { Metadata } from 'next'
import { SEO } from '@/lib/seo'
import { LANGS, defaultLocale } from '@/i18n/routing'

const activeLocales = LANGS.filter((l) => !l.disabled).map((l) => l.locale)
const languageAlternates = Object.fromEntries(
  activeLocales.map((l) => [l, l === defaultLocale ? '/' : `/${l}`]),
) as Record<string, string>

export const metadata: Metadata = {
  title: SEO.name,
  description: SEO.description,
  keywords: SEO.keywords,
  applicationName: SEO.name,
  authors: [
    {
      name: 'BDE Dakhla',
      url: 'https://encgd.bde-dakhla.org',
    },
  ],
  creator: 'bde-dakhla',
  category: 'education',
  alternates: {
    canonical: '/',
    languages: languageAlternates,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SEO.url,
    title: SEO.name,
    description: SEO.description,
    siteName: SEO.name,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.name,
    description: SEO.description,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icons/logo.png', type: 'image/png' }],
    apple: [{ url: '/icons/logo.png' }],
  },
}
