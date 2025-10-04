'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { usePathname } from '@/i18n/routing'

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  disabled?: boolean
  tooltip?: ReactNode
  items?: Array<NavItem>
  visible?: boolean // when false, the item will not render
}

export function NavMain({
  items,
  children,
}: React.PropsWithChildren<{ items: NavItem[] }>) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-4'>
        {children}
        <SidebarMenu>
          {items
            .filter((item) => item.visible ?? true)
            .map((item) => {
              const active = pathname.includes(item.url)

              const Content = () => (
                <>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </>
              )

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!active}
                    isActive={active}
                    tooltip={item.title}>
                    {active ? (
                      <Content />
                    ) : (
                      <Link href={item.url}>
                        <Content />
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
