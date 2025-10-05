import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sql } from 'kysely'
import { parseUserAgent } from '@/lib/analytics/ua'

function resolveWindow(range?: string) {
  const now = new Date()
  const end = now
  let start: Date
  switch (range) {
    case '3h': start = new Date(end.getTime() - 3 * 3600 * 1000); break
    case '6h': start = new Date(end.getTime() - 6 * 3600 * 1000); break
    case '12h': start = new Date(end.getTime() - 12 * 3600 * 1000); break
    case '24h': start = new Date(end.getTime() - 24 * 3600 * 1000); break
    case '7d': start = new Date(end.getTime() - 7 * 24 * 3600 * 1000); break
    case '30d': start = new Date(end.getTime() - 30 * 24 * 3600 * 1000); break
    case '90d': start = new Date(end.getTime() - 90 * 24 * 3600 * 1000); break
    case '6mo': start = new Date(end.getTime() - 182 * 24 * 3600 * 1000); break
    case '1y': start = new Date(end.getTime() - 365 * 24 * 3600 * 1000); break
    default: start = new Date(end.getTime() - 24 * 3600 * 1000)
  }
  return { start, end }
}

export async function GET(req: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const kind = (searchParams.get('kind') || 'url') as 'url' | 'referrer' | 'browser' | 'os' | 'device'
  const range = searchParams.get('range') || '24h'
  const { start, end } = resolveWindow(range)

  if (kind === 'url') {
    const rows = await sql<{ value: string }>`
      select distinct path as value
      from analytics_events
      where type = 'pageview' and happened_at >= ${start} and happened_at < ${end}
      order by value asc
    `.execute(db)
    const items = rows.rows.map((r) => r.value).filter(Boolean)
    return NextResponse.json({ kind, items })
  }
  if (kind === 'referrer') {
    const rows = await sql<{ value: string }>`
      select distinct referrer as value
      from analytics_sessions
      where referrer is not null and started_at >= ${start} and started_at < ${end}
      order by value asc
    `.execute(db)
    const items = rows.rows.map((r) => r.value).filter(Boolean)
    return NextResponse.json({ kind, items })
  }

  // For browser/os/device, we need to derive from visitor UA info
  const rows = await sql<any>`
    select distinct v.user_agent, v.ua_brands, v.ua_platform, v.ua_mobile, v.device_category
    from analytics_sessions s
    join analytics_visitors v on v.id = s.visitor_id
    where s.started_at >= ${start} and s.started_at < ${end}
  `.execute(db)

  const set = new Set<string>()
  for (const r of rows.rows) {
    const ua = parseUserAgent(r.user_agent, {
      ua_brands: Array.isArray(r.ua_brands) ? r.ua_brands : undefined,
      ua_platform: r.ua_platform,
      ua_mobile: r.ua_mobile,
    })
    if (kind === 'browser') set.add(ua.browser)
    else if (kind === 'os') set.add(ua.os)
    else if (kind === 'device') set.add(r.device_category || ua.device)
  }

  const items = Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b))
  return NextResponse.json({ kind, items })
}