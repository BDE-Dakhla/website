'use client'

import { signOut } from 'next-auth/react'
import { ConfirmDialog } from '@/app/[locale]/dashboard/users/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  return (
    <ConfirmDialog
      className='sm:max-w-sm'
      confirmText='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      handleConfirm={async () => await signOut()}
      onOpenChange={onOpenChange}
      open={open}
      title='Sign out'
    />
  )
}
