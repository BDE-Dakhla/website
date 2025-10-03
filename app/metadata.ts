import type { Metadata } from 'next'
import { SEO } from '@/lib/seo'

export const metadata: Metadata = {
  title: SEO.name,
  description: SEO.description,
  keywords: SEO.keywords,
  authors: [
    {
      name: 'BDE Dakhla',
      url: 'https://encgd.bde-dakhla.org',
    },
  ],
  creator: 'bde-dakhla',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SEO.url,
    title: SEO.name,
    description: SEO.description,
    siteName: SEO.name,
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
}
