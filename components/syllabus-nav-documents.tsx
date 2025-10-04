'use client'

import type { NavItem } from './nav-main'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { usePathname } from 'next/navigation'
import { useSyllabusNavigation } from '@/contexts/syllabus-navigation'
import { cn } from '@/lib/utils'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar'

interface SyllabusNavDocumentsProps {
  items: Array<NavItem & { name?: string }>
  title?: string
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const SyllabusNavDocuments = ({ items, title }: SyllabusNavDocumentsProps) => {
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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <SidebarMenu>
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.url}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild={pathname !== item.url}
                    disabled={pathname === item.url}
                    tooltip={item.name || item.title}
                    className={cn(
                      'relative overflow-hidden transition-all duration-200 group',
                      pathname === item.url && 'bg-primary/10 text-primary cursor-default border-r-2 border-primary',
                      isNavigating && activeRoute === item.url && 'bg-primary/5',
                      pathname === item.url && 'pointer-events-none',
                      pathname !== item.url && 'hover:bg-primary/5 hover:border-r-2 hover:border-primary/30'
                    )}
                  >
                    {pathname === item.url ? (
                      <div className="flex items-center gap-2 w-full">
                        {item.icon && (
                          <item.icon className="text-primary" />
                        )}
                        <span>{item.name || item.title}</span>
                        <motion.div
                          className="absolute right-2 h-2 w-2 rounded-full bg-primary"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                          }}
                        />
                      </div>
                    ) : (
                      <Link 
                        href={item.url}
                        onClick={(e) => handleNavigation(e, item.url)}
                        className="flex items-center gap-2"
                      >
                        {item.icon && (
                          <motion.div
                            key={`icon-${item.url}`}
                            animate={isNavigating && activeRoute === item.url ? {
                              rotate: 360
                            } : {
                              rotate: 0
                            }}
                            transition={{
                              duration: 0.6,
                              ease: "easeInOut"
                            }}
                          >
                            <item.icon className={cn(
                              'transition-colors duration-200'
                            )} />
                          </motion.div>
                        )}
                        <span>{item.name || item.title}</span>

                        {/* Loading indicator */}
                        <AnimatePresence>
                          {isNavigating && activeRoute === item.url && (
                            <motion.div
                              className="absolute inset-0 bg-primary/5 rounded-md"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </AnimatePresence>
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