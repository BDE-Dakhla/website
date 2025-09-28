'use client'

import { X } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { usePathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  hideOnScroll?: boolean
  disabledRoutes?: string[]
}

export const StickyBanner = ({
  className,
  children,
  disabledRoutes = [],
  hideOnScroll = false,
}: React.FC<React.PropsWithChildren<Partial<Props>>>) => {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (hideOnScroll && latest > 40) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  })

  if (disabledRoutes.includes(pathname)) return

  return (
    <motion.div
      animate={{ y: open ? 0 : -100, opacity: open ? 1 : 0 }}
      className={cn(
        'sticky inset-x-0 top-0 z-40 flex min-h-14 w-full items-center justify-center bg-transparent px-4 py-1',
        className,
      )}
      initial={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}>
      {children}

      <motion.button
        animate={{ scale: 1 }}
        className='-translate-y-1/2 absolute top-1/2 right-2 cursor-pointer'
        initial={{ scale: 0 }}
        onClick={() => setOpen(!open)}>
        <X className='h-5 w-5 text-white' />
      </motion.button>
    </motion.div>
  )
}
