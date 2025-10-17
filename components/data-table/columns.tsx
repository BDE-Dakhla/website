'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { User } from '../schema'
import {
  Activity,
  BriefcaseBusiness,
  Calendar,
  IdCard,
  KeyRound,
  Mail,
  Phone,
  User as UserIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { formatMoroccanPhone } from '@/lib/validation/phone'
import { callTypes, roles } from '../common/data'
import { LongText } from '../layout/long-text'
import { DataTableColumnHeader } from './column-header'
import { DataTableRowActions } from './data-table-row-actions'

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
        className: cn(
          'sticky md:table-cell w-10 start-0 z-10 rounded-tl-[inherit]',
        ),
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
      accessorKey: 'username',
      meta: { className: 'w-36' },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          icon={UserIcon}
          title={t('users.table.columns.fullName')}
        />
      ),
      cell: ({ row }) => {
        const v =
          (row.getValue('username') as string | null) ??
          row.original.name ??
          null
        return (
          <LongText className='max-w-36'>
            {v || (
              <span className='text-muted-foreground'>
                {t('users.table.noData.fullName')}
              </span>
            )}
          </LongText>
        )
      },
      filterFn: (row, id, value) => {
        const cell = row.getValue(id) as string | null | undefined
        const needle = typeof value === 'string' ? value : ''
        if (!needle) return true
        if (!cell) return false
        return cell.toLowerCase().includes(needle.toLowerCase())
      },
    },
    {
      accessorKey: 'role',
      meta: { className: 'w-38' },
      enableSorting: false,
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          icon={BriefcaseBusiness}
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
    },
    {
      accessorKey: 'email',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          icon={Mail}
          title={t('users.table.columns.email')}
        />
      ),
      cell: ({ row }) => (
        <div className='w-fit text-nowrap'>{row.getValue('email')}</div>
      ),
      meta: { className: 'w-60' },
    },
    {
      accessorKey: 'cdm',
      meta: { className: 'w-38' },
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          icon={IdCard}
          title={t('users.table.columns.cdm')}
        />
      ),
      cell: ({ row }) => {
        const cdm = row.getValue('cdm') as string | null
        if (!cdm) {
          return (
            <div className='text-sm'>
              <span className='text-muted-foreground'>
                {t('users.table.noData.cdm')}
              </span>
            </div>
          )
        }
        return (
          <div className='font-mono text-xs uppercase tracking-wide'>{cdm}</div>
        )
      },
    },
    {
      accessorKey: 'phoneNumber',
      meta: { className: 'w-42' },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          icon={Phone}
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
      meta: { className: 'w-30' },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          icon={Activity}
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
      accessorKey: 'permissions',
      meta: { className: 'w-60' },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          icon={KeyRound}
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

        const MAX_VISIBLE = 1
        const visiblePermissions = activePermissions.slice(0, MAX_VISIBLE)
        const remainingPermissions = activePermissions.slice(MAX_VISIBLE)
        const hasMore = remainingPermissions.length > 0

        return (
          <div className='flex max-w-48 flex-wrap gap-1'>
            {visiblePermissions.map(([key, _]) => {
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
            {hasMore && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      className='cursor-help px-2 py-0.5 text-xs'
                      variant='outline'>
                      +{remainingPermissions.length}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className='max-w-xs' side='top'>
                    <div className='space-y-1'>
                      <p className='font-semibold text-xs'>
                        Remaining permissions:
                      </p>
                      <div className='flex flex-wrap gap-1'>
                        {remainingPermissions.map(([key, _]) => {
                          const translatedPermission = t(`permissions.${key}`, {
                            fallback: key
                              .replace(/_/g, ' ')
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase()),
                          })
                          return (
                            <Badge
                              className='px-1.5 py-0.5 text-xs'
                              key={key}
                              variant='secondary'>
                              {translatedPermission}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          icon={Calendar}
          title={t('users.table.columns.signupDate')}
        />
      ),
      cell: ({ row }) => {
        const value = row.original.created_at as Date | string | undefined
        if (!value) {
          return (
            <div className='text-sm'>
              <span className='text-muted-foreground'>
                {t('users.table.noData.signupDate')}
              </span>
            </div>
          )
        }
        const d = typeof value === 'string' ? new Date(value) : value
        const formatted = new Intl.DateTimeFormat(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(d)
        return <div className='font-mono text-sm'>{formatted}</div>
      },
      enableSorting: true,
      meta: { className: 'w-60' },
    },
    { id: 'actions', cell: DataTableRowActions },
  ]
}
