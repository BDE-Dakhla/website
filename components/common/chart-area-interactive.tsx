'use client'

import type {
  FilterField,
  FilterOp,
  MetricsSeriesPoint,
  MetricsTotals,
} from '@/app/api/analytics/types'
import type { TimeRange } from '@/lib/analytics/types'
import { FilterIcon, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import useSWR from 'swr'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsMobile } from '@/hooks/use-mobile'
import { fetcher } from '@/lib/utils'

export const description = 'An interactive area chart'

const chartConfig = {
  views: {
    label: 'Views',
    color: 'var(--primary)',
  },
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--muted-foreground))',
  },
} satisfies ChartConfig

interface Props {
  range?: TimeRange
  onRangeChange?: (r: TimeRange) => void
}

export function ChartAreaInteractive({
  range: controlledRange,
  onRangeChange,
}: Props) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')

  useEffect(() => {
    if (!controlledRange && isMobile) {
      setTimeRange('24h')
    }
  }, [isMobile, controlledRange])

  const range = controlledRange ?? timeRange

  const [filters, setFilters] = useState<
    Array<{ field: FilterField; op: FilterOp; value: string }>
  >([])

  const urlOpts = useSWR<{ kind: string; items: string[] }>(
    `/api/analytics/options?kind=url&range=${range}`,
    fetcher,
  )
  const refOpts = useSWR<{ kind: string; items: string[] }>(
    `/api/analytics/options?kind=referrer&range=${range}`,
    fetcher,
  )
  const brOpts = useSWR<{ kind: string; items: string[] }>(
    `/api/analytics/options?kind=browser&range=${range}`,
    fetcher,
  )
  const osOpts = useSWR<{ kind: string; items: string[] }>(
    `/api/analytics/options?kind=os&range=${range}`,
    fetcher,
  )
  const devOpts = useSWR<{ kind: string; items: string[] }>(
    `/api/analytics/options?kind=device&range=${range}`,
    fetcher,
  )

  const [draft, setDraft] = useState<{
    [K in FilterField]?: {
      op: FilterOp
      value?: string
    }
  }>({})

  const filtersParam = useMemo(
    () => encodeURIComponent(JSON.stringify(filters)),
    [filters],
  )

  const { data } = useSWR<{
    range: string
    unit: string
    start: string
    end: string
    totals: MetricsTotals
    previous: MetricsTotals
    deltas: MetricsTotals
    series: MetricsSeriesPoint[]
  }>(`/api/analytics/metrics?range=${range}&filters=${filtersParam}`, fetcher, {
    refreshInterval: 60_000,
  })

  const series = useMemo(
    () =>
      (data?.series ?? []).map((d) => ({
        date: d.time,
        views: Number(d.views),
        visitors: Number(d.visitors),
      })),
    [data?.series],
  )

  const formatTick = (value: string) => {
    const date = new Date(value)
    if (data?.unit === 'hour') {
      return date.toLocaleTimeString(undefined, { hour: 'numeric' })
    }
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
  }

  function handleRangeChange(v: string) {
    if (!v) return
    const r = v as TimeRange
    if (!controlledRange) setTimeRange(r)
    onRangeChange?.(r)
  }

  const loading = !data

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Traffic</CardTitle>
        <CardDescription>
          <span>
            {(() => {
              const labels: Record<TimeRange, string> = {
                '3h': 'Last 3 hours',
                '6h': 'Last 6 hours',
                '12h': 'Last 12 hours',
                '24h': 'Last 24 hours',
                '7d': 'Last 7 days',
                '30d': 'Last 30 days',
                '90d': 'Last 3 months',
                '6mo': 'Last 6 months',
                '1y': 'Last year',
              }
              return labels[range]
            })()}
          </span>
        </CardDescription>
        <CardAction className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='sm' variant='outline'>
                <FilterIcon />
                Filtres
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-72'>
              <DropdownMenuLabel>Ajouter un filtre</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                ['url', 'URL'] as const,
                ['referrer', 'Referrer'] as const,
                ['browser', 'Browser'] as const,
                ['os', 'OS'] as const,
                ['device', 'Device'] as const,
              ].map(([key, label]) => (
                <DropdownMenuSub key={key}>
                  <DropdownMenuSubTrigger>{label}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className='w-72'>
                    <div className='grid gap-2 p-1'>
                      <Select
                        onValueChange={(op) =>
                          setDraft((d) => ({
                            ...d,
                            [key]: {
                              ...(d[key] || { op: 'is' }),
                              op: op,
                            },
                          }))
                        }
                        value={draft[key]?.op || 'is'}>
                        <SelectTrigger className='w-full' size='sm'>
                          <SelectValue placeholder='Operator' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='is'>Is</SelectItem>
                          <SelectItem value='is_not'>Is Not</SelectItem>
                          <SelectItem value='contains'>Contains</SelectItem>
                          <SelectItem value='not_contains'>
                            Does not contain
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(val) =>
                          setDraft((d) => ({
                            ...d,
                            [key]: { ...(d[key] || { op: 'is' }), value: val },
                          }))
                        }
                        value={draft[key]?.value}>
                        <SelectTrigger className='w-full' size='sm'>
                          <SelectValue placeholder='Select value' />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            (key === 'url'
                              ? urlOpts.data?.items
                              : key === 'referrer'
                                ? refOpts.data?.items
                                : key === 'browser'
                                  ? brOpts.data?.items
                                  : key === 'os'
                                    ? osOpts.data?.items
                                    : devOpts.data?.items) || []
                          ).map((v: string) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => {
                          const d = draft[key]
                          if (!d?.value) return
                          setFilters((f) => [
                            ...f,
                            {
                              field: key,
                              op: d.op || 'is',
                              value: d.value as string,
                            },
                          ])
                        }}
                        size='sm'>
                        Add rule
                      </Button>
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select onValueChange={handleRangeChange} value={range}>
            <SelectTrigger
              aria-label='Select a value'
              className='flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate'
              size='sm'>
              <SelectValue placeholder='Last 3 months' />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
              <SelectItem className='rounded-lg' value='24h'>
                Last 24 hours
              </SelectItem>
              <SelectItem className='rounded-lg' value='12h'>
                Last 12 hours
              </SelectItem>
              <SelectItem className='rounded-lg' value='6h'>
                Last 6 hours
              </SelectItem>
              <SelectItem className='rounded-lg' value='3h'>
                Last 3 hours
              </SelectItem>
              <SelectItem className='rounded-lg' value='7d'>
                Last 7 days
              </SelectItem>
              <SelectItem className='rounded-lg' value='30d'>
                Last 30 days
              </SelectItem>
              <SelectItem className='rounded-lg' value='90d'>
                Last 3 months
              </SelectItem>
              <SelectItem className='rounded-lg' value='6mo'>
                Last 6 months
              </SelectItem>
              <SelectItem className='rounded-lg' value='1y'>
                Last year
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        {/* Active filters */}
        {filters.length > 0 && (
          <div className='mb-3 flex flex-wrap items-center gap-2'>
            {filters.map((f, idx) => (
              <span
                className='inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs'
                key={f.value}>
                <span className='font-medium'>{f.field}</span>
                <span className='text-muted-foreground'>{f.op}</span>
                <span className='max-w-48 truncate'>{f.value}</span>
                <Button
                  aria-label='Remove filter'
                  className='text-muted-foreground hover:text-foreground'
                  onClick={() =>
                    setFilters((arr) => arr.filter((_, i) => i !== idx))
                  }
                  size='icon'
                  variant='outline'>
                  <X className='size-3' />
                </Button>
              </span>
            ))}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size='xs' variant='outline'>
                  Clear all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all filters?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all current filter rules.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => setFilters([])}>
                    Clear
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {loading ? (
          <div className='h-[250px] w-full'>
            <Skeleton className='h-full w-full' />
          </div>
        ) : (
          <ChartContainer
            className='aspect-auto h-[250px] w-full'
            config={chartConfig}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id='fillViews' x1='0' x2='0' y1='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-views)'
                    stopOpacity={1.0}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-views)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id='fillVisitors' x1='0' x2='0' y1='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-visitors)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-visitors)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                axisLine={false}
                dataKey='date'
                minTickGap={32}
                tickFormatter={(v) => formatTick(String(v))}
                tickLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator='dot'
                    labelFormatter={(value) => {
                      const d = new Date(String(value))
                      return data?.unit === 'hour'
                        ? d.toLocaleString(undefined, { hour: 'numeric' })
                        : d.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })
                    }}
                  />
                }
                cursor={false}
              />
              <Area
                dataKey='visitors'
                fill='url(#fillVisitors)'
                stackId='a'
                stroke='var(--color-visitors)'
                type='natural'
              />
              <Area
                dataKey='views'
                fill='url(#fillViews)'
                stackId='a'
                stroke='var(--color-views)'
                type='natural'
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
