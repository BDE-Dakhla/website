'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { sleep } from '@/lib/utils'

interface NavigationContextType {
  isNavigating: boolean
  activeRoute: string | null
  navigateTo: (path: string) => Promise<void>
  setNavigating: (isNavigating: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
)

interface NavigationProviderProps {
  children: ReactNode
}

export function SyllabusNavigationProvider({
  children,
}: NavigationProviderProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [activeRoute, setActiveRoute] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const navigateTo = useCallback(
    async (path: string) => {
      if (path === pathname) return

      setIsNavigating(true)
      setActiveRoute(path)

      try {
        router.push(path)
        await sleep(100)
      } catch (error) {
        console.error('Navigation error:', error)
        setIsNavigating(false)
        setActiveRoute(null)
      }
    },
    [router, pathname],
  )

  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false)
        setActiveRoute(null)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isNavigating])

  const setNavigating = useCallback((navigating: boolean) => {
    setIsNavigating(navigating)
  }, [])

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        activeRoute,
        navigateTo,
        setNavigating,
      }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useSyllabusNavigation() {
  const context = useContext(NavigationContext)

  if (context === undefined) {
    throw new Error(
      'useSyllabusNavigation must be used within a SyllabusNavigationProvider',
    )
  }

  return context
}
