import { Calendar } from 'lucide-react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { CookieConsent } from '@/components/shared/cookie-consent'
import { StickyBanner } from '@/components/ui/sticky-banner'
import { routing } from '@/i18n/routing'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const messages = (await import(`../../i18n/locales/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <StickyBanner
        className='gap-x-4 border-white/5 border-b bg-black/5 backdrop-blur-3xl'
        disabledRoutes={['/connexion', '/syllabus', '/dashboard']}>
        🎉 Cérémonie d'ouverture
        <hr className='h-4 w-px shrink-0 bg-primary/30' />
        <span className='flex items-center text-sm'>
          Le Bureau Des Étudiants organisent le{' '}
          <span className='mx-1 flex items-center'>
            <span className='reworked-underline'>XX Août 2025</span>
            <Calendar className='!size-4 mb-0.5 ml-1.5' strokeWidth={1.5} />
          </span>
          pour la cérémonie d'ouverture de la nouvelle session universitaire
        </span>
      </StickyBanner>

      <CookieConsent />

      {children}
    </NextIntlClientProvider>
  )
}
