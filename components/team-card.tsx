'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { ArrowRight, CodeXml, type LucideIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '@/lib/utils'
import { AnimatedGradientText } from './ui/animated-gradient-text'

export interface TeamCardProps {
  name: string
  poste: string
  description: string

  isCreator?: boolean
  specs?: Array<{ name: string; icon: LucideIcon }>
  styles?: React.CSSProperties
  icon: LucideIcon
  category?: string
}

const celluleStyles = tv({
  base: 'bg-gradient-to-br',
  variants: {
    color: {
      pilotage:
        'text-red-500 bg-gradient-to-br from-red-500/45 via-red-500/30 to-red-500/10',
      communication:
        'text-green-500 bg-gradient-to-br from-green-500/45 via-green-500/30 to-green-500/10',
      evenementiel:
        'text-[#ffaa40] bg-gradient-to-br from-[#ffaa40] via-[#9c40ff] to-[#ffaa40]',
      formation:
        'text-[#ffaa40] bg-gradient-to-br from-[#ffaa40] via-[#9c40ff] to-[#ffaa40]',
    },
  },
})

const specBgColor = {
  pilotage: 'text-red-500 bg-red-500/20',
  communication: 'text-green-500 bg-green-500/20',
  evenementiel: 'text-[#ffaa40] bg-[#ffaa40]/20',
  formation: 'text-[#ffaa40] bg-[#ffaa40]/20',
}

const gradientSize = 200
const gradientColor = '#262626'
const gradientOpacity = 0.4
const gradientFrom = '#9E7AFF'
const gradientTo = '#FE8BBB'

export default function TeamCard({
  name,
  poste,
  icon: Icon,
  description,
  isCreator,
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

  const containerRef = useRef<HTMLLIElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!isCreator) return

    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current
        setDimensions({ width: offsetWidth, height: offsetHeight })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [isCreator])

  useEffect(() => {
    if (!isCreator) return
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current
      setDimensions({ width: offsetWidth, height: offsetHeight })
    }
  }, [isCreator])

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

  const neonBorderSize = 2
  const neonBorderRadiusPx = 16
  const neonFirstColor = '#ff00aa'
  const neonSecondColor = '#00FFF1'

  const neonStyle = isCreator
    ? ({
        '--border-size': `${neonBorderSize}px`,
        '--border-radius': `${neonBorderRadiusPx}px`,
        '--neon-first-color': neonFirstColor,
        '--neon-second-color': neonSecondColor,
        '--card-width': `${dimensions.width}px`,
        '--card-height': `${dimensions.height}px`,
        '--pseudo-element-background-image': `linear-gradient(0deg, ${neonFirstColor}, ${neonSecondColor})`,
        '--pseudo-element-width': `${dimensions.width + neonBorderSize * 2}px`,
        '--pseudo-element-height': `${dimensions.height + neonBorderSize * 2}px`,
        '--after-blur': `${dimensions.width / 6}px`,
      } as React.CSSProperties)
    : undefined

  return (
    <li
      className={cn(
        'group relative h-[360px] w-full max-w-[300px] rounded-2xl [perspective:2000px]',
        isCreator && [
          'z-10',
          'before:-top-[var(--border-size)] before:-left-[var(--border-size)] before:-z-10 before:absolute before:block',
          "before:h-[var(--pseudo-element-height)] before:w-[var(--pseudo-element-width)] before:rounded-[inherit] before:content-['']",
          'before:bg-[length:100%_200%] before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))]',
          'before:animate-background-position-spin',
          'after:-top-[var(--border-size)] after:-left-[var(--border-size)] after:-z-10 after:absolute after:block',
          "after:h-[var(--pseudo-element-height)] after:w-[var(--pseudo-element-width)] after:rounded-[inherit] after:blur-[var(--after-blur)] after:content-['']",
          'after:bg-[length:100%_200%] after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] after:opacity-50',
          'after:animate-background-position-spin',
        ],
      )}
      onBlur={(): void => setIsFlipped(false)}
      onFocus={(): void => setIsFlipped(true)}
      onMouseEnter={(): void => setIsFlipped(true)}
      onMouseLeave={(): void => setIsFlipped(false)}
      ref={containerRef}
      style={neonStyle}
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
          {isCreator && (
            <div className='-translate-x-1/2 group-hover:-translate-y-10 absolute top-3 left-1/2 flex items-center justify-center text-nowrap rounded-full bg-foreground/75 px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-lg transition-all duration-700 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-background/75'>
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
              <CodeXml className='!size-4 text-white' />
              <hr className='mx-3 h-4 w-px shrink-0 bg-white/30' />
              <AnimatedGradientText className='font-bold text-sm uppercase'>
                Développeur du site
              </AnimatedGradientText>
            </div>
          )}
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

          {useTheme().theme === 'dark' && (
            <motion.div
              className='pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100'
              style={{
                background: useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`,
                opacity: gradientOpacity,
              }}
            />
          )}

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
              {specs.map((spec, index) => (
                <div
                  className='flex items-center gap-3 text-sm text-zinc-700 transition-all duration-500 dark:text-zinc-300'
                  key={`${spec.icon.name}-${index}`}
                  style={{
                    transform: isFlipped
                      ? 'translateX(0)'
                      : 'translateX(-20px)',
                    opacity: isFlipped ? 1 : 0,
                    transitionDelay: `${index * 100 + 200}ms`,
                  }}>
                  <div
                    className={cn(
                      'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md',
                      specBgColor[category as keyof typeof specBgColor],
                    )}>
                    <spec.icon className='h-3 w-3 text-inherit' />
                  </div>
                  <span className='font-medium'>{spec.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
