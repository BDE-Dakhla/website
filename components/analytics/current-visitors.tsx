'use client'

import useSWR from 'swr'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { fetcher } from '@/lib/utils'

export function CurrentVisitorsBadge() {
  const { data } = useSWR<{ current: number }>(
    '/api/analytics/current',
    fetcher,
    { refreshInterval: 10_000 },
  )

  const current = data?.current ?? 0

  if (!data) {
    return <Skeleton className='h-7 w-48 rounded-full' />
  }

  return (
    <Badge className='gap-2' variant='outline'>
      <span className='inline-block size-2 animate-pulse rounded-full bg-emerald-500' />
      {current} current visitors
    </Badge>
  )
}
