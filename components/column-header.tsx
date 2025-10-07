import type { Column } from '@tanstack/react-table'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type DataTableColumnHeaderProps<TData, TValue> = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> & {
  column: Column<TData, TValue>
  title: React.ReactNode
  icon: LucideIcon
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  icon: Icon,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className='-ms-3 h-8 data-[state=open]:bg-accent'
            size='sm'
            variant='ghost'>
            <span className='inline-flex items-center gap-1'>
              <Icon className='text-muted-foreground' size={14} />
              {title}
            </span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className='ms-2 h-4 w-4' />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className='ms-2 h-4 w-4' />
            ) : (
              <CaretSortIcon className='ms-2 h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className='size-3.5 text-muted-foreground/70' />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className='size-3.5 text-muted-foreground/70' />
            Desc
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeNoneIcon className='size-3.5 text-muted-foreground/70' />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
