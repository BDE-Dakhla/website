'use client'

import {
  BadgeQuestionMark,
  BookOpen,
  BookUser,
  Brain,
  Calendar,
  Camera,
  CirclePlus,
  Clock,
  FileIcon,
  Inbox,
  LibraryBig,
  Loader2,
} from 'lucide-react'
import { SyllabusNavDocuments } from '@/components/syllabus-nav-documents'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavLinks } from './nav-links'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useSyllabusNavigation } from '@/contexts/syllabus-navigation'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const data = {
  navMain: [],
  public: [
    {
      name: 'Calendrier annuel',
      url: '/syllabus/calendar',
      icon: Calendar,
    },
    { name: 'Emploi du temps', url: '/syllabus/schedule', icon: Clock },
    {
      name: 'Contact des professeurs',
      url: '/syllabus/contacts',
      icon: BookUser,
    },
  ],
  navItems: [
    {
      title: 'Ressources',
      url: '/syllabus/resources',
      icon: LibraryBig,
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: Camera,
      isActive: true,
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' },
      ],
    },
    {
      title: 'Proposal',
      icon: FileIcon,
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' },
      ],
    },
    {
      title: 'Prompts',
      icon: Brain,
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' },
      ],
    },
  ],
  navSecondary: [
    { title: 'Documentation', url: '/syllabus/docs', icon: BookOpen },
    {
      title: "Obtenir de l'aide",
      url: '/syllabus/help',
      icon: BadgeQuestionMark,
    },
  ],
}

export function SyllabusSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isNavigating, activeRoute, navigateTo } = useSyllabusNavigation()
  const pathname = usePathname()

  const handleNavigation = async (url: string) => {
    await navigateTo(url)
  }

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='relative flex items-center space-x-3 p-1.5'>
            {/* Green accent bar */}
            <div className='absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full opacity-60' />
            
            <motion.div
              animate={{ rotate: isNavigating ? 360 : 0 }}
              transition={{ duration: 0.8, repeat: isNavigating ? Infinity : 0, ease: "linear" }}
              className='relative'
            >
              {/* Green glow effect */}
              <div className='absolute inset-0 bg-primary/20 rounded-full blur-sm' />
              <svg
                aria-label='label'
                className='!h-5.5 !w-5.5 text-primary relative z-10'
                fill='none'
                height='24'
                role='img'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                width='24'
                xmlns='http://www.w3.org/2000/svg'>
                <path d='M5.636 5.636a9 9 0 1 0 12.728 12.728a9 9 0 0 0 -12.728 -12.728z'></path>
                <path d='M16.243 7.757a6 6 0 0 0 -8.486 0'></path>
              </svg>
            </motion.div>
            
            <div className='flex-1 flex items-center justify-between'>
              <span className='font-semibold text-base'>Syllabus</span>
              {/* Green dot indicator */}
              <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
            </div>
            
            <AnimatePresence>
              {isNavigating && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Loader2 className='h-4 w-4 animate-spin text-primary' />
                </motion.div>
              )}
            </AnimatePresence>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain}>
          <SidebarMenu>
            <SidebarMenuItem className='flex items-center gap-2'>
              <SidebarMenuButton
                className='min-w-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground duration-200 ease-linear hover:from-primary/90 hover:to-primary/70 hover:text-primary-foreground active:from-primary/90 active:to-primary/70 active:text-primary-foreground shadow-sm hover:shadow-md border border-primary/20'
                tooltip='Quick Create'>
                <CirclePlus className='animate-pulse' />
                <span>Créer un dossier</span>
              </SidebarMenuButton>
              <Button
                className='size-8 group-data-[collapsible=icon]:opacity-0 border-primary/30 hover:border-primary/50'
                size='icon'
                variant='outline'>
                <Inbox className='text-primary' />
                <span className='sr-only'>Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </NavMain>
        <NavLinks items={data.navItems} title="Ressources" />
        <SyllabusNavDocuments items={data.public} />
        <NavSecondary className='mt-auto' items={data.navSecondary} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
