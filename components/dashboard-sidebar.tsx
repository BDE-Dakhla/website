'use client'

import {
  BadgeQuestionMark,
  BookOpen,
  Calendar,
  ChartPie,
  ContactRound,
  FileText,
  Handshake,
  Inbox,
  LayoutDashboard,
  Mail,
  MailOpen,
  Megaphone,
  Send,
  TicketsIcon,
  Users,
  UsersRound,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { type NavItem, NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { hasPermission } from '@/lib/permission'
import { NavLinks } from './nav-links'

const data = {
  // Core Dashboard Overview
  navOverview: [
    { title: 'Statistiques', url: '/dashboard/analytics', icon: ChartPie },
  ],

  // User & Member Management
  navUserManagement: [
    {
      title: 'Utilisateurs',
      url: '/dashboard/users',
      icon: ContactRound,
    },
    { title: "Membres de l'équipage", url: '/dashboard/members', icon: Users },
  ],

  // Events & Activities
  navEvents: [
    {
      title: 'Événements',
      url: '/dashboard/events',
      icon: Calendar,
    },
    {
      title: 'Tickets',
      url: '/dashboard/tickets',
      icon: TicketsIcon,
    },
    {
      title: 'Annonces',
      url: '/dashboard/announcements',
      icon: Megaphone,
    },
  ],

  // Content & Resources
  navContent: [
    {
      title: 'Documents',
      url: '/dashboard/files',
      icon: FileText,
    },
    {
      title: 'Contacts',
      url: '/dashboard/contacts',
      icon: UsersRound,
    },
  ],

  // Partnerships
  navPartnerships: [
    {
      title: 'Sponsors & Partenaires',
      url: '/dashboard/partners',
      icon: Handshake,
    },
  ],

  // Newsletter & Communications
  navNewsletter: [
    {
      title: 'Boîte de Réception',
      url: '/dashboard/newsletter/inbox',
      icon: Inbox,
    },
    {
      title: 'Emails Capturés',
      url: '/dashboard/newsletter/emails',
      icon: MailOpen,
    },
    {
      title: 'Abonnés',
      url: '/dashboard/newsletter/subscribers',
      icon: Mail,
    },
    {
      title: 'Campagnes',
      url: '/dashboard/newsletter/campaigns',
      disabled: true,
      tooltip: 'Bientôt',
      icon: Send,
    },
  ],

  // Support & Documentation
  navSecondary: [
    { title: 'Documentation', url: '/dashboard/docs', icon: BookOpen },
    {
      title: "Obtenir de l'aide",
      url: '/dashboard/help',
      icon: BadgeQuestionMark,
    },
  ],
} satisfies Record<string, NavItem[]>

export function DashboardSideBar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const canSeeDashboard = hasPermission(
    session?.user?.perms,
    'HAS_ACCESS_TO_DASHBOARD',
  )

  const navMain: NavItem[] = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      visible: canSeeDashboard,
    },
    ...data.navOverview,
  ]

  return (
    <Sidebar variant='inset' {...props}>
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
      <SidebarContent className='sidebar-scroll'>
        <NavMain items={navMain} />
        <NavLinks
          items={data.navUserManagement}
          title='Gestion des utilisateurs'
        />
        <NavLinks items={data.navEvents} title='Événements & Activités' />
        <NavLinks items={data.navContent} title='Contenu & Ressources' />
        <NavLinks items={data.navPartnerships} title='Partenariats' />
        <NavLinks
          items={data.navNewsletter}
          title='Newsletter & Communications'
        />
        <NavSecondary className='mt-auto' items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
