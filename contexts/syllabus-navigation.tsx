'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface NavigationContextType {
  isNavigating: boolean
  activeRoute: string | null
  navigateTo: (path: string) => Promise<void>
  setNavigating: (isNavigating: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

interface NavigationProviderProps {
  children: ReactNode
}

export function SyllabusNavigationProvider({ children }: NavigationProviderProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [activeRoute, setActiveRoute] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const navigateTo = useCallback(async (path: string) => {
    if (path === pathname) return
    
    setIsNavigating(true)
    setActiveRoute(path)
    
    try {
      router.push(path)
      // Simulate a small delay for better UX  
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error('Navigation error:', error)
      setIsNavigating(false)
      setActiveRoute(null)
    }
  }, [router, pathname])

  // Reset navigation state when pathname changes
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false)
        setActiveRoute(null)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [pathname, isNavigating])

  const setNavigating = useCallback((navigating: boolean) => {
    setIsNavigating(navigating)
  }, [])

  return (
    <NavigationContext.Provider value={{
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
    throw new Error('useSyllabusNavigation must be used within a SyllabusNavigationProvider')
  }
  return context
}