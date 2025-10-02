'use client'

import { MailPlus, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUsers } from '@/hooks/users-provider'

export function SubHeader() {
  const { setOpen } = useUsers()

  return (
    <div className='mx-6 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
      <div>
        <h2 className='font-bold text-2xl tracking-tight'>Utilisateurs</h2>
        <p className='text-muted-foreground'>Voici toute la liste des utilisateurs qui ont accès au Syllabus</p>
      </div>

      <div className='flex gap-2'>
        <Button className='space-x-1' onClick={() => setOpen('invite')} variant='outline'>
          <span>Invite User</span> <MailPlus size={18} />
        </Button>
        <Button className='space-x-1' onClick={() => setOpen('add')}>
          <span>Add User</span> <UserPlus size={18} />
        </Button>
      </div>
    </div>
  )
}
