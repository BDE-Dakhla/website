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
        status: 'pending',
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
          .set({ status: 'pending', updated_at: now, unsubscribed_at: null })
          .where('id', '=', existing.id)
          .execute()
      }
    } else {
      throw e
    }
  }

  const token = randomToken(32)
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 48)
  await db
    .insertInto('subscription_tokens')
    .values({
      token,
      subscriber_id: subscriberId,
      type: 'confirm',
      expires_at: expires,
      used_at: null,
    })
    .execute()

  const confirmUrl = `${APP_BASE_URL()}/api/newsletter/confirm?token=${encodeURIComponent(token)}`
  const unsubToken = makeUnsubToken(subscriberId, lower)
  const listUnsub = `<mailto:${SMTP_FROM_EMAIL()}?subject=unsubscribe>, <${APP_BASE_URL()}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubToken)}&email=${encodeURIComponent(lower)}>`

  const emailData = {
    from: { name: SMTP_FROM_NAME(), email: SMTP_FROM_EMAIL() },
    to: lower,
    subject: 'Confirm your subscription',
    text: `Please confirm your subscription: ${confirmUrl}`,
    html: `<p>Please confirm your subscription:</p><p><a href="${confirmUrl}">Confirm</a></p>`,
    headers: {
      'List-Unsubscribe': listUnsub,
    },
  }


  return NextResponse.json({ ok: true })
}
