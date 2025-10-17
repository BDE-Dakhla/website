'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import useSWR from 'swr'
import type { MetricsTotals, MetricsSeriesPoint } from '@/app/api/analytics/types'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fetcher } from '@/lib/utils'

type Range = '3h' | '6h' | '12h' | '24h' | '7d' | '30d' | '90d' | '6mo' | '1y'

interface MetricsResponse {
  range: Range
  unit: string
  start: string
  end: string
  totals: MetricsTotals
  previous: MetricsTotals
  deltas: MetricsTotals
  series: MetricsSeriesPoint[]
}

function formatDuration(s: number) {
  const sec = Math.round(s)
  const m = Math.floor(sec / 60)
  const rem = sec % 60
  return `${m}m ${String(rem).padStart(2, '0')}s`
}

function StatSkeleton() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='mt-2 h-8 w-28' />
        <div className='mt-2 flex'>
          <Skeleton className='h-6 w-16 rounded-full' />
        </div>
      </CardHeader>
    </Card>
  )
}

export function AnalyticsOverview({ range }: { range: Range }) {
  const { data } = useSWR<MetricsResponse>(
    `/api/analytics/metrics?range=${range}`,
    fetcher,
    { refreshInterval: 60_000 },
  )

  if (!data) {
    return (
      <div className='grid @5xl/main:grid-cols-5 @xl/main:grid-cols-3 grid-cols-1 gap-4 px-4 lg:px-6'>
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    )
  }

  const totals = data?.totals || {
    views: 0,
    visits: 0,
    visitors: 0,
    bounce_rate: 0,
    avg_visit_duration_seconds: 0,
  }
  const deltas = data?.deltas || {
    views: 0,
    visits: 0,
    visitors: 0,
    bounce_rate: 0,
    avg_visit_duration_seconds: 0,
  }

  const Stat = ({
    label,
    value,
    delta,
  }: {
    label: string
    value: string
    delta: number
  }) => {
    const up = delta >= 0
    return (
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>{label}</CardDescription>
          <CardTitle className='font-semibold @[250px]/card:text-3xl text-2xl tabular-nums'>
            {value}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              {up ? <TrendingUp /> : <TrendingDown />}
              {up ? '+' : ''}
              {Math.abs(delta).toLocaleString()}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-2 md:grid-cols-3 lg:px-6 xl:grid-cols-5 dark:*:data-[slot=card]:bg-card'>
      <Stat
        delta={deltas.views || 0}
        label='Views'
        value={totals.views?.toLocaleString?.() ?? '0'}
      />
      <Stat
        delta={deltas.visits || 0}
        label='Visits'
        value={totals.visits?.toLocaleString?.() ?? '0'}
      />
      <Stat
        delta={deltas.visitors || 0}
        label='Visitors'
        value={totals.visitors?.toLocaleString?.() ?? '0'}
      />
      <Stat
        delta={deltas.bounce_rate || 0}
        label='Bounce rate'
        value={`${Number(totals.bounce_rate || 0).toFixed(0)}%`}
      />
      <Stat
        delta={deltas.avg_visit_duration_seconds || 0}
        label='Visit duration'
        value={formatDuration(totals.avg_visit_duration_seconds || 0)}
      />
    </div>
  )
}
