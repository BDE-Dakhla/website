'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { SyllabusTransitionItem } from '@/components/syllabus-page-transition'
import { Button } from '@/components/ui/button'
import { ViewTransition } from '@/components/ui/view-transition'

export function Greetings() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className='grid gap-4 lg:grid-cols-12'
      initial={{ opacity: 0 }}
      transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}>
      <SyllabusTransitionItem className='relative flex flex-col gap-6 overflow-hidden rounded-xl border bg-card px-6 py-6 text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-md lg:col-span-12 xl:col-span-6'>
        <div className='grid items-center pt-6 lg:grid-cols-3'>
          <div className='space-y-4 lg:col-span-2'>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className='font-display text-3xl'
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.6 }}>
              Bonjour, Walid
              <span className='ml-2 select-none text-4xl'>👋</span>
            </motion.div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className='text-2xl'
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.6 }}>
              What do you want to learn today with your partner?
            </motion.div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className='text-muted-foreground'
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.6 }}>
              Discover courses, track progress, and achieve your learning goods
              seamlessly.
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className='pt-2'
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.6, duration: 0.6 }}>
              <Button className='bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl'>
                Explorer les cours
              </Button>
            </motion.div>
          </div>

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.7, duration: 0.8, type: 'spring' }}>
            <Image
              alt='Illustration'
              className='block w-full dark:hidden'
              decoding='async'
              draggable={false}
              height={50}
              loading='lazy'
              src={`/academy-dashboard-${mounted ? theme || 'light' : 'light'}.svg`}
              width={100}
            />
          </motion.div>
        </div>

        <ViewTransition keyedBy='decoration' preset="fade" >
          <Image
            alt='decoration'
            className='pointer-events-none absolute inset-0 aspect-auto select-none'
            decoding='async'
            draggable={false}
            height={300}
            loading='lazy'
            src='/star-shape.png'
            width={800}
          />
        </ViewTransition>
      </SyllabusTransitionItem>

      <SyllabusTransitionItem
        className='group relative flex h-full flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground transition-colors duration-300 hover:border-primary/30 lg:col-span-6 xl:col-span-3'
        delay={0.8}>
        <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
      </SyllabusTransitionItem>
      <SyllabusTransitionItem
        className='group relative flex h-full flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground transition-colors duration-300 hover:border-primary/30 lg:col-span-6 xl:col-span-3'
        delay={0.9}>
        <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
      </SyllabusTransitionItem>
    </motion.div>
  )
}
