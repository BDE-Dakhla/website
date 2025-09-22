import { type NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyUnsubToken } from '@/lib/tokens'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const db = getDb()
  const url = new URL(req.url)
  const token = url.searchParams.get('token') || ''
  const email = (url.searchParams.get('email') || '').toLowerCase()

  if (!token || !email)
    return NextResponse.json({ error: 'Missing token/email' }, { status: 400 })

  const id = verifyUnsubToken(token, email)
  if (!id) return NextResponse.json({ error: 'Invalid token' }, { status: 400 })

  await db
    .updateTable('subscribers')
    .set({
      status: 'unsubscribed',
      unsubscribed_at: new Date(),
      updated_at: new Date(),
    })
    .where('id', '=', id)
    .where('email', '=', email)
    .execute()

  return NextResponse.json({ ok: true, message: 'You have been unsubscribed.' })
}
