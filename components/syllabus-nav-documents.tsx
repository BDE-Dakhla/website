'use client'

import type { NavItem } from './nav-main'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useSyllabusNavigation } from '@/contexts/syllabus-navigation'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar'

interface SyllabusNavDocumentsProps {
  items: Array<NavItem>
  title?: string
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const SyllabusNavDocuments = ({
  items,
  title,
}: SyllabusNavDocumentsProps) => {
  const pathname = usePathname()
  const { isNavigating, activeRoute, navigateTo } = useSyllabusNavigation()

  const handleNavigation = async (
    e: React.MouseEvent,
    url: string,
    disabled?: boolean,
  ) => {
    e.preventDefault()
    // Don't navigate if disabled or already on the current route
    if (disabled || pathname === url) {
      return
    }
    await navigateTo(url)
  }

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <motion.div
        animate='visible'
        initial='hidden'
        variants={containerVariants}>
        <SidebarMenu>
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                animate='visible'
                exit='exit'
                initial='hidden'
                key={item.url}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                variants={itemVariants}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild={!item.disabled && !pathname.includes(item.url)}
                    className={cn(
                      'group relative overflow-hidden transition-all',
                      {
                        'bg-primary/10 text-primary': pathname.includes(
                          item.url,
                        ),
                        'hover:bg-primary/5':
                          !item.disabled && !pathname.includes(item.url),
                        'bg-primary/5':
                          isNavigating && activeRoute === item.url,
                        'opacity-50 cursor-not-allowed': item.disabled,
                      },
                    )}
                    disabled={item.disabled || pathname.includes(item.url)}
                    tooltip={item.title}>
                    {item.disabled ? (
                      <div className='flex w-full cursor-not-allowed items-center justify-between gap-2'>
                        <div className='flex items-center gap-2'>
                          {item.icon && (
                            <item.icon className={cn('transition-colors')} />
                          )}
                          <span>{item.title}</span>
                        </div>
                        {item.tooltip && (
                          <Badge className='ml-auto' variant='secondary'>
                            {item.tooltip}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <Link
                        className='flex w-full items-center justify-between'
                        href={item.url}
                        onClick={(e) =>
                          handleNavigation(e, item.url, item.disabled)
                        }>
                        <div className='flex items-center gap-2'>
                          {item.icon && (
                            <item.icon className={cn('transition-colors')} />
                          )}
                          <span>{item.title}</span>
                        </div>
                        {item.tooltip && (
                          <Badge className='ml-auto' variant='secondary'>
                            {item.tooltip}
                          </Badge>
                        )}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </SidebarMenu>
      </motion.div>
    </SidebarGroup>
  )
}
