'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import {
  ArrowRight,
  Code2,
  Copy,
  type LucideIcon,
  Rocket,
  Zap,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '@/lib/utils'

export interface TeamCardProps {
  name: string
  poste: string
  description: string

  specs?: string[]
  styles?: React.CSSProperties
  icon: LucideIcon
  category?: string
}

const celluleStyles = tv({
  base: 'bg-gradient-to-br',
  variants: {
    color: {
      pilotage: 'from-red-500/45 via-red-500/30 to-red-500/10',
      communication: 'from-green-500/45 via-green-500/30 to-green-500/10',
      evenementiel: 'from-[#ffaa40] via-[#9c40ff] to-[#ffaa40]',
      formation: 'from-[#ffaa40] via-[#9c40ff] to-[#ffaa40]',
    },
  },
})

const gradientSize = 200
const gradientColor = '#262626'
const gradientOpacity = 0.8
const gradientFrom = '#9E7AFF'
const gradientTo = '#FE8BBB'

export default function TeamCard({
  name,
  poste,
  icon: Icon,
  description,
  specs = [],
  category,
  styles,
}: TeamCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)
  const reset = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [mouseX, mouseY])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY],
  )

  useEffect(() => {
    reset()
  }, [reset])

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        reset()
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') {
        reset()
      }
    }

    window.addEventListener('pointerout', handleGlobalPointerOut)
    window.addEventListener('blur', reset)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('pointerout', handleGlobalPointerOut)
      window.removeEventListener('blur', reset)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [reset])

  const posteName = poste
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(' ')
    .join('-')

  return (
    <li
      className='group relative h-[360px] w-full max-w-[300px] rounded-2xl [perspective:2000px]'
      onBlur={(): void => setIsFlipped(false)}
      onFocus={(): void => setIsFlipped(true)}
      onMouseEnter={(): void => setIsFlipped(true)}
      onMouseLeave={(): void => setIsFlipped(false)}
      tabIndex={0}>
      <div
        className={cn(
          'relative h-full w-full',
          '[transform-style:preserve-3d]',
          'transition-all duration-700',
          isFlipped
            ? '[transform:rotateY(180deg)]'
            : '[transform:rotateY(0deg)]',
        )}>
        <div
          about='front-card'
          className={cn(
            'absolute inset-0 h-full w-full',
            '[backface-visibility:hidden] [transform:rotateY(0deg)]',
            'overflow-hidden rounded-2xl',
            'bg-gradient-to-br from-white via-slate-50 to-slate-100',
            'dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800',
            'shadow-[0_16px_45.5px_0_rgba(0,0,0,0.50),0_-88px_163.5px_0_rgba(0,0,0,0.89)_inset]',
            'transition-all duration-700',
            isFlipped ? 'opacity-0' : 'opacity-100',
          )}
          style={{
            background: `url(/team/${posteName}.jpg) no-repeat center`,
            backgroundSize: styles?.backgroundSize ?? 'cover',
            ...styles,
          }}>
          <div className='custom-borders absolute right-0 bottom-4 left-0 mx-2.5 grid h-[70px] grid-cols-[1fr_45px] overflow-hidden rounded-2xl bg-gradient-to-tl from-[#000000]/70 to-[#1B1B1B]/70 pl-4 shadow-[0_15px_52.3px_0_rgba(0,0,0,0.51)] backdrop-blur-xs transition-transform duration-700 group-hover:translate-y-full group-hover:scale-0'>
            <div className='flex flex-col justify-center'>
              <p className='flex max-w-[195px] text-white uppercase opacity-75'>
                <Icon className='mr-2' />
                <span className='truncate text-sm'>{poste}</span>
              </p>
              <p
                className='max-w-[195px] truncate font-bold text-lg text-white uppercase tracking-wider'
                title={name}>
                {name}
              </p>
            </div>
            <div className='grid place-items-center rounded-tr-2xl rounded-br-2xl bg-white/10'>
              <ArrowRight color='white' />
            </div>
          </div>
        </div>

        <div
          about='back-card'
          className={cn(
            'absolute inset-0 h-full w-full',
            '[backface-visibility:hidden] [transform:rotateY(180deg)]',
            'rounded-2xl p-5',
            'shadow-lg dark:shadow-xl',
            'custom-borders flex flex-col',
            'transition-all duration-700',
            !isFlipped ? 'opacity-0' : 'opacity-100',
          )}
          onPointerEnter={reset}
          onPointerLeave={reset}
          onPointerMove={handlePointerMove}>
          <motion.div
            className='pointer-events-none absolute inset-0 rounded-[inherit] bg-border duration-300 group-hover:opacity-100'
            style={{
              background: useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientFrom}, ${gradientTo}, var(--border) 100%)`,
            }}
          />
          <div className='absolute inset-px rounded-[inherit] bg-background' />
          <motion.div
            className='pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            style={{
              background: useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`,
              opacity: gradientOpacity,
            }}
          />

          <div className='relative z-10 flex-1 space-y-5'>
            <div className='space-y-2'>
              <div className='mb-2 flex items-center gap-2'>
                <div
                  className={celluleStyles({
                    className:
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                    color:
                      category as keyof typeof celluleStyles.variants.color,
                  })}>
                  <Icon className='h-4 w-4 text-white' />
                </div>
                <h3 className='ml-2 font-semibold text-lg text-zinc-900 uppercase leading-snug tracking-tight transition-all duration-500 ease-out dark:text-white'>
                  {name}
                </h3>
              </div>
              <p className='mt-3 text-sm text-zinc-600 tracking-tight transition-all duration-500 ease-out dark:text-zinc-400'>
                {description}.
              </p>
            </div>

            <div className='space-y-2.5'>
              {specs.map((feature, index) => {
                const icons = [Copy, Code2, Rocket, Zap]
                const IconComponent = icons[index % icons.length]

                return (
                  <div
                    className='flex items-center gap-3 text-sm text-zinc-700 transition-all duration-500 dark:text-zinc-300'
                    key={feature}
                    style={{
                      transform: isFlipped
                        ? 'translateX(0)'
                        : 'translateX(-20px)',
                      opacity: isFlipped ? 1 : 0,
                      transitionDelay: `${index * 100 + 200}ms`,
                    }}>
                    <div className='flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 dark:bg-primary/20'>
                      <IconComponent className='h-3 w-3 text-primary' />
                    </div>
                    <span className='font-medium'>{feature}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='relative z-10 mt-auto border-slate-200 border-t pt-4 dark:border-zinc-800'>
            <div
              className={cn(
                'group/start relative',
                'flex items-center justify-between',
                'rounded-lg p-2.5',
                'transition-all duration-300',
                'bg-gradient-to-r from-slate-100 via-slate-100 to-slate-100',
                'dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800',
                'hover:from-primary/10 hover:via-primary/5 hover:to-transparent',
                'dark:hover:from-primary/20 dark:hover:via-primary/10 dark:hover:to-transparent',
                'hover:scale-[1.02] hover:cursor-pointer',
                'border border-transparent hover:border-primary/20',
              )}>
              <span className='font-semibold text-sm text-zinc-900 transition-colors duration-300 group-hover/start:text-primary dark:text-white'>
                Start Building
              </span>
              <div className='group/icon relative'>
                <div
                  className={cn(
                    'absolute inset-[-6px] rounded-lg transition-all duration-300',
                    'bg-gradient-to-br from-primary/20 via-primary/10 to-transparent',
                    'scale-90 opacity-0 group-hover/start:scale-100 group-hover/start:opacity-100',
                  )}
                />
                <ArrowRight className='relative z-10 h-4 w-4 text-primary transition-all duration-300 group-hover/start:translate-x-1 group-hover/start:scale-110' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
