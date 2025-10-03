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
  Inbox
} from 'lucide-react'
import { NavDocuments } from '@/components/nav-documents'
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
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Button } from './ui/button'

const data = {
  navMain: [],
  navClouds: [
    {
      title: 'Capture',
      icon: Camera,
      isActive: true,
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' }
      ]
    },
    {
      title: 'Proposal',
      icon: FileIcon,
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' }
      ]
    },
    {
      title: 'Prompts',
      icon: Brain,
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' }
      ]
    }
  ],
  navSecondary: [
    { title: 'Documentation', url: '/syllabus/docs', icon: BookOpen },
    {
      title: "Obtenir de l'aide",
      url: '/syllabus/help',
      icon: BadgeQuestionMark
    }
  ],
  public: [
    {
      name: 'Calendrier Universitaire',
      url: '/syllabus/calendar',
      icon: Calendar
    },
    { name: 'Emploi du temps', url: '/syllabus/schedule', icon: Clock },
    {
      name: 'Contact des professeurs',
      url: '/syllabus/teachers',
      icon: BookUser
    }
  ]
}

export function SyllabusSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='flex items-center space-x-3 p-1.5'>
            <svg
              aria-label='label'
              className='!h-5.5 !w-5.5'
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
            <span className='font-semibold text-base'>Syllabus</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain}>
          <SidebarMenu>
            <SidebarMenuItem className='flex items-center gap-2'>
              <SidebarMenuButton
                className='min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground'
                tooltip='Quick Create'>
                <CirclePlus />
                <span>Créer un dossier</span>
              </SidebarMenuButton>
              <Button className='size-8 group-data-[collapsible=icon]:opacity-0' size='icon' variant='outline'>
                <Inbox />
                <span className='sr-only'>Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </NavMain>

        <NavDocuments items={data.public} />
        <NavSecondary className='mt-auto' items={data.navSecondary} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
