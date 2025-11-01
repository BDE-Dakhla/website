import { notFound, redirect } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { auth } from '@/auth'
import { CookieConsent } from '@/components/shared/cookie-consent'
import { routing } from '@/i18n/routing'
import { checkMaintenanceMode } from '@/lib/maintenance'
import { hasPermission } from '@/lib/permission'

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

  // Check maintenance mode (will be skipped for maintenance page via its own layout)
  let isMaintenanceMode = false
  try {
    const maintenanceCheckPromise = checkMaintenanceMode()
    const timeoutPromise = new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(false), 3000) // 3 second timeout
    })
    isMaintenanceMode = await Promise.race([
      maintenanceCheckPromise,
      timeoutPromise,
    ])
  } catch (error) {
    console.warn('Maintenance mode check failed:', error)
    isMaintenanceMode = false
  }
  if (isMaintenanceMode) {
    const session = await auth()
    const isSystemAdmin =
      session?.user && hasPermission(session.user.permissions, 'SYSTEM_ADMIN')

    if (!isSystemAdmin) {
      // This will be caught by maintenance page's own layout
      redirect(`/${locale}/maintenance`)
    }
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* <StickyBanner
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
      </StickyBanner> */}

      <CookieConsent />

      {children}
    </NextIntlClientProvider>
  )
}
