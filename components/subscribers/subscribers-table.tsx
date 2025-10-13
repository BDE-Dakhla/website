'use client'

import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { UserLock, UserRoundX, UserStar } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { cn } from '@/lib/utils'
import { DataTablePagination, DataTableToolbar } from '../data-table'
import { SubscribersBulkActions } from './subscribers-bulk-actions'
import { useSubscribersColumns } from './subscribers-columns'

export interface Subscriber {
  id: string
  email: string
  status: 'active' | 'unsubscribed' | 'bounced'
  created_at: string
  updated_at: string
  unsubscribed_at: string | null
}

interface SubscribersTableProps {
  data: Subscriber[]
  search: Record<string, unknown>
  navigate: NavigateFn
  onDelete: (subscriber: Subscriber) => void
  onBulkDelete: (subscriberIds: string[]) => Promise<void>
}

export function SubscribersTable({
  data,
  search,
  navigate,
  onDelete,
  onBulkDelete,
}: SubscribersTableProps) {
  const columns = useSubscribersColumns({ onDelete })

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true },
  ])

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'email', searchKey: 'email', type: 'string' },
      { columnId: 'status', searchKey: 'status', type: 'array' },
    ],
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  return (
    <div className='space-y-4'>
      <DataTableToolbar
        filters={[
          {
            columnId: 'status',
            title: 'Statut',
            options: [
              { label: 'Actif', value: 'active', icon: UserStar },
              { label: 'Désabonné', value: 'unsubscribed', icon: UserLock },
              { label: 'Rejeté', value: 'bounced', icon: UserRoundX },
            ],
          },
        ]}
        searchKey='email'
        searchPlaceholder='Rechercher par email...'
        table={table}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className='group/row' key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={cn(
                        'bg-background group-hover/row:bg-muted',
                        header.column.columnDef.meta?.className ?? '',
                      )}
                      colSpan={header.colSpan}
                      key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className='group/row'
                  data-state={row.getIsSelected() && 'selected'}
                  key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className ?? '',
                      )}
                      key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className='h-24 text-center'
                  colSpan={columns.length}>
                  Aucun abonné trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <SubscribersBulkActions onBulkDelete={onBulkDelete} table={table} />
    </div>
  )
}
