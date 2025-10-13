'use client'

import type { Sponsor } from '@/types/schema'
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
  const handleSubmit = async (data: SponsorFormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {sponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
          </DialogTitle>
          <DialogDescription>
            {sponsor
              ? 'Update the sponsor information below.'
              : 'Fill in the details to create a new sponsor.'}
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
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Sponsor</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{sponsor?.name}"? This action
            cannot be undone and will permanently remove the sponsor from your
            database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button
            disabled={loading}
            loading={loading}
            onClick={handleConfirm}
            variant='destructive'>
            Delete Sponsor
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
