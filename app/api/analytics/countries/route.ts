import { sql } from 'kysely'
import { type NextRequest, NextResponse } from 'next/server'
import { resolveWindow } from '@/lib/analytics/utils'
import { getDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') ?? '24h'
  const { start, end } = resolveWindow(range)

  // Distinct visitors and their countries in the window
  const rows = await sql<{ visitor_id: string; country_code: string | null }>`
    select distinct s.visitor_id, upper(coalesce(s.country_code, 'ZZ')) as country_code
    from analytics_sessions s
    where s.started_at >= ${start} and s.started_at < ${end}
  `.execute(db)

  const totalVisitors = new Set(rows.rows.map((r) => r.visitor_id)).size

  // Count unique visitors per country (a visitor may appear in multiple countries)
  const countryVisitors = new Map<string, Set<string>>()
  for (const r of rows.rows) {
    const code = r.country_code || 'ZZ'
    if (!countryVisitors.has(code)) countryVisitors.set(code, new Set())
    countryVisitors.get(code)?.add(r.visitor_id)
  }

  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

  const items = Array.from(countryVisitors.entries())
    .map(([code, set]) => {
      const count = set.size
      const percent = totalVisitors
        ? Math.round((count / totalVisitors) * 100)
        : 0
      const name = code === 'ZZ' ? 'Unknown' : regionNames.of(code) || code
      return { code, name, count, percent }
    })
    .sort((a, b) => b.count - a.count)

  return NextResponse.json({ range, total: totalVisitors, items })
}
