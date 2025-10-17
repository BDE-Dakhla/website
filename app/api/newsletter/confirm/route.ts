import { type NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const db = getDb()
  const token = new URL(req.url).searchParams.get('token') || ''
  if (!token)
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const now = new Date()
  const row = await db
    .selectFrom('subscriptionTokens as t')
    .innerJoin('subscribers as s', 's.id', 't.subscriber_id')
    .select(['t.token', 't.expires_at', 't.used_at', 's.id as sid', 's.status'])
    .where('t.token', '=', token)
    .where('t.type', '=', 'confirm')
    .executeTakeFirst()

  if (!row || row.used_at || row.expires_at < now) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 400 },
    )
  }

  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable('subscribers')
      .set({ status: 'active' })
      .where('id', '=', row.sid)
      .execute()
    await trx
      .updateTable('subscriptionTokens')
      .set({ used_at: now })
      .where('token', '=', token)
      .execute()
  })

  return NextResponse.json({ ok: true, message: 'Subscription confirmed' })
}
