'use client'

import type { Table } from '@tanstack/react-table'
import type { Subscriber } from './subscribers-table'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SubscribersBulkActionsProps {
  table: Table<Subscriber>
  onBulkDelete: (subscriberIds: string[]) => Promise<void>
}

export function SubscribersBulkActions({
  table,
  onBulkDelete,
}: SubscribersBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  
  // Filter only active subscribers for deletion
  const activeSubscribers = selectedRows
    .map(row => row.original as Subscriber)
    .filter(sub => sub.status === 'active')

  const handleBulkDelete = async () => {
    const subscriberIds = activeSubscribers.map(sub => sub.id)

    if (subscriberIds.length === 0) {
      toast.error('Aucun abonné actif sélectionné')
      return
    }

    setDeleting(true)
    try {
      await onBulkDelete(subscriberIds)
      toast.success(
        `${subscriberIds.length} abonné${subscriberIds.length > 1 ? 's' : ''} supprimé${subscriberIds.length > 1 ? 's' : ''}`,
      )
      table.resetRowSelection()
      setShowDeleteConfirm(false)
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <BulkActionsToolbar entityName='abonnés' table={table}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label='Supprimer les abonnés sélectionnés'
              className='size-8'
              disabled={activeSubscribers.length === 0}
              onClick={() => setShowDeleteConfirm(true)}
              size='icon'
              title='Supprimer les abonnés sélectionnés'
              variant='destructive'>
              <Trash2 />
              <span className='sr-only'>
                Supprimer les abonnés sélectionnés
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {activeSubscribers.length === 0
                ? 'Seuls les abonnés actifs peuvent être supprimés'
                : `Supprimer ${activeSubscribers.length} abonné${activeSubscribers.length > 1 ? 's' : ''} actif${activeSubscribers.length > 1 ? 's' : ''}`}
            </p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <AlertDialog onOpenChange={setShowDeleteConfirm} open={showDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmer la suppression multiple
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer{' '}
              <strong>
                {activeSubscribers.length} abonné
                {activeSubscribers.length > 1 ? 's' : ''} actif
                {activeSubscribers.length > 1 ? 's' : ''}
              </strong>{' '}
              ?<br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600 hover:bg-red-700'
              disabled={deleting}
              onClick={handleBulkDelete}>
              {deleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
