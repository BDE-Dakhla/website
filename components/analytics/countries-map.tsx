'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fetcher } from '@/lib/utils'

const GEO_URL = '/geo/countries-110m.json'

export type Range =
  | '3h'
  | '6h'
  | '12h'
  | '24h'
  | '7d'
  | '30d'
  | '90d'
  | '6mo'
  | '1y'

type ApiCountryItem = {
  code: string
  name: string
  count: number
  percent: number
}

function colorFor(value: number, max: number) {
  if (!max || max <= 0 || !value) return 'hsl(210 20% 90%)' // muted
  const t = Math.max(0, Math.min(1, value / max))
  // Interpolate between light and primary shades
  const l = 88 - t * 55 // lightness from 88% to 33%
  const s = 80 // saturation
  const h = 210 // blue-ish
  return `hsl(${h} ${s}% ${l}%)`
}

export function VisitorsByCountry({ range }: { range: Range }) {
  const { data } = useSWR<{ items: ApiCountryItem[] }>(
    `/api/analytics/countries?range=${range}`,
    fetcher,
    { refreshInterval: 60_000 },
  )
  const [tooltip, setTooltip] = useState<string | null>(null)

  const items = data?.items ?? []
  const totalMax = useMemo(
    () => (items.length ? Math.max(...items.map((i) => i.count)) : 0),
    [items],
  )

  // Measure container to compute width/height and dynamic scale
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ w: 800, h: 360 })
  useEffect(() => {
    if (!mapContainerRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const cr = e.contentRect
        setSize({ w: Math.max(1, cr.width), h: Math.max(1, cr.height) })
      }
    })
    ro.observe(mapContainerRef.current)
    return () => ro.disconnect()
  }, [])

  const BASE_W = 800
  const BASE_H = 400
  const BASE_SCALE = 155
  const computedScale = BASE_SCALE * Math.max(size.w / BASE_W, size.h / BASE_H)

  // Normalize names to match dataset naming
  const normalize = (s: string) =>
    (s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]+/g, '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z]+/g, '')

  const ALIAS: Record<string, string> = {
    unitedstatesofamerica: 'unitedstates',
    russianfederation: 'russia',
    boliviaplurinationalstateof: 'bolivia',
    unitedrepublicoftanzania: 'tanzania',
    tanzaniatheunitedrepublicof: 'tanzania',
    iranislamicrepublicof: 'iran',
    syriansarabrepublic: 'syria',
    laopeoplesdemocraticrepublic: 'laos',
    koreasouth: 'southkorea',
    koreanorth: 'northkorea',
    congodemocraticrepublicofthe: 'congokinshasa',
    republicofthecongo: 'congobrazzaville',
    coteivoire: 'cotedivoire',
    myanmarburma: 'myanmar',
  }

  const alt = (s: string) => {
    const n = normalize(s)
    if (ALIAS[n]) return ALIAS[n]
    if (s.includes(',')) {
      const swapped = s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]+/g, '')
        .toLowerCase()
        .split(',')
        .map((p) => p.trim())
        .reverse()
        .join(' ')
      const nn = normalize(swapped)
      return ALIAS[nn] || nn
    }
    return n
  }

  const countByName = useMemo(() => {
    const by: Record<string, number> = {}
    for (const it of items) {
      const key = alt(it.name)
      by[key] = (by[key] || 0) + it.count
    }
    return by
  }, [items])

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Visitors by country</CardTitle>
      </CardHeader>
      <CardContent className='px-4'>
        {!data ? (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <Skeleton className='h-[360px] md:col-span-3' />
            <div className='space-y-2'>
              {Array.from({ length: 10 }, (_, index): number => index + 1).map(
                (i) => (
                  <div className='flex items-center gap-3' key={i}>
                    <Skeleton className='h-4 w-6 rounded' />
                    <Skeleton className='h-4 w-40 flex-1' />
                    <Skeleton className='h-4 w-10' />
                  </div>
                ),
              )}
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div className='relative h-[360px] overflow-hidden rounded border md:col-span-3'>
              <div className='absolute inset-0' ref={mapContainerRef}>
                <ComposableMap
                  height={size.h}
                  projection='geoMercator'
                  projectionConfig={{ scale: computedScale, center: [0, 20] }}
                  style={{ width: '100%', height: '100%' }}
                  width={size.w}>
                  <ZoomableGroup maxZoom={8} minZoom={1}>
                    <Geographies geography={GEO_URL}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const props: any = geo.properties || {}
                          const gname: string =
                            props.name || props.NAME || props.ADMIN || ''
                          const count = countByName[alt(gname)] || 0
                          return (
                            <Geography
                              geography={geo}
                              key={geo.rsmKey}
                              onMouseEnter={() => {
                                const name =
                                  props.NAME ||
                                  props.name ||
                                  props.ADMIN ||
                                  'Unknown'
                                const label = `${name}: ${count} ${count === 1 ? 'visitor' : 'visitors'}`
                                setTooltip(label)
                              }}
                              onMouseLeave={() => setTooltip(null)}
                              style={{
                                default: {
                                  fill: colorFor(count, totalMax),
                                  outline: 'none',
                                  stroke: 'var(--foreground)',
                                  strokeWidth: 0.5,
                                  vectorEffect: 'non-scaling-stroke',
                                },
                                hover: {
                                  fill: 'hsl(210 80% 45%)',
                                  outline: 'none',
                                  stroke: 'var(--ring)',
                                  strokeWidth: 0.75,
                                  vectorEffect: 'non-scaling-stroke',
                                },
                                pressed: {
                                  fill: 'hsl(210 80% 35%)',
                                  outline: 'none',
                                  stroke: 'var(--ring)',
                                  strokeWidth: 0.75,
                                  vectorEffect: 'non-scaling-stroke',
                                },
                              }}
                            />
                          )
                        })
                      }
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>
              </div>
              {tooltip && (
                <div className='pointer-events-none absolute top-2 left-2 rounded bg-popover px-2 py-1 text-popover-foreground text-xs shadow'>
                  {tooltip}
                </div>
              )}
            </div>
            <div className='space-y-2'>
              {items.slice(0, 12).map((it) => (
                <div className='flex items-center gap-3' key={it.code}>
                  <span
                    aria-hidden
                    className={`fi fi-${it.code.toLowerCase()}`}
                  />
                  <div className='flex-1 truncate text-sm'>{it.name}</div>
                  <div className='w-16 text-right text-muted-foreground text-sm tabular-nums'>
                    {it.count.toLocaleString()}
                  </div>
                  <div className='ms-2 w-10 text-right text-muted-foreground text-xs'>
                    {it.percent}%
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className='text-muted-foreground text-sm'>No data</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
