'use client'

import type { NavItem } from './nav-main'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useSyllabusNavigation } from '@/contexts/syllabus-navigation'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'
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

  const handleNavigation = async (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    // Don't navigate if already on the current route
    if (pathname === url) {
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
                    asChild={!pathname.includes(item.url)}
                    className={cn(
                      'group relative overflow-hidden transition-all',
                      {
                        'bg-primary/10 text-primary': pathname.includes(
                          item.url,
                        ),
                        'hover:bg-primary/5': !pathname.includes(item.url),
                        'bg-primary/5':
                          isNavigating && activeRoute === item.url,
                      },
                    )}
                    disabled={pathname.includes(item.url)}
                    tooltip={item.title}>
                    <Link
                      className='flex items-center gap-2'
                      href={item.url}
                      onClick={(e) => handleNavigation(e, item.url)}>
                      {item.icon && (
                        <item.icon className={cn('transition-colors')} />
                      )}
                      {item.title}
                    </Link>
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
