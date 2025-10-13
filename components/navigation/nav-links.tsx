import type { NavItem } from './nav-main'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible'
import { ChevronDown } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../ui/sidebar'

interface NavLinksProps {
  items: Array<NavItem>
  title: string
}

export const NavLinks = ({ items, title }: NavLinksProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items
          .filter((item) => item.visible ?? true)
          .map((item) => {
            const subItems = (item.items ?? []).filter(
              (subItem) => subItem.visible ?? true,
            )

            return (
              <Collapsible
                asChild
                className='group/collapsible'
                defaultOpen={false}
                key={item.title}>
                <SidebarMenuItem>
                  {subItems.length > 0 ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn({
                            'cursor-not-allowed opacity-50': item.disabled,
                          })}
                          disabled={item.disabled}
                          tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          {item.tooltip && (
                            <Badge className='mr-2 ml-auto' variant='secondary'>
                              {item.tooltip}
                            </Badge>
                          )}
                          <ChevronDown className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180' />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                aria-disabled={subItem.disabled}
                                asChild={!subItem.disabled}
                                className={cn({
                                  'cursor-not-allowed opacity-50': subItem.disabled,
                                })}>
                                {subItem.disabled ? (
                                  <div className='flex w-full cursor-not-allowed items-center justify-between'>
                                    <span>{subItem.title}</span>
                                    {subItem.tooltip && (
                                      <Badge
                                        className='ml-auto'
                                        variant='secondary'>
                                        {subItem.tooltip}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                    {subItem.tooltip && (
                                      <Badge
                                        className='ml-auto'
                                        variant='secondary'>
                                        {subItem.tooltip}
                                      </Badge>
                                    )}
                                  </a>
                                )}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : (
                    <SidebarMenuButton
                      aria-disabled={item.disabled}
                      asChild={!item.disabled}
                      className={cn({
                        'opacity-50': item.disabled,
                      })}
                      tooltip={item.title}>
                      <Link
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
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
