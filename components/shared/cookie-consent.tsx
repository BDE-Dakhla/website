'use client'

import Cookies from 'js-cookie'
import { Cookie } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'

const CookieConsent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hide, setHide] = useState(false)

  const handleDismiss = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      setHide(true)
    }, 700)
  }, [])

  const handleAccept = useCallback(() => {
    Cookies.set('cookieConsent', 'true', { expires: 365 })
    handleDismiss()
  }, [handleDismiss])

  useEffect(() => {
    try {
      setIsOpen(true)
      const isConsenting = Boolean(Cookies.get('cookieConsent'))
      if (isConsenting) handleDismiss()
    } catch (error) {
      console.warn('Cookie consent error:', error)
    }
  }, [handleDismiss])

  if (hide) return null

  const containerClasses = cn(
    'fixed z-50 transition-all duration-700',
    !isOpen ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100',
    className,
  )

  const commonWrapperProps = {
    className: cn(
      containerClasses,
      'left-0 right-0 sm:left-4 bottom-4 w-full sm:max-w-3xl',
    ),
    ...props,
  }

  return (
    <div {...commonWrapperProps}>
      <Card className='mx-3 p-0 py-3 shadow-lg'>
        <CardContent className='grid gap-4 p-0 px-3.5 sm:flex'>
          <CardDescription className='flex flex-1 items-center text-xs sm:text-sm'>
            <Cookie className='mx-1 mr-4 size-6 shrink-0' />
            <span>
              We use cookies to ensure you get the best experience on our
              website. For more information on how we use cookies, please see
              <Link
                className='reworked-underline ml-1 text-black'
                href='/privacy'>
                our cookie policy.
              </Link>
            </span>
          </CardDescription>
          <div className='flex items-center justify-end gap-2 sm:gap-3'>
            <Button onClick={handleDismiss} size='sm' variant='secondary'>
              Decline
            </Button>
            <Button onClick={handleAccept} size='sm'>
              Accept
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { CookieConsent }
