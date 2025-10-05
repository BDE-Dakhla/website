import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sql } from 'kysely'

function resolveWindow(range?: string) {
  const now = new Date()
  const end = now
  let start: Date
  let unit: 'hour' | 'day' = 'hour'
  switch (range) {
    case '3h':
      start = new Date(end.getTime() - 3 * 3600 * 1000)
      unit = 'hour'
      break
    case '6h':
      start = new Date(end.getTime() - 6 * 3600 * 1000)
      unit = 'hour'
      break
    case '12h':
      start = new Date(end.getTime() - 12 * 3600 * 1000)
      unit = 'hour'
      break
    case '24h':
      start = new Date(end.getTime() - 24 * 3600 * 1000)
      unit = 'hour'
      break
    case '7d':
      start = new Date(end.getTime() - 7 * 24 * 3600 * 1000)
      unit = 'day'
      break
    case '30d':
      start = new Date(end.getTime() - 30 * 24 * 3600 * 1000)
      unit = 'day'
      break
    case '90d':
      start = new Date(end.getTime() - 90 * 24 * 3600 * 1000)
      unit = 'day'
      break
    case '6mo':
      start = new Date(end.getTime() - 182 * 24 * 3600 * 1000) // approx 6 months
      unit = 'day'
      break
    case '1y':
      start = new Date(end.getTime() - 365 * 24 * 3600 * 1000)
      unit = 'day'
      break
    default:
      start = new Date(end.getTime() - 24 * 3600 * 1000)
      unit = 'hour'
  }
  return { start, end, unit }
}

function previousWindow(start: Date, end: Date) {
  const duration = end.getTime() - start.getTime()
  const prevEnd = start
  const prevStart = new Date(start.getTime() - duration)
  return { start: prevStart, end: prevEnd }
}

type FilterOp = 'is' | 'is_not' | 'contains' | 'not_contains'

function parseFilters(param: string | null): { field: 'url' | 'referrer' | 'browser' | 'os' | 'device'; op: FilterOp; value: string }[] {
  if (!param) return []
  try {
    const arr = JSON.parse(param)
    if (Array.isArray(arr)) return arr.filter((r) => r && r.field && r.value)
  } catch {}
  return []
}

function buildWhereForFilters(filters: ReturnType<typeof parseFilters>) {
  const whereE: string[] = [] // conditions that apply to analytics_events e
  const whereS: string[] = [] // conditions that apply to analytics_sessions s
  const whereV: string[] = [] // conditions that apply to analytics_visitors v

  const val = (s: string) => s.replace(/'/g, "''")
  const like = (s: string) => `%${s.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`

  for (const f of filters) {
    const v = val(f.value)
    switch (f.field) {
      case 'url': {
        if (f.op === 'is') whereE.push(`e.path = '${v}'`)
        else if (f.op === 'is_not') whereE.push(`e.path <> '${v}'`)
        else if (f.op === 'contains') whereE.push(`e.path ILIKE '${like(v)}'`)
        else if (f.op === 'not_contains') whereE.push(`e.path NOT ILIKE '${like(v)}'`)
        break
      }
      case 'referrer': {
        if (f.op === 'is') whereS.push(`s.referrer = '${v}'`)
        else if (f.op === 'is_not') whereS.push(`(s.referrer is null or s.referrer <> '${v}')`)
        else if (f.op === 'contains') whereS.push(`s.referrer ILIKE '${like(v)}'`)
        else if (f.op === 'not_contains') whereS.push(`(s.referrer is null or s.referrer NOT ILIKE '${like(v)}')`)
        break
      }
      case 'browser': {
        // ua_brands JSON or user_agent text
        const cond = `((v.ua_brands::text ILIKE '${like(v)}') OR (v.user_agent ILIKE '${like(v)}'))`
        if (f.op === 'is') whereV.push(cond)
        else if (f.op === 'is_not') whereV.push(`NOT ${cond}`)
        else if (f.op === 'contains') whereV.push(cond)
        else if (f.op === 'not_contains') whereV.push(`NOT ${cond}`)
        break
      }
      case 'os': {
        const cond = `((v.ua_platform ILIKE '${like(v)}') OR (v.user_agent ILIKE '${like(v)}'))`
        if (f.op === 'is') whereV.push(cond)
        else if (f.op === 'is_not') whereV.push(`NOT ${cond}`)
        else if (f.op === 'contains') whereV.push(cond)
        else if (f.op === 'not_contains') whereV.push(`NOT ${cond}`)
        break
      }
      case 'device': {
        const cond = `(coalesce(v.device_category, CASE WHEN v.ua_mobile IS TRUE THEN 'Mobile' ELSE 'Desktop' END) ILIKE '${like(v)}')`
        if (f.op === 'is') whereV.push(cond)
        else if (f.op === 'is_not') whereV.push(`NOT ${cond}`)
        else if (f.op === 'contains') whereV.push(cond)
        else if (f.op === 'not_contains') whereV.push(`NOT ${cond}`)
        break
      }
    }
  }
  return { whereE, whereS, whereV }
}

export async function GET(req: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') ?? '24h'
  const filters = parseFilters(searchParams.get('filters'))
  const { start, end, unit } = resolveWindow(range)
  const { start: prevStart, end: prevEnd } = previousWindow(start, end)

  const { whereE, whereS, whereV } = buildWhereForFilters(filters)
  const needV = whereV.length > 0
  const needE = whereE.length > 0

  const whereEClause = whereE.length ? `and ${whereE.join(' and ')}` : ''
  const whereSClause = whereS.length ? `and ${whereS.join(' and ')}` : ''
  const joinV = needV ? 'join analytics_visitors v on v.id = s.visitor_id' : ''
  const joinE = needE ? "join analytics_events efilter on efilter.session_id = s.id and efilter.type = 'pageview'" + (whereE.length ? ` and ${whereE.join(' and ')}` : '') : ''

  // Totals for current window (sessions filtered by rules)
  const totalsSql = sql<any>`
    with s as (
      select s.* from analytics_sessions s ${sql.raw(joinV)} ${sql.raw(joinE)} where s.started_at >= ${start} and s.started_at < ${end} ${sql.raw(whereSClause)}
    ),
    e as (
      select * from analytics_events e where e.happened_at >= ${start} and e.happened_at < ${end} ${sql.raw(whereEClause)}
    ),
    pv as (
      select s.id, count(e2.id)::int as pageviews
      from s
      left join analytics_events e2 on e2.session_id = s.id and e2.type = 'pageview' and e2.happened_at >= ${start} and e2.happened_at < ${end}
      group by s.id
    )
    select
      (select count(*)::int from e where e.type = 'pageview') as views,
      (select count(*)::int from s) as visits,
      (select count(distinct visitor_id)::int from s) as visitors,
      (select coalesce(avg(extract(epoch from (s2.last_activity_at - s2.started_at)))::float, 0) from s s2) as avg_visit_duration_seconds,
      (select case when (select count(*) from s) = 0 then 0 else round((select count(*) from pv where pageviews = 1) * 100.0 / (select count(*) from s), 2) end) as bounce_rate
  `

  const prevTotalsSql = sql<any>`
    with s as (
      select s.* from analytics_sessions s ${sql.raw(joinV)} ${sql.raw(joinE.replaceAll('efilter', 'efilterp'))} where s.started_at >= ${prevStart} and s.started_at < ${prevEnd} ${sql.raw(whereSClause)}
    ),
    e as (
      select * from analytics_events e where e.happened_at >= ${prevStart} and e.happened_at < ${prevEnd} ${sql.raw(whereEClause)}
    ),
    pv as (
      select s.id, count(e2.id)::int as pageviews
      from s
      left join analytics_events e2 on e2.session_id = s.id and e2.type = 'pageview' and e2.happened_at >= ${prevStart} and e2.happened_at < ${prevEnd}
      group by s.id
    )
    select
      (select count(*)::int from e where e.type = 'pageview') as views,
      (select count(*)::int from s) as visits,
      (select count(distinct visitor_id)::int from s) as visitors,
      (select coalesce(avg(extract(epoch from (s2.last_activity_at - s2.started_at)))::float, 0) from s s2) as avg_visit_duration_seconds,
      (select case when (select count(*) from s) = 0 then 0 else round((select count(*) from pv where pageviews = 1) * 100.0 / (select count(*) from s), 2) end) as bounce_rate
  `

  const [totals, prevTotals] = await Promise.all([totalsSql.execute(db), prevTotalsSql.execute(db)])
  const tRaw = totals.rows?.[0] ?? { views: 0, visits: 0, visitors: 0, bounce_rate: 0, avg_visit_duration_seconds: 0 }
  const pRaw = prevTotals.rows?.[0] ?? { views: 0, visits: 0, visitors: 0, bounce_rate: 0, avg_visit_duration_seconds: 0 }

  const toNumber = (v: any) => (v === null || v === undefined || Number.isNaN(Number(v)) ? 0 : Number(v))
  const t = {
    views: toNumber(tRaw.views),
    visits: toNumber(tRaw.visits),
    visitors: toNumber(tRaw.visitors),
    bounce_rate: toNumber(tRaw.bounce_rate),
    avg_visit_duration_seconds: toNumber(tRaw.avg_visit_duration_seconds),
  }
  const p = {
    views: toNumber(pRaw.views),
    visits: toNumber(pRaw.visits),
    visitors: toNumber(pRaw.visitors),
    bounce_rate: toNumber(pRaw.bounce_rate),
    avg_visit_duration_seconds: toNumber(pRaw.avg_visit_duration_seconds),
  }

  // Time series
  const truncUnit = unit === 'hour' ? sql`hour` : sql`day`
  const stepLiteral = unit === 'hour' ? '1 hour' : '1 day'

  const seriesSql = sql<any>`
    with series as (
      select generate_series(
        date_trunc(${unit}, ${start}::timestamptz),
        date_trunc(${unit}, ${end}::timestamptz),
        interval '${sql.raw(stepLiteral)}'
      ) as bucket
    ),
    s as (
      select s.* from analytics_sessions s ${sql.raw(joinV)} ${sql.raw(joinE)} where s.started_at >= ${start} and s.started_at < ${end} ${sql.raw(whereSClause)}
    ),
    views as (
      select date_trunc(${unit}, e.happened_at) as bucket, count(*)::int as c
      from analytics_events e
      join s on s.id = e.session_id
      where e.type = 'pageview' and e.happened_at >= ${start} and e.happened_at < ${end} ${sql.raw(whereEClause)}
      group by 1
    ),
    visits as (
      select date_trunc(${unit}, s.started_at) as bucket, count(*)::int as c
      from s
      group by 1
    ),
    visitors as (
      select date_trunc(${unit}, s.started_at) as bucket, count(distinct s.visitor_id)::int as c
      from s
      group by 1
    )
    select s.bucket,
      coalesce(v.c, 0) as views,
      coalesce(vi.c, 0) as visitors,
      coalesce(va.c, 0) as visits
    from series s
    left join views v on v.bucket = s.bucket
    left join visitors vi on vi.bucket = s.bucket
    left join visits va on va.bucket = s.bucket
    order by s.bucket asc
  `

  const series = await seriesSql.execute(db)

  const deltas = {
    views: pctChange(t.views, p.views),
    visits: pctChange(t.visits, p.visits),
    visitors: pctChange(t.visitors, p.visitors),
    bounce_rate: pctChange(t.bounce_rate, p.bounce_rate),
    avg_visit_duration_seconds: pctChange(t.avg_visit_duration_seconds, p.avg_visit_duration_seconds),
  }

  return NextResponse.json({
    range,
    unit,
    start,
    end,
    totals: t,
    previous: p,
    deltas,
    series: series.rows.map((r: any) => ({
      time: r.bucket,
      views: Number(r.views),
      visits: Number(r.visits),
      visitors: Number(r.visitors),
    })),
  })
}

function pctChange(current: number, prev: number) {
  if (!prev) return current ? 100 : 0
  return Math.round(((current - prev) / prev) * 10000) / 100
}