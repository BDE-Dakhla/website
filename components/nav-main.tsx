'use client'

import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

export type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
}

export function NavMain({ items, children }: React.PropsWithChildren<{ items: NavItem[] }>) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-4'>
        {children}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
