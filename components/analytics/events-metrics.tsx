'use client'

import type { TimeRange } from '@/lib/analytics/utils'
import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fetcher } from '@/lib/utils'

type SummaryItem = { name: string; count: number; percent: number }

type SeriesRow = { bucket: string | Date; event_name: string; c: number }

function formatHourLabel(d: Date) {
  const h = d.getHours()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hr = ((h + 11) % 12) + 1
  return `${hr}${ampm}`
}

const palette = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'oklch(70% 0.15 30)',
  'oklch(70% 0.15 200)',
  'oklch(70% 0.15 260)',
  'oklch(70% 0.15 120)',
  'oklch(70% 0.15 340)',
]

export function AnalyticsEvents({ range }: { range: TimeRange }) {
  // Clamp to <= 12h
  const effectiveRange: TimeRange =
    range === '24h' ||
    range === '7d' ||
    range === '30d' ||
    range === '90d' ||
    range === '6mo' ||
    range === '1y'
      ? '12h'
      : range

  const { data } = useSWR<{ items: SummaryItem[]; series: SeriesRow[] }>(
    `/api/insights/events?range=${effectiveRange}`,
    fetcher,
    { refreshInterval: 60_000 },
  )

  const items = data?.items ?? []

  const { seriesData, eventNames } = useMemo(() => {
    const byBucket: Record<string, any> = {}
    const names = new Set<string>()
    for (const r of data?.series ?? []) {
      const ts = new Date(r.bucket)
      const key = ts.toISOString()
      names.add(r.event_name)
      if (!byBucket[key]) byBucket[key] = { ts, label: formatHourLabel(ts) }
      byBucket[key][r.event_name] = r.c
    }
    const arr = Object.values(byBucket).sort(
      (a, b) => a.ts.getTime() - b.ts.getTime(),
    )
    return { seriesData: arr, eventNames: Array.from(names) }
  }, [data])

  const colorFor = (i: number) => palette[i % palette.length]

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent className='px-4'>
        {!data ? (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div className='space-y-2'>
              {Array.from({ length: 10 }, (_, i) => (
                <div className='flex items-center gap-3' key={i}>
                  <Skeleton className='h-4 w-40 flex-1' />
                  <Skeleton className='h-4 w-10' />
                  <Skeleton className='ms-3 h-2 w-1/2' />
                </div>
              ))}
            </div>
            <div className='h-[260px] md:col-span-3'>
              <Skeleton className='h-full w-full' />
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div className='space-y-2'>
              {items.map((it) => (
                <div className='flex items-center gap-3' key={it.name}>
                  <div className='flex-1 truncate text-sm'>{it.name}</div>
                  <div className='w-16 text-right text-muted-foreground text-sm tabular-nums'>
                    {it.count.toLocaleString()}
                  </div>
                  <div className='ms-2 w-10 text-right text-muted-foreground text-xs'>
                    {it.percent}%
                  </div>
                  <div className='ms-3 h-2 flex-1 rounded bg-muted'>
                    <div
                      className='h-2 rounded bg-primary'
                      style={{ width: `${it.percent}%` }}
                    />
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className='text-muted-foreground text-sm'>No data</div>
              )}
            </div>
            <div className='h-[260px] md:col-span-3'>
              <ResponsiveContainer height='100%' width='100%'>
                <BarChart
                  data={seriesData}
                  margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid stroke='var(--border)' strokeDasharray='3 3' />
                  <XAxis
                    dataKey='label'
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--popover)',
                      color: 'var(--popover-foreground)',
                      border: '1px solid var(--border)',
                    }}
                  />
                  <Legend wrapperStyle={{ color: 'var(--muted-foreground)' }} />
                  {eventNames.map((name, i) => (
                    <Bar
                      dataKey={name}
                      fill={colorFor(i)}
                      key={name}
                      stackId='events'
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
