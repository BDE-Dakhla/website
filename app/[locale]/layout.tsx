import { Calendar, ChevronRight } from 'lucide-react'
import { NextIntlClientProvider } from 'next-intl'
import { CookieConsent } from '@/components/design/cookie-consent'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { StickyBanner } from '@/components/ui/sticky-banner'
import { cn } from '@/lib/utils'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = (await import(`../../i18n/locales/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <StickyBanner
        className='gap-x-4 border-white/5 border-b bg-black/5 backdrop-blur-3xl'
        disabledRoutes={['/connexion', '/syllabus', '/dashboard']}
        hideOnScroll>
        <div className='relative flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]'>
          <span
            className={cn(
              'absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-[length:300%_100%] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 p-[1px]',
            )}
            style={{
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'subtract',
              WebkitClipPath: 'padding-box',
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
            }}
          />
          🎉 <hr className='mx-2 h-4 w-px shrink-0 bg-neutral-500' />
          <AnimatedGradientText className='ttems-center flex font-medium text-sm'>
            Cérémonie d'ouverture
            <ChevronRight className='ml-1 size-3 stroke-neutral-500' />
          </AnimatedGradientText>
        </div>

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
