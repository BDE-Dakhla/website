import { randomUUID } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { SMTP_FROM_EMAIL, SMTP_FROM_NAME } from '@/lib/env'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  // body: { subject, html, text?, scheduledAt? ISO }
  const db = getDb()
  const body = await req.json()
  const subject = body.subject?.trim()
  const html = body.html?.toString()
  const text = body.text?.toString() || null
  const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null

  if (!subject || !html) {
    return NextResponse.json(
      { error: 'subject and html are required' },
      { status: 400 },
    )
  }

  const campaignId = randomUUID()
  const now = new Date()
  await db
    .insertInto('campaigns')
    .values({
      id: campaignId,
      subject,
      from_name: SMTP_FROM_NAME(),
      from_email: SMTP_FROM_EMAIL(),
      html_body: html,
      text_body: text,
      status: scheduledAt ? 'scheduled' : 'draft',
      scheduled_at: scheduledAt,
      created_at: now,
      updated_at: now,
    })
    .execute()

  // Pre-generate recipients for all active subscribers
  const subs = await db
    .selectFrom('subscribers')
    .select(['id', 'email'])
    .where('status', '=', 'active')
    .execute()

  if (subs.length) {
    await db.transaction().execute(async (trx) => {
      const chunks: (typeof subs)[] = []
      const size = 500
      for (let i = 0; i < subs.length; i += size)
        chunks.push(subs.slice(i, i + size))
      for (const chunk of chunks) {
        await trx
          .insertInto('campaign_recipients')
          .values(
            chunk.map((s) => ({
              id: randomUUID(),
              campaign_id: campaignId,
              subscriber_id: s.id,
              tracking_id: randomUUID(),
              status: 'pending',
              sent_at: null,
              opened_at: null,
              click_count: 0,
              last_error: null,
            })),
          )
          .execute()
      }
    })
  }

  return NextResponse.json({
    ok: true,
    id: campaignId,
    recipients: subs.length,
  })
}
