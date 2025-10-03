'use client'

import { signOut } from 'next-auth/react'
import {
  ConfirmDialog,
  type DialogContext,
} from '@/app/[locale]/dashboard/users/confirm-dialog'

export function SignOutDialog({ open, onOpenChange }: DialogContext) {
  return (
    <ConfirmDialog
      cancelBtnText='Annuler'
      className='sm:max-w-sm'
      confirmText='Se déconnecter'
      desc='Êtes-vous sûr(e) de vouloir vous déconnecter ? Vous aurez besoin de vous reconnecter pour acceder à votre compte.'
      handleConfirm={async (): Promise<void> => await signOut()}
      onOpenChange={onOpenChange}
      open={open}
      title='Déconnecter mon compte'
    />
  )
}
