'use client'

import { Moon, SunDim } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Button } from '../ui/button'

export const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const changeTheme = async (): Promise<void> => {
    if (!buttonRef.current) return

    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

    await document.startViewTransition((): void => {
      flushSync((): void => setTheme(newTheme))
    }).ready

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const y = top + height / 2
    const x = left + width / 2
    const maxRad = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  }

  return (
    <Button
      onClick={changeTheme}
      ref={buttonRef}
      size='icon'
      variant='outline'>
      {mounted && (resolvedTheme === 'dark' ? <SunDim /> : <Moon />)}
    </Button>
  )
}
