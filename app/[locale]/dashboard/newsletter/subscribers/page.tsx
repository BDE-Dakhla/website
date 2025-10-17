'use client'

import { Mail, TrendingUp, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  type Subscriber,
  SubscribersTable,
} from '@/components/subscribers/subscribers-table'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subscriberToDelete, setSubscriberToDelete] =
    useState<Subscriber | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Simple local state for demo
  const [search] = useState<Record<string, unknown>>({})
  const navigate = () => {}

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter/subscribers')
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data.subscribers || [])
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (subscriber: Subscriber) => {
    setSubscriberToDelete(subscriber)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!subscriberToDelete) return

    setDeleting(true)
    try {
      const response = await fetch(
        `/api/newsletter/subscribers?id=${subscriberToDelete.id}`,
        {
          method: 'DELETE',
        },
      )

      if (response.ok) {
        setSubscribers(
          subscribers.filter((s) => s.id !== subscriberToDelete.id),
        )
        setDeleteDialogOpen(false)
        setSubscriberToDelete(null)
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Failed to delete subscriber:', error)
      alert('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  const handleBulkDelete = async (subscriberIds: string[]) => {
    const deletePromises = subscriberIds.map((id) =>
      fetch(`/api/newsletter/subscribers?id=${id}`, {
        method: 'DELETE',
      }),
    )

    await Promise.all(deletePromises)
    setSubscribers(subscribers.filter((s) => !subscriberIds.includes(s.id)))
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.status === 'active').length,
    unsubscribed: subscribers.filter((s) => s.status === 'unsubscribed').length,
    bounced: subscribers.filter((s) => s.status === 'bounced').length,
  }

  if (loading) {
    return (
      <div className='flex h-[calc(100vh-4rem)] items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-current border-r-transparent border-solid' />
          <p className='text-muted-foreground'>Chargement des abonnés...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-2xl'>Newsletter — Abonnés</h1>
          <p className='text-muted-foreground text-sm'>
            Gérez votre liste d'abonnés à la newsletter
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Total</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>{stats.total}</div>
            <p className='text-muted-foreground text-xs'>abonnés au total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Actifs</CardTitle>
            <Mail className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl text-green-600'>
              {stats.active}
            </div>
            <p className='text-muted-foreground text-xs'>
              {((stats.active / stats.total) * 100 || 0).toFixed(0)}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Désabonnés</CardTitle>
            <X className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl text-gray-600'>
              {stats.unsubscribed}
            </div>
            <p className='text-muted-foreground text-xs'>
              {((stats.unsubscribed / stats.total) * 100 || 0).toFixed(0)}% du
              total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Rejetés</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl text-red-600'>
              {stats.bounced}
            </div>
            <p className='text-muted-foreground text-xs'>emails invalides</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des abonnés</CardTitle>
          <CardDescription>
            {stats.total} abonné{stats.total !== 1 ? 's' : ''} enregistré
            {stats.total !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscribersTable
            data={subscribers}
            navigate={navigate}
            onBulkDelete={handleBulkDelete}
            onDelete={handleDeleteClick}
            search={search}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'abonné{' '}
              <strong>{subscriberToDelete?.email}</strong> ?<br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600 hover:bg-red-700'
              disabled={deleting}
              onClick={handleDeleteConfirm}>
              {deleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
