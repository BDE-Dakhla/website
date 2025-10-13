'use client'

import type { ReactNode } from 'react'
import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.96,
    filter: 'hue-rotate(0deg) brightness(1)',
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'hue-rotate(5deg) brightness(1.02)',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  out: {
    opacity: 0,
    y: -30,
    scale: 0.96,
    filter: 'hue-rotate(-5deg) brightness(0.98)',
    transition: { duration: 0.3, ease: 'easeIn' },
  },
} satisfies Variants

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4,
} satisfies Transition

const contentVariants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: 'easeOut',
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
} satisfies Variants

export function SyllabusPageTransition({
  children,
  className = '',
}: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence initial={false} mode='wait'>
      <motion.div
        animate='in'
        className={`h-full w-full ${className}`}
        exit='out'
        initial='initial'
        key={pathname}
        transition={pageTransition}
        variants={pageVariants}>
        <motion.div
          animate='in'
          className='h-full'
          exit='out'
          initial='initial'
          variants={contentVariants}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const containerVariants = {
  initial: { opacity: 0 },
  in: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
      duration: 0.3,
    },
  },
  out: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: 0.2,
    },
  },
}

const itemVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 400,
      duration: 0.6,
    },
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
} satisfies Variants

interface StaggeredTransitionProps {
  children: ReactNode
  className?: string
}

export function SyllabusStaggeredTransition({
  children,
  className = '',
}: StaggeredTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence initial={false} mode='wait'>
      <motion.div
        animate='in'
        className={`h-full w-full ${className}`}
        exit='out'
        initial='initial'
        key={pathname}
        variants={containerVariants}>
        <motion.div className='h-full' variants={itemVariants}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface TransitionItemProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function SyllabusTransitionItem({
  children,
  className = '',
  delay = 0,
}: TransitionItemProps) {
  return (
    <motion.div
      className={className}
      style={{ '--delay': delay } as React.CSSProperties}
      variants={itemVariants}>
      {children}
    </motion.div>
  )
}

const slideVariants = {
  in: { x: 0, opacity: 1 },
  initial: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  out: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

interface SlideTransitionProps {
  children: ReactNode
  direction?: number
  className?: string
}

export function SyllabusSlideTransition({
  children,
  direction = 1,
  className = '',
}: SlideTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence custom={direction} initial={false} mode='wait'>
      <motion.div
        animate='in'
        className={`h-full w-full ${className}`}
        custom={direction}
        exit='out'
        initial='initial'
        key={pathname}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
        }}
        variants={slideVariants}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

interface ContentFadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function SyllabusContentFadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
}: ContentFadeInProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}
