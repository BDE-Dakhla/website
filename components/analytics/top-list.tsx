'use client'

import type { Kind, TimeRange } from '@/lib/analytics/types'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { browserIconUrl, deviceIconUrl, osIconUrl } from '@/lib/brand-icons'
import { fetcher } from '@/lib/utils'
import Image from '../layout/image'

export function AnalyticsTopList({
  kind,
  range,
  title,
}: {
  kind: Kind
  range: TimeRange
  title: string
}) {
  const { data } = useSWR<{
    items: { name: string; count: number; percent: number }[]
  }>(`/api/analytics/top?kind=${kind}&range=${range}`, fetcher, {
    refreshInterval: 60_000,
  })

  const items = data?.items ?? []
  const isLoading = !data

  function iconFor(name: string): string {
    switch (kind) {
      case 'browsers':
        return browserIconUrl(name)
      case 'os':
        return osIconUrl(name)
      case 'devices':
        return deviceIconUrl(name)
      default:
        return browserIconUrl(name)
    }
  }

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className='px-4'>
        <ul className='space-y-2'>
          {isLoading
            ? Array.from({ length: 6 }, (_, index): number => index + 1).map(
                (i) => (
                  <li className='flex items-center gap-3' key={`sk-${i}`}>
                    <Skeleton className='h-[18px] w-[18px] rounded' />
                    <Skeleton className='h-4 w-40 flex-1' />
                    <Skeleton className='h-4 w-10' />
                    <Skeleton className='ms-2 h-3 w-8' />
                    <Skeleton className='ms-3 h-2 w-1/2' />
                  </li>
                ),
              )
            : items.map((it) => (
                <li
                  className='flex items-center gap-3'
                  key={`${kind}-${it.name}`}>
                  <Image
                    alt={it.name}
                    className='shrink-0 opacity-90'
                    height={18}
                    loading='lazy'
                    referrerPolicy='no-referrer'
                    src={iconFor(it.name)}
                    width={18}
                  />
                  <div className='flex-1 truncate text-sm'>{it.name}</div>
                  <div className='w-16 text-right text-muted-foreground text-sm tabular-nums'>
                    {it.count.toLocaleString()}
                  </div>
                  <div className='ms-2 w-12 text-right text-muted-foreground text-xs'>
                    {it.percent}%
                  </div>
                  <div className='ms-3 h-2 flex-1 rounded bg-muted'>
                    <div
                      className='h-2 rounded bg-primary'
                      style={{ width: `${it.percent}%` }}
                    />
                  </div>
                </li>
              ))}
          {!isLoading && items.length === 0 && (
            <li className='text-muted-foreground text-sm'>No data</li>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}
