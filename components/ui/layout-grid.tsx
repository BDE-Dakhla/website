'use client'

import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface Card {
  id: number
  content: React.ReactNode | string
  className: string
  thumbnail: string
  alt?: string
}

interface Props {
  cards: Card[]
  className?: string
}

export const LayoutGrid = ({ cards, className }: Props) => {
  const [selected, setSelected] = useState<Card | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (selected) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [selected])

  return (
    <div
      className={cn(
        'relative grid h-full w-full grid-cols-3 grid-rows-2',
        className,
      )}>
      {cards.map((card) => (
        <div className={cn(card.className, 'p-2')} key={card.id}>
          <motion.button
            aria-label='Expand image'
            className='relative block h-full w-full overflow-hidden rounded-xl bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            layoutId={`card-${card.id}`}
            onClick={() => setSelected(card)}
            type='button'>
            <motion.img
              alt={card.alt ?? 'thumbnail'}
              className='absolute inset-0 h-full w-full object-cover object-center'
              height={500}
              layoutId={`image-${card.id}-image`}
              src={card.thumbnail}
              width={500}
            />
          </motion.button>
        </div>
      ))}

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            animate={{ opacity: 1 }}
            className='fixed inset-0 z-[100]'
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key='overlay'>
            {/* Backdrop */}
            <motion.button
              animate={{ opacity: 1 }}
              aria-label='Close'
              className='absolute inset-0 h-full w-full bg-black/80'
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              type='button'
            />

            {/* Image container */}
            <div
              className='absolute inset-0 flex items-center justify-center p-4'
              onClick={() => setSelected(null)}>
              <motion.img
                alt={selected.alt ?? 'selected image'}
                className='max-h-[100vh] max-w-[100vw] rounded-md object-contain shadow-2xl'
                layoutId={`image-${selected.id}-image`}
                onClick={(e) => e.stopPropagation()}
                src={selected.thumbnail}
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              />

              {/* Caption/content (optional) */}
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className='absolute right-0 bottom-0 left-0 p-6 text-white'
                exit={{ opacity: 0, y: 20 }}
                initial={{ opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}>
                <div className='pointer-events-auto max-w-3xl'>
                  {typeof selected.content === 'string' ? (
                    <p className='text-base md:text-lg'>{selected.content}</p>
                  ) : (
                    selected.content
                  )}
                </div>
              </motion.div>

              {/* Close button */}
              <button
                aria-label='Close'
                className='absolute top-4 right-4 inline-flex items-center justify-center rounded-md bg-white/90 px-2.5 py-2 text-foreground shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                onClick={(e) => {
                  e.stopPropagation()
                  setSelected(null)
                }}
                type='button'>
                <X className='size-5' />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
