'use client'

import type { Database } from '@/types/schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useDialogState from '@/hooks/use-dialog-state'
import { Link } from '@/i18n/routing'
import { SignOutDialog } from './sign-out-dialog'

interface Props {
  profile: Database['User']
}

export function ProfileDropdown({ profile }: Props) {
  const [open, setOpen] = useDialogState()

  const name = profile?.name ?? 'Guest'
  const email = profile?.email ?? 'Not signed in'
  const avatar = profile?.image ?? '/avatars/placeholder.png'
  const avatarFallback = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className='relative h-8 w-8 rounded-full' variant='ghost'>
            <Avatar className='h-8 w-8'>
              <AvatarImage alt={name} src={avatar} />
              <AvatarFallback className='rounded-lg'>
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='font-medium text-sm leading-none'>{name}</p>
              <p className='text-muted-foreground text-xs leading-none'>
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href='/syllabus/profile'>
                Profil
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/syllabus/settings'>
                Paramètres
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)} variant='destructive'>
            Se déconnecter
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog onOpenChange={setOpen} open={!!open} />
    </>
  )
}
