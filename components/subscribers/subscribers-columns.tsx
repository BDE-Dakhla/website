'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { Subscriber } from './subscribers-table'
import { Calendar, ExternalLink, Mail, Radar, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '../data-table/column-header'

interface UseSubscribersColumnsProps {
  onDelete: (subscriber: Subscriber) => void
}

export function useSubscribersColumns({
  onDelete,
}: UseSubscribersColumnsProps): ColumnDef<Subscriber>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox.Native
          aria-label='Select all'
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          className='translate-y-[2px]'
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      meta: {
        className: cn('sticky md:table-cell w-10 start-0 z-10'),
      },
      cell: ({ row }) => (
        <Checkbox.Native
          aria-label='Select row'
          checked={row.getIsSelected()}
          className='translate-y-[2px]'
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} icon={Mail} title='Email' />
      ),
      cell: ({ row }) => {
        const email = row.getValue('email') as string
        return (
          <div className='flex items-center gap-2'>
            <span className='font-medium'>{email}</span>
            <Link
              className='text-muted-foreground transition-colors hover:text-foreground'
              href={`/dashboard/users?username=${encodeURIComponent(email)}`}
              title='Voir dans la liste des utilisateurs'>
              <ExternalLink className='h-3.5 w-3.5' />
            </Link>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const cell = row.getValue(id) as string
        const needle = typeof value === 'string' ? value : ''
        if (!needle) return true
        return cell.toLowerCase().includes(needle.toLowerCase())
      },
      meta: { className: 'w-64' },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} icon={Radar} title='Statut' />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string

        const statusConfig = {
          active: {
            label: 'Actif',
            variant: 'default' as const,
            className: 'bg-green-500 hover:bg-green-600',
          },
          unsubscribed: {
            label: 'Désabonné',
            variant: 'secondary' as const,
            className: '',
          },
          bounced: {
            label: 'Rejeté',
            variant: 'destructive' as const,
            className: '',
          },
        }

        const config = statusConfig[status as keyof typeof statusConfig]

        if (!config) return null

        return (
          <Badge className={config.className} variant={config.variant}>
            {config.label}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      meta: { className: 'w-32' },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          icon={Calendar}
          title='Inscrit le'
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'))
        return (
          <div className='text-muted-foreground text-sm'>
            {date.toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        )
      },
      meta: { className: 'w-36' },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const subscriber = row.original

        if (subscriber.status !== 'active') {
          return null
        }

        return (
          <div className='flex justify-end'>
            <Button
              className='h-8 w-8 p-0'
              onClick={() => onDelete(subscriber)}
              size='icon'
              variant='ghost'>
              <Trash2 className='h-4 w-4 text-red-600' />
              <span className='sr-only'>Supprimer</span>
            </Button>
          </div>
        )
      },
      meta: { className: 'w-16' },
    },
  ]
}
