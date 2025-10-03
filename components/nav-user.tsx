'use client'

import {
  Bell,
  EllipsisVertical,
  LogOut,
  Moon,
  Settings,
  Sun,
  UserCircle,
} from 'lucide-react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Avatar } from './avatar'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()

  const user = session?.user
  const name = user?.name ?? 'Guest'
  const email = user?.email ?? 'Not signed in'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              size='lg'>
              <Avatar image={user?.image} name={name} />
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{name}</span>
                <span className='truncate text-muted-foreground text-xs'>
                  {email}
                </span>
              </div>
              <EllipsisVertical className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}>
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar image={user?.image} name={name} />
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{name}</span>
                  <span className='truncate text-muted-foreground text-xs'>
                    {email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {status === 'authenticated' && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserCircle />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      setTheme(theme === 'dark' ? 'light' : 'dark')
                    }>
                    {theme === 'dark' ? <Sun /> : <Moon />}
                    Thème {theme === 'dark' ? 'clair' : 'sombre'}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className='cursor-pointer'>
                    <Link href='/syllabus/settings'>
                      <Settings />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className='cursor-pointer'
                  onSelect={async (e) => {
                    e.preventDefault()
                    await signOut()
                  }}
                  variant='destructive'>
                  <LogOut />
                  Déconnexion
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
