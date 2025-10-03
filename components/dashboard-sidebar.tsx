'use client'

import {
  BadgeQuestionMark,
  BookOpen,
  ChartPie,
  ContactRound,
  Handshake,
  Newspaper,
  TicketsIcon,
  Users,
  UsersRound
} from 'lucide-react'
import { type NavItem, NavMain } from '@/components/nav-main'
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
import { NavLinks } from './nav-links'

const data = {
  navMain: [
    { title: 'Statistiques', url: '/dashboard/analytics', icon: ChartPie },
    { title: "Member de l'équipage", url: '/dashboard/members', icon: Users },
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
  navEvents: [
    {
      title: 'Tickets',
      url: '/dashboard/tickets',
      icon: TicketsIcon
    },
    {
      title: 'Annonces',
      url: '/dashboard/events',
      icon: Newspaper
    }
  ],
  navAcademic: [
    {
      title: 'Documents',
      url: '/dashboard/files',
      icon: Newspaper
    },
    {
      title: 'Contacts',
      url: '/dashboard/contacts',
      icon: UsersRound
    }
  ],
  navSecondary: [
    { title: 'Documentation', url: '/dashboard/docs', icon: BookOpen },
    {
      title: "Obtenir de l'aide",
      url: '/dashboard/help',
      icon: BadgeQuestionMark
    }
  ]
} satisfies Record<string, NavItem[]>

export function DashboardSideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='flex items-center space-x-3 p-1.5'>
            <svg
              aria-label='icon'
              fill='none'
              height='22'
              role='img'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='22'
              xmlns='http://www.w3.org/2000/svg'>
              <path d='M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z' />
              <path d='m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845' />
            </svg>
            <span className='font-semibold text-base'>Tableau de bord</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavLinks items={data.navEvents} title='Événementiel' />
        <NavLinks items={data.navAcademic} title='Académique' />
        <NavSecondary className='mt-auto' items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
