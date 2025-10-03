'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
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
import { mod, useShortcuts } from '@/lib/shortcuts'
import { Avatar } from './avatar'
import { SignOutDialog } from './sign-out-dialog'

interface Profile {
  name?: string | null
  username?: string | null
  email?: string | null
  image?: string | null
}
interface Props {
  profile?: Profile
}

export function ProfileDropdown({ profile }: Props) {
  const [open, setOpen] = useDialogState()
  const router = useRouter()
  const locale = useLocale()

  const displayName =
    profile?.name ??
    profile?.username ??
    (profile?.email ? profile.email.split('@')[0] : undefined) ??
    'Guest'

  const email = profile?.email ?? 'Not signed in'
  const avatar =
    profile?.image ??
    displayName
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  useShortcuts(
    {
      [`Shift+${mod}+P`]: (e) => {
        e.preventDefault()
        router.push(`/${locale}/syllabus/profile`)
      },
      [`${mod}+P`]: (e) => {
        e.preventDefault()
        router.push(`/${locale}/syllabus/settings`)
      },
      [`Shift+${mod}+Q`]: (e) => {
        e.preventDefault()
        setOpen(true)
      },
    },
    [router, setOpen, locale],
  )

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className='relative h-8 w-8 rounded-full' variant='ghost'>
            <Avatar
              className='rounded-full'
              image={avatar}
              name={displayName}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='font-medium text-sm leading-none'>{displayName}</p>
              <p className='text-muted-foreground text-xs leading-none'>
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href='/syllabus/profile'>
                Mon profil
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/syllabus/settings'>
                Paramètres
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
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
