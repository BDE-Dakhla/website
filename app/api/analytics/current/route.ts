import { sql } from 'kysely'
import { NextResponse } from 'next/server'
import { assertNumber } from '@/lib/analytics/utils'
import { getDb } from '@/lib/db'

const ACTIVE_WINDOW_MINUTES = 5

interface CurrentUsersRow {
  current: number | string
}

export async function GET() {
  const db = getDb()
  const { rows } = await sql<CurrentUsersRow>`
    select count(*)::int as current
    from analytics_sessions s
    where s.last_activity_at > now() - interval '${sql.raw(String(ACTIVE_WINDOW_MINUTES))} minutes'
  `.execute(db)

  const current = assertNumber(rows?.[0]?.current)
  return NextResponse.json({ current })
}
