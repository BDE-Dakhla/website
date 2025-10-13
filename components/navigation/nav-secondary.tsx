'use client'

import type { NavItem } from './nav-main'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'

export function NavSecondary({
  items,
  ...props
}: {
  items: Array<NavItem>
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items
            .filter((item) => item.visible ?? true)
            .map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild={!item.disabled}
                  className={cn({
                    'cursor-not-allowed opacity-50': item.disabled,
                  })}
                  disabled={item.disabled}
                  tooltip={item.title}>
                  {item.disabled ? (
                    <div className='flex w-full cursor-not-allowed items-center justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </div>
                      {item.tooltip && (
                        <Badge className='ml-auto' variant='secondary'>
                          {item.tooltip}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <a
                      className='flex w-full items-center justify-between'
                      href={item.url}>
                      <div className='flex items-center gap-2'>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </div>
                      {item.tooltip && (
                        <Badge className='ml-auto' variant='secondary'>
                          {item.tooltip}
                        </Badge>
                      )}
                    </a>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
