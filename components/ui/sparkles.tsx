'use client'

import type {
  Container,
  IColorAnimation,
  ISourceOptions,
} from '@tsparticles/engine'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { motion, useAnimation } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ParticlesProps {
  className: string
  background: string
  minSize: number
  maxSize: number
  speed: number
  particleDensity: number
}

export const SparklesCore = ({
  className,
  background,
  minSize,
  maxSize,
  speed,
  particleDensity,
}: Partial<ParticlesProps>) => {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(
      async (engine): Promise<void> => await loadSlim(engine),
    ).then((): void => setInit(true))
  }, [])

  const controls = useAnimation()
  const animation: IColorAnimation = {
    count: 0,
    enable: false,
    speed: 1,
    decay: 0,
    delay: 0,
    sync: true,
    offset: 0,
  }

  const options: ISourceOptions = {
    detectRetina: true,
    background: { color: { value: background as string } },
    fullScreen: { enable: false, zIndex: 1 },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: false, mode: 'repulse' },
        resize: { enable: true },
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      bounce: { horizontal: { value: 1 }, vertical: { value: 1 } },
      collisions: {
        absorb: { speed: 2 },
        bounce: { horizontal: { value: 1 }, vertical: { value: 1 } },
        enable: false,
        maxSpeed: 50,
        mode: 'bounce',
        overlap: { enable: true, retries: 0 },
      },
      color: {
        value: '#ffffff',
        animation: { h: animation, s: animation, l: animation },
      },
      effect: { close: true, fill: true },
      move: {
        angle: { offset: 0, value: 90 },
        attract: { distance: 200, enable: false, rotate: { x: 3000, y: 3000 } },
        center: { x: 50, y: 50, mode: 'percent', radius: 0 },
        decay: 0,
        distance: {},
        direction: 'none',
        drift: 0,
        enable: true,
        gravity: {
          acceleration: 9.81,
          enable: false,
          inverse: false,
          maxSpeed: 50,
        },
        warp: false,
        size: false,
        random: false,
        vibrate: false,
        straight: false,
        speed: { min: 0.1, max: 1 },
        outModes: { default: 'out' },
        spin: { acceleration: 0, enable: false },
        trail: { enable: false, length: 10, fill: {} },
        path: { clamp: true, delay: { value: 0 }, enable: false, options: {} },
      },
      number: {
        density: { enable: true, width: 400, height: 400 },
        limit: { mode: 'delete', value: 0 },
        value: particleDensity || 120,
      },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: {
          count: 0,
          enable: true,
          speed: speed || 4,
          decay: 0,
          delay: 0,
          sync: false,
          mode: 'auto',
          startValue: 'random',
          destroy: 'none',
        },
      },
      reduceDuplicates: false,
      shadow: {
        blur: 0,
        color: { value: '#000' },
        enable: false,
        offset: { x: 0, y: 0 },
      },
      shape: { close: true, fill: true, options: {}, type: 'circle' },
      size: {
        value: { min: minSize || 1, max: maxSize || 3 },
        animation: {
          count: 0,
          enable: false,
          speed: 5,
          decay: 0,
          delay: 0,
          sync: false,
          mode: 'auto',
          startValue: 'random',
          destroy: 'none',
        },
      },
      stroke: { width: 0 },
      zIndex: { value: 0, opacityRate: 1, sizeRate: 1, velocityRate: 1 },
      destroy: {
        bounds: {},
        mode: 'none',
        split: {
          count: 1,
          sizeOffset: true,
          factor: { value: 3 },
          rate: { value: { min: 4, max: 9 } },
        },
      },
      roll: {
        darken: { enable: false, value: 0 },
        enable: false,
        enlighten: { enable: false, value: 0 },
        mode: 'vertical',
        speed: 25,
      },
      tilt: {
        value: 0,
        enable: false,
        direction: 'clockwise',
        animation: { enable: false, speed: 0, decay: 0, sync: false },
      },
      twinkle: {
        lines: { enable: false, frequency: 0.05, opacity: 1 },
        particles: { enable: false, frequency: 0.05, opacity: 1 },
      },
      wobble: {
        distance: 5,
        enable: false,
        speed: { angle: 50, move: 10 },
      },
      life: {
        count: 0,
        delay: { value: 0, sync: false },
        duration: { value: 0, sync: false },
      },
      rotate: {
        value: 0,
        path: false,
        direction: 'clockwise',
        animation: { enable: false, speed: 0, decay: 0, sync: false },
      },
      orbit: {
        animation: {
          count: 0,
          enable: false,
          speed: 1,
          decay: 0,
          delay: 0,
          sync: false,
        },
        enable: false,
        opacity: 1,
        rotation: { value: 45 },
        width: 1,
      },
      links: {
        width: 1,
        opacity: 1,
        warp: false,
        frequency: 1,
        blink: false,
        distance: 100,
        enable: false,
        consent: false,
        color: { value: '#fff' },
        triangles: { enable: false, frequency: 1 },
        shadow: { blur: 5, color: { value: '#000' }, enable: false },
      },
      repulse: {
        value: 0,
        enabled: false,
        distance: 1,
        duration: 1,
        factor: 1,
        speed: 1,
      },
    },
  }

  const particlesLoaded = async (container?: Container): Promise<void> => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: {
          duration: 1,
        },
      })
    }
  }

  return (
    <motion.div animate={controls} className={cn('opacity-0', className)}>
      {init && (
        <Particles
          className={cn('h-full w-full')}
          id='partners'
          options={options}
          particlesLoaded={particlesLoaded}
        />
      )}
    </motion.div>
  )
}
