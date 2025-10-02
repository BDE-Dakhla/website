'use client'

import type { User } from '@/components/schema'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showSubmittedData } from '@/lib/utils'
import { ConfirmDialog } from './confirm-dialog'

interface UserDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: UserDeleteDialogProps) {
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentRow.username) return

    onOpenChange(false)
    showSubmittedData(currentRow, "L'utilisateur a été supprimé.")
  }

  return (
    <ConfirmDialog
      confirmText='Delete'
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Êtes-vous certain de vouloir supprimer
            <span className='ml-1 font-bold'>{currentRow.username}</span> ?
            <br />
            Cette action va supprimer de manière permanente l&apos;utilisateur avec le role de{' '}
            <span className='font-bold'>{currentRow.role.toUpperCase()}</span> du système.
          </p>

          <Label className='my-2'>
            Nom complet:
            <Input
              onChange={(e) => setValue(e.target.value)}
              placeholder="Saisissez le nom complet de l'utilisateur pour confirmer la suppression."
              value={value}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Attention !</AlertTitle>
            <AlertDescription>Soyez prudent, cette action est irréversible.</AlertDescription>
          </Alert>
        </div>
      }
      destructive
      disabled={value.trim() !== currentRow.username}
      handleConfirm={handleDelete}
      onOpenChange={onOpenChange}
      open={open}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-1 inline-block stroke-destructive' size={18} /> Supprimer l&apos;utilisateur
        </span>
      }
    />
  )
}
