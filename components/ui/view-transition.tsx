'use client'

import type { ReactNode } from 'react'
import { type MotionProps, motion } from 'framer-motion'

export type ViewTransitionPreset =
  | 'fade'
  | 'slide-up'
  | 'slide-left'
  | 'scale'
  | 'slide-right'

export interface TransitionConfig {
  initial: MotionProps['initial']
  animate: MotionProps['animate']
  exit: MotionProps['exit']
}

const PRESETS: Record<ViewTransitionPreset, TransitionConfig> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  'slide-left': {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  'slide-right': {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
}

export interface ViewTransitionProps {
  children: ReactNode
  keyedBy: string | number
  preset?: ViewTransitionPreset
  duration?: number
  className?: string
  // Allow full override if a custom transition is needed
  configOverride?: TransitionConfig
}

export function ViewTransition({
  children,
  keyedBy,
  preset = 'fade',
  duration = 0.3,
  className,
  configOverride,
}: ViewTransitionProps) {
  const cfg = configOverride ?? PRESETS[preset]
  return (
    <motion.div
      animate={cfg.animate}
      className={className}
      exit={cfg.exit}
      initial={cfg.initial}
      key={keyedBy}
      transition={{ duration }}>
      {children}
    </motion.div>
  )
}
