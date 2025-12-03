'use client'

import type { MarqueeProps } from 'react-fast-marquee'
import FastMarquee from 'react-fast-marquee'
import { cn } from '@/lib/utils'

export const Marquee = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('relative w-full overflow-hidden', className)}
    {...props}
  />
)

export const MarqueeContent = ({
  loop = 0,
  autoFill = true,
  pauseOnHover = true,
  ...props
}: MarqueeProps) => (
  <FastMarquee
    autoFill={autoFill}
    loop={loop}
    pauseOnHover={pauseOnHover}
    {...props}
  />
)

export type MarqueeFadeProps = React.HTMLAttributes<HTMLDivElement> & {
  side: 'left' | 'right'
}

export const MarqueeFade = ({
  className,
  side,
  ...props
}: MarqueeFadeProps) => (
  <div
    className={cn(
      'absolute top-0 bottom-0 z-10 h-full w-24 from-background to-transparent',
      side === 'left' ? 'left-0 bg-linear-to-r' : 'right-0 bg-linear-to-l',
      className,
    )}
    {...props}
  />
)

export const MarqueeItem = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mx-2 shrink-0 object-contain', className)} {...props} />
)
