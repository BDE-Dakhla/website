import { sql } from 'kysely'
import { type NextRequest, NextResponse } from 'next/server'
import { parseUserAgent } from '@/lib/analytics/ua'
import { getDb } from '@/lib/db'

type Kind = 'browsers' | 'os' | 'devices'

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
      start = new Date(end.getTime() - 12 * 3600 * 1000)
      break
    case '24h':
      start = new Date(end.getTime() - 24 * 3600 * 1000)
      break
    case '7d':
      start = new Date(end.getTime() - 7 * 24 * 3600 * 1000)
      break
    case '30d':
      start = new Date(end.getTime() - 30 * 24 * 3600 * 1000)
      break
    case '90d':
      start = new Date(end.getTime() - 90 * 24 * 3600 * 1000)
      break
    case '6mo':
      start = new Date(end.getTime() - 182 * 24 * 3600 * 1000)
      break
    case '1y':
      start = new Date(end.getTime() - 365 * 24 * 3600 * 1000)
      break
    default:
      start = new Date(end.getTime() - 24 * 3600 * 1000)
  }
  return { start, end }
}

export async function GET(req: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') ?? '90d'
  const kind = (searchParams.get('kind') ?? 'browsers') as Kind

  const { start, end } = resolveWindow(range)

  // Get unique visitors that had a session in the window and their UA
  const rows = await sql<{
    visitor_id: string
    user_agent: string | null
    ua_brands: any
    ua_platform: string | null
    ua_mobile: boolean | null
  }>`
    select distinct s.visitor_id, v.user_agent, v.ua_brands, v.ua_platform, v.ua_mobile
    from analytics_sessions s
    join analytics_visitors v on v.id = s.visitor_id
    where s.started_at >= ${start} and s.started_at < ${end}
  `.execute(db)

  const total = rows.rows.length
  const counts = new Map<string, number>()

  for (const r of rows.rows) {
    const ua = parseUserAgent(r.user_agent, {
      ua_brands: Array.isArray(r.ua_brands) ? r.ua_brands : null,
      ua_platform: r.ua_platform,
      ua_mobile: r.ua_mobile,
    })
    let key = 'Unknown'
    if (kind === 'browsers') key = ua.browser
    else if (kind === 'os') key = ua.os
    else if (kind === 'devices') key = ua.device

    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const items = Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      count,
      percent: total ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  return NextResponse.json({ range, total, kind, items })
}
