import { type NextRequest, NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { getDb } from '@/lib/db'
import {
  APP_BASE_URL,
  CRON_SECRET,
  SEND_BATCH_SIZE,
  SMTP_FROM_EMAIL,
  SMTP_FROM_NAME,
} from '@/lib/env'
import { sendSmtpMail } from '@/lib/smtp'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('x-cron-secret')
  const t = await getTranslations({ locale: req.nextUrl.locale })

  if (auth !== CRON_SECRET())
    return NextResponse.json({ error: t('unauthorized') }, { status: 401 })

  const db = getDb()
  const now = new Date()
  const batch = SEND_BATCH_SIZE()

  const campaign = await db
    .selectFrom('campaigns')
    .selectAll()
    .where('status', 'in', ['scheduled', 'sending'])
    .where((eb) =>
      eb.or([eb('scheduled_at', '<=', now), eb('status', '=', 'sending')]),
    )
    .orderBy('scheduled_at', 'asc')
    .executeTakeFirst()

  if (!campaign) {
    return NextResponse.json({ ok: true, message: 'No due campaigns' })
  }

  if (campaign.status !== 'sending') {
    await db
      .updateTable('campaigns')
      .set({ status: 'sending' })
      .where('id', '=', campaign.id)
      .execute()
    campaign.status = 'sending'
  }

  const recipients = await db
    .selectFrom('campaignRecipients as r')
    .innerJoin('subscribers as s', 's.id', 'r.subscriber_id')
    .select(['r.id as rid', 'r.tracking_id as trid', 's.email as email'])
    .where('r.campaign_id', '=', campaign.id)
    .where('r.status', '=', 'pending')
    .limit(batch)
    .execute()

  if (recipients.length === 0) {
    await db
      .updateTable('campaigns')
      .set({ status: 'sent' })
      .where('id', '=', campaign.id)
      .execute()
    return NextResponse.json({ ok: true, message: 'Campaign completed' })
  }

  let sent = 0,
    failed = 0
  for (const r of recipients) {
    const pixel = `<img src="${APP_BASE_URL()}/api/newsletter/t/open?rid=${encodeURIComponent(r.trid)}" width="1" height="1" style="display:none" alt="" />`
    const html =
      campaign.html_body.replace('</body>', `${pixel}</body>`) ||
      campaign.html_body + pixel
    const listUnsub = `<mailto:${SMTP_FROM_EMAIL()}?subject=unsubscribe>`
    try {
      await sendSmtpMail({
        from: { name: SMTP_FROM_NAME(), email: SMTP_FROM_EMAIL() },
        to: r.email,
        subject: campaign.subject,
        text: campaign.text_body || undefined,
        html,
        headers: { 'List-Unsubscribe': listUnsub },
      })
      await db
        .updateTable('campaignRecipients')
        .set({ status: 'sent', sent_at: new Date(), last_error: null })
        .where('id', '=', r.rid)
        .execute()
      sent++
    } catch (err: unknown) {
      await db
        .updateTable('campaignRecipients')
        .set({
          status: 'failed',
          last_error: String((err as { message?: string })?.message || err),
        })
        .where('id', '=', r.rid)
        .execute()
      failed++
    }
  }

  return NextResponse.json({ ok: true, campaignId: campaign.id, sent, failed })
}
