'use client'

import { MailPlus, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUsers } from '@/hooks/users-provider'

export function SubHeader() {
  const { setOpen } = useUsers()

  return (
    <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
      <div>
        <h2 className='font-bold text-2xl tracking-tight'>Utilisateurs</h2>
        <p className='text-muted-foreground'>
          Voici toute la liste des comptes des utilisateurs
        </p>
      </div>

      <div className='flex gap-2'>
        <Button
          className='space-x-1'
          onClick={() => setOpen('invite')}
          variant='outline'>
          <span>Inviter une personne</span> <MailPlus size={18} />
        </Button>
        <Button className='space-x-1' onClick={() => setOpen('add')}>
          <span>Ajouter un utilisateur</span> <UserPlus size={18} />
        </Button>
      </div>
    </div>
  )
}
