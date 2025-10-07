'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { User } from './schema'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { formatMoroccanPhone } from '@/lib/validation/phone'
import { DataTableColumnHeader } from './column-header'
import { callTypes, roles } from './data'
import { DataTableRowActions } from './data-table-row-actions'
import { LongText } from './long-text'

export function useUsersColumns(): ColumnDef<User>[] {
  const t = useTranslations('dashboard')

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
        className: cn('sticky md:table-cell start-0 z-10 rounded-tl-[inherit]'),
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
      id: 'username',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.table.columns.fullName')}
        />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-36'>
          {row.original.username || row.original.name || (
            <span className='text-muted-foreground'>
              {t('users.table.noData.fullName')}
            </span>
          )}
        </LongText>
      ),
      meta: { className: 'w-36' },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.table.columns.email')}
        />
      ),
      cell: ({ row }) => (
        <div className='w-fit text-nowrap'>{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'permissions',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.table.columns.permissions')}
        />
      ),
      cell: ({ row }) => {
        const permissions = row.getValue('permissions') as Record<
          string,
          boolean | number
        > | null

        if (!permissions || typeof permissions !== 'object') {
          return (
            <div className='text-muted-foreground text-sm'>
              {t('users.table.noData.permissions')}
            </div>
          )
        }

        const permissionEntries = Object.entries(permissions)
        const activePermissions = permissionEntries.filter(
          ([_, value]) => value === 1 || value === true,
        )

        if (activePermissions.length === 0) {
          return (
            <div className='text-muted-foreground text-sm'>
              {t('users.table.noData.permissions')}
            </div>
          )
        }

        return (
          <div className='flex max-w-48 flex-wrap gap-1'>
            {activePermissions.map(([key, _]) => {
              // Get the translated permission name, fallback to formatted key
              const translatedPermission = t(`permissions.${key}`, {
                fallback: key
                  .replace(/_/g, ' ')
                  .toLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
              })

              return (
                <Badge
                  className='px-2 py-0.5 text-xs'
                  key={key}
                  title={`Permission: ${key}`}
                  variant='secondary'>
                  {translatedPermission}
                </Badge>
              )
            })}
          </div>
        )
      },
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.table.columns.phoneNumber')}
        />
      ),
      cell: ({ row }) => {
        const phoneNumber = row.getValue('phoneNumber') as string | null

        if (!phoneNumber) {
          return (
            <div className='text-sm'>
              <span className='text-muted-foreground'>
                {t('users.table.noData.phoneNumber')}
              </span>
            </div>
          )
        }

        // Format Moroccan phone number
        const formatted = formatMoroccanPhone(phoneNumber) || phoneNumber

        return <div className='font-mono text-sm'>{formatted}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.table.columns.status')}
        />
      ),
      cell: ({ row }) => {
        const status = row.original.status || 'active' // Default to active if no status
        const badgeColor = callTypes.get(status)
        return (
          <div className='flex space-x-2'>
            <Badge className={cn('capitalize', badgeColor)} variant='outline'>
              {status}
            </Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.table.columns.role')}
        />
      ),
      cell: ({ row }) => {
        const { role } = row.original
        const userType = roles.find(({ value }) => value === role)

        if (!userType) {
          return null
        }

        return (
          <div className='flex items-center gap-x-2'>
            {userType.icon && (
              <userType.icon className='text-muted-foreground' size={16} />
            )}
            <span className='text-sm capitalize'>{row.getValue('role')}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: false,
    },
    { id: 'actions', cell: DataTableRowActions },
  ]
}
