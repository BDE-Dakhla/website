import { sql } from 'kysely'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

const ACTIVE_WINDOW_MINUTES = 5

export async function GET() {
  const db = getDb()
  const { rows } = await sql<any>`
    select count(*)::int as current
    from analytics_sessions s
    where s.last_activity_at > now() - interval '${sql.raw(String(ACTIVE_WINDOW_MINUTES))} minutes'
  `.execute(db)

  const current = rows?.[0]?.current ?? 0
  return NextResponse.json({ current })
}
