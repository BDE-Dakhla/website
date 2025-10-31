import type { Kind, VisitorData } from '@/lib/analytics/types'
import { sql } from 'kysely'
import { type NextRequest, NextResponse } from 'next/server'
import { parseUserAgent } from '@/lib/analytics/ua'
import { resolveWindow } from '@/lib/analytics/utils'
import { getDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') ?? '90d'
  const kind = (searchParams.get('kind') ?? 'browsers') as Kind

  const { start, end } = resolveWindow(range)

  // Get unique visitors that had a session in the window and their UA
  const rows = await sql<
    VisitorData & {
      visitor_id: string
    }
  >`
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
