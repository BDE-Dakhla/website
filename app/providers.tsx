'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { AnalyticsTracker } from '@/components/common/analytics-tracker'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextThemesProvider
        attribute='class'
        defaultTheme='system'
        disableTransitionOnChange
        enableSystem>
        <AnalyticsTracker />
        {children}
      </NextThemesProvider>
    </SessionProvider>
  )
}
