import type { Metadata } from 'next'
import { SEO } from '@/lib/seo'

export const metadata: Metadata = {
  title: SEO.name,
  description: SEO.description,
  keywords: SEO.keywords,
  authors: [
    {
      name: 'Magic UI',
      url: 'https://magicui.design',
    },
  ],
  creator: 'magicuidesign',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SEO.url,
    title: SEO.name,
    description: SEO.description,
    siteName: SEO.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.name,
    description: SEO.description,
    creator: '@magicuidesign',
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
