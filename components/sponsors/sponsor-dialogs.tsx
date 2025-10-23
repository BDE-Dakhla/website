'use client'

import type { Sponsor } from '@/types/schema'
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
import { SponsorForm, type SponsorFormData } from './sponsor-form'

interface SponsorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sponsor?: Sponsor
  onSubmit: (data: SponsorFormData) => Promise<void>
}

export function SponsorFormDialog({
  open,
  onOpenChange,
  sponsor,
  onSubmit,
}: SponsorFormDialogProps) {
  const t = useTranslations('dashboard.sponsors')

  const handleSubmit = async (data: SponsorFormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {sponsor ? t('form.edit.title') : t('form.add.title')}
          </DialogTitle>
          <DialogDescription>
            {sponsor ? "Éditer les informations du sponsor" : "Ajouter un nouveau sponsor"}
          </DialogDescription>
        </DialogHeader>
        <SponsorForm
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
          sponsor={sponsor}
        />
      </DialogContent>
    </Dialog>
  )
}

interface DeleteSponsorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sponsor?: Sponsor
  onConfirm: () => Promise<void>
  loading?: boolean
}

export function DeleteSponsorDialog({
  open,
  onOpenChange,
  sponsor,
  onConfirm,
  loading = false,
}: DeleteSponsorDialogProps) {
  const t = useTranslations('dashboard.sponsors')
  const tCommon = useTranslations()

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
            Supprimer le parrain
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {tCommon('common.actions.cancel')}
          </AlertDialogCancel>
          <Button
            disabled={loading}
            loading={loading}
            onClick={handleConfirm}
            variant='destructive'>
            {t('delete.button')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
