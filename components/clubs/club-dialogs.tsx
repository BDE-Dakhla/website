'use client'

import type { Club } from '@/types/schema'
import { useTranslations } from 'next-intl'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/stateful-button'
import { ClubForm, type ClubFormData } from './club-form'

interface ClubFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  club?: Club
  onSubmit: (data: ClubFormData) => Promise<void>
}

export function ClubFormDialog({
  open,
  onOpenChange,
  club,
  onSubmit,
}: ClubFormDialogProps) {
  const t = useTranslations('dashboard.clubs')

  const handleSubmit = async (data: ClubFormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>
            {club ? t('form.edit.title') : t('form.add.title')}
          </DialogTitle>
          <DialogDescription>
            {club ? t('form.edit.description') : t('form.add.description')}
          </DialogDescription>
        </DialogHeader>
        <ClubForm
          club={club}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

interface DeleteClubDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  club?: Club
  onConfirm: () => Promise<void>
}

export function DeleteClubDialog({
  open,
  onOpenChange,
  club,
  onConfirm,
}: DeleteClubDialogProps) {
  const t = useTranslations('dashboard.clubs')

  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('delete.description', { name: club?.name || 'this club' })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('delete.cancel')}</AlertDialogCancel>
          <Button onClick={handleConfirm} variant='destructive'>
            {t('delete.confirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
