'use client'

import { Search, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface Subscriber {
  id: string
  email: string
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced'
  created_at: string
  updated_at: string
  unsubscribed_at: string | null
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: {
        label: 'En attente',
        variant: 'outline' as const,
        color: 'text-yellow-600',
      },
      active: {
        label: 'Actif',
        variant: 'default' as const,
        color: 'text-green-600',
      },
      unsubscribed: {
        label: 'Désabonné',
        variant: 'secondary' as const,
        color: 'text-gray-600',
      },
      bounced: {
        label: 'Rejeté',
        variant: 'destructive' as const,
        color: 'text-red-600',
      },
    }

    const config =
      statusMap[status as keyof typeof statusMap] || statusMap.pending

    return (
      <Badge className={config.color} variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR')
  }

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch = subscriber.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || subscriber.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.status === 'active').length,
    pending: subscribers.filter((s) => s.status === 'pending').length,
    unsubscribed: subscribers.filter((s) => s.status === 'unsubscribed').length,
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  if (loading) {
    return (
      <div className='container mx-auto p-6'>
        <div className='animate-pulse'>
          <div className='mb-6 h-8 w-1/3 rounded bg-gray-200'></div>
          <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
            {[1, 2, 3, 4].map((i) => (
              <div className='h-20 rounded bg-gray-200' key={i}></div>
            ))}
          </div>
          <div className='space-y-4'>
            {[1, 2, 3].map((i) => (
              <div className='h-16 rounded bg-gray-200' key={i}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='font-bold text-3xl'>👥 Abonnés Newsletter</h1>
          <p className='mt-2 text-gray-600'>
            Gérez tous les abonnés à votre newsletter
          </p>
        </div>
        <Button onClick={fetchSubscribers} variant='outline'>
          🔄 Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='p-4 text-center'>
            <div className='font-bold text-2xl text-blue-600'>
              {stats.total}
            </div>
            <div className='text-gray-600 text-sm'>Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4 text-center'>
            <div className='font-bold text-2xl text-green-600'>
              {stats.active}
            </div>
            <div className='text-gray-600 text-sm'>Actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4 text-center'>
            <div className='font-bold text-2xl text-yellow-600'>
              {stats.pending}
            </div>
            <div className='text-gray-600 text-sm'>En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4 text-center'>
            <div className='font-bold text-2xl text-gray-600'>
              {stats.unsubscribed}
            </div>
            <div className='text-gray-600 text-sm'>Désabonnés</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
        <div className='relative flex-1'>
          <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400' />
          <Input
            className='pl-10'
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Rechercher par email...'
            value={searchQuery}
          />
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={() => setStatusFilter('all')}
            size='sm'
            variant={statusFilter === 'all' ? 'default' : 'outline'}>
            Tous
          </Button>
          <Button
            onClick={() => setStatusFilter('active')}
            size='sm'
            variant={statusFilter === 'active' ? 'default' : 'outline'}>
            Actifs
          </Button>
          <Button
            onClick={() => setStatusFilter('pending')}
            size='sm'
            variant={statusFilter === 'pending' ? 'default' : 'outline'}>
            En attente
          </Button>
          <Button
            onClick={() => setStatusFilter('unsubscribed')}
            size='sm'
            variant={statusFilter === 'unsubscribed' ? 'default' : 'outline'}>
            Désabonnés
          </Button>
        </div>
      </div>

      {/* Subscribers List */}
      {filteredSubscribers.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Users className='mb-4 h-16 w-16 text-gray-400' />
            <h3 className='mb-2 font-semibold text-lg'>
              {searchQuery || statusFilter !== 'all'
                ? 'Aucun résultat'
                : 'Aucun abonné'}
            </h3>
            <p className='text-center text-gray-600'>
              {searchQuery || statusFilter !== 'all'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Les nouveaux abonnés apparaîtront ici automatiquement'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {filteredSubscribers.map((subscriber) => (
            <Card
              className='transition-shadow hover:shadow-md'
              key={subscriber.id}>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <Users className='h-5 w-5 text-gray-400' />
                    <div>
                      <div className='font-medium'>{subscriber.email}</div>
                      <div className='text-gray-600 text-sm'>
                        Inscrit le {formatDate(subscriber.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    {getStatusBadge(subscriber.status)}
                    <div className='text-gray-500 text-xs'>
                      MAJ: {formatDate(subscriber.updated_at)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className='mt-6 text-center text-gray-500 text-sm'>
        {filteredSubscribers.length} abonné
        {filteredSubscribers.length !== 1 ? 's' : ''} affiché
        {filteredSubscribers.length !== 1 ? 's' : ''}
        {(searchQuery || statusFilter !== 'all') &&
          ` sur ${stats.total} au total`}
      </div>
    </div>
  )
}
