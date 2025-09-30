'use client'

import { BadgeQuestionMark, BookOpen, ChartPie, ContactRound, Handshake, Users } from 'lucide-react'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from '@/components/ui/sidebar'

const data = {
  navMain: [
    { title: 'Statistiques', url: '/dashboard/analytics', icon: ChartPie },
    { title: "Member de l'équipge", url: '/dashboard/members', icon: Users },
    {
      title: 'Sponsors & Partenaires',
      url: '/dashboard/partners',
      icon: Handshake
    },
    {
      title: 'Gestion des utilisateurs',
      url: '/dashboard/users',
      icon: ContactRound
    }
  ],
  /* navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      isActive: true,
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' },
      ],
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' },
      ],
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' },
      ],
    },
  ], */
  navSecondary: [
    { title: 'Documentation', url: '/dashboard/docs', icon: BookOpen },
    {
      title: "Obtenir de l'aide",
      url: '/dashboard/help',
      icon: BadgeQuestionMark
    }
  ]
}

export function DashboardSideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='flex items-center space-x-3 p-1.5'>
            <svg
              aria-label='icon'
              fill='none'
              height='24'
              role='img'
              stroke='currentColor'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              viewBox='0 0 24 24'
              width='24'
              xmlns='http://www.w3.org/2000/svg'>
              <path d='M3 20h4.5a.5.5 0 0 0 .5-.5v-.282a.52.52 0 0 0-.247-.437 8 8 0 1 1 8.494-.001.52.52 0 0 0-.247.438v.282a.5.5 0 0 0 .5.5H21' />
            </svg>
            <span className='font-semibold text-base'>Dashboard</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary className='mt-auto' items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
