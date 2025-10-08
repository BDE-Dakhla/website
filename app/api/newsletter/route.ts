import { randomUUID } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { APP_BASE_URL, SMTP_FROM_EMAIL, SMTP_FROM_NAME } from '@/lib/env'
import { makeUnsubToken, randomToken } from '@/lib/tokens'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const db = getDb()
  const { email } = await req.json().catch(console.error)
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const now = new Date()
  const id = randomUUID()
  let subscriberId = id
  const lower = email.toLowerCase()

  try {
    await db
      .insertInto('subscribers')
      .values({
        id,
        email: lower,
        status: 'active',
        created_at: now,
        updated_at: now,
        unsubscribed_at: null,
      })
      .execute()
  } catch (e: any) {
    if (e?.code === '23505') {
      const existing = await db
        .selectFrom('subscribers')
        .selectAll()
        .where('email', '=', lower)
        .executeTakeFirst()
      if (!existing) throw e
      subscriberId = existing.id as typeof id
      if (existing.status === 'unsubscribed') {
        await db
          .updateTable('subscribers')
          .set({ status: 'active', updated_at: now, unsubscribed_at: null })
          .where('id', '=', existing.id)
          .execute()
      } else if (existing.status === 'active') {
        return NextResponse.json({ ok: true, message: 'already_subscribed' })
      }
    } else {
      throw e
    }
  }

  // Plus besoin de token de confirmation car l'abonnement est direct
  // L'utilisateur est déjà activé ci-dessus

  return NextResponse.json({ ok: true, message: 'subscribed' })
}
