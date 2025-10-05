import { sql } from 'kysely'
import { type NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

const ALLOWED: Record<string, true> = { '3h': true, '6h': true, '12h': true }

function resolveWindow(range?: string) {
  const now = new Date()
  const end = now
  let start: Date
  switch (range) {
    case '3h':
      start = new Date(end.getTime() - 3 * 3600 * 1000)
      break
    case '6h':
      start = new Date(end.getTime() - 6 * 3600 * 1000)
      break
    case '12h':
    default:
      start = new Date(end.getTime() - 12 * 3600 * 1000)
  }
  return { start, end }
}

export async function GET(req: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const requested = searchParams.get('range') || '6h'
  const range = ALLOWED[requested] ? requested : '12h'
  const { start, end } = resolveWindow(range)

  const summaryRows = await sql<{ event_name: string; c: number }>`
    select coalesce(event_name, 'Unknown') as event_name, count(*)::int as c
    from analytics_events
    where type = 'event' and happened_at >= ${start} and happened_at < ${end}
    group by 1
    order by c desc
  `.execute(db)

  const total = summaryRows.rows.reduce((acc, r) => acc + (r.c || 0), 0)
  const items = summaryRows.rows.map((r) => ({
    name: r.event_name,
    count: r.c,
    percent: total ? Math.round((r.c * 100) / total) : 0,
  }))

  const seriesRows = await sql<{ bucket: Date; event_name: string; c: number }>`
    with hrs as (
      select generate_series(date_trunc('hour', ${start}::timestamptz), date_trunc('hour', ${end}::timestamptz), interval '1 hour') as bucket
    )
    select h.bucket, coalesce(e.event_name, 'Unknown') as event_name, coalesce(count(e.id),0)::int as c
    from hrs h
    left join analytics_events e on e.type = 'event' and date_trunc('hour', e.happened_at) = h.bucket
      and e.happened_at >= ${start} and e.happened_at < ${end}
    group by 1,2
    order by 1 asc, 2 asc
  `.execute(db)

  return NextResponse.json({ range, total, items, series: seriesRows.rows })
}
