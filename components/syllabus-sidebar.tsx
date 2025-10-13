'use client'

import { AnimatePresence } from 'framer-motion'
import {
  AppWindow,
  BadgeQuestionMark,
  Book,
  BookOpen,
  BookUser,
  Brain,
  Calendar,
  Camera,
  CirclePlus,
  Clock,
  ExternalLink,
  FileIcon,
  Folder,
  Inbox,
  Loader2,
} from 'lucide-react'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import { SyllabusNavDocuments } from '@/components/syllabus-nav-documents'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useSyllabusNavigation } from '@/contexts/syllabus-navigation'
import { NavLinks } from './nav-links'
import { Button } from './ui/button'
import { ViewTransition } from './ui/view-transition'

const data = {
  navMain: [],
  public: [
    {
      title: 'Calendrier annuel',
      url: '/syllabus/calendar',
      icon: Calendar,
    },
    {
      title: 'Emploi du temps',
      url: '/syllabus/schedule',
      icon: Clock,
      disabled: false,
      tooltip: 'Bientôt',
    },
    {
      title: 'Contact des professeurs',
      url: '/syllabus/contacts',
      icon: BookUser,
    },
  ],
  navItems: [
    {
      title: 'Mes cours',
      url: '/syllabus/my-courses',
      icon: Folder,
    },
    {
      title: 'Bibliothèque',
      url: '/syllabus/library',
      icon: Book,
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
    {
      title: 'Tableau de bord',
      url: '/dashboard',
      icon: AppWindow,
      tooltip: <ExternalLink className='size-3.5' />,
    },
    {
      title: 'Documentation',
      url: '/syllabus/docs',
      icon: BookOpen,
      disabled: true,
      tooltip: 'Beta',
    },
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
  const { isNavigating } = useSyllabusNavigation()

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='relative flex w-full items-center space-x-3 p-2 pl-4'>
            <div
              about='green accent bar'
              className='absolute top-0 bottom-0 left-0 w-1 rounded-r-full bg-primary opacity-60'
            />

            <svg
              aria-label='label'
              className='!h-5.5 !w-5.5 text-primary'
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
              <path d='M5.636 5.636a9 9 0 1 0 12.728 12.728a9 9 0 0 0 -12.728 -12.728z' />
              <path d='M16.243 7.757a6 6 0 0 0 -8.486 0' />
            </svg>

            <span className='select-none font-semibold text-base'>
              Syllabus
            </span>

            <AnimatePresence>
              {isNavigating && (
                <ViewTransition
                  className='ml-auto'
                  duration={0.2}
                  keyedBy='loader'
                  preset='scale'>
                  <Loader2 className='size-4 animate-spin text-primary' />
                </ViewTransition>
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
                className='min-w-8 border border-primary/20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm duration-200 ease-linear hover:from-primary/90 hover:to-primary/70 hover:text-primary-foreground hover:shadow-md active:from-primary/90 active:to-primary/70 active:text-primary-foreground'
                tooltip='Quick Create'>
                <CirclePlus className='animate-pulse' />
                <span>Créer un dossier</span>
              </SidebarMenuButton>
              <Button
                className='size-8 border-primary/30 hover:border-primary/50 group-data-[collapsible=icon]:opacity-0'
                size='icon'
                variant='outline'>
                <Inbox className='text-primary' />
                <span className='sr-only'>Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </NavMain>
        <NavLinks items={data.navItems} title='Ressources' />
        <SyllabusNavDocuments items={data.public} />
        <NavSecondary className='mt-auto' items={data.navSecondary} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
