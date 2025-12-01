import { randomUUID } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { generateWelcomeEmail } from '@/lib/email-templates'
import { APP_BASE_URL, SMTP_FROM_EMAIL, SMTP_FROM_NAME } from '@/lib/env'
import { sendSmtpMail } from '@/lib/smtp'
import { makeUnsubToken } from '@/lib/tokens'

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
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === '23505') {
      const existing = await db
        .selectFrom('subscribers')
        .selectAll()
        .where('email', '=', lower)
        .executeTakeFirst()
      if (!existing) throw e
      subscriberId = existing.id as typeof id

      if (existing.status === 'unsubscribed') {
        // Réactiver l'abonnement si désabonné - continuer pour envoyer l'email de bienvenue
        await db
          .updateTable('subscribers')
          .set({ status: 'active', unsubscribed_at: null })
          .where('id', '=', existing.id)
          .execute()
        // On continue pour envoyer l'email de bienvenue
      } else if (
        existing.status === 'active' ||
        existing.status === 'pending'
      ) {
        // L'utilisateur est déjà inscrit (actif ou en attente), on retourne juste un message
        return NextResponse.json({ ok: true, message: 'already_subscribed' })
      } else if (existing.status === 'bounced') {
        // Email rejeté par le serveur, ne pas réessayer
        return NextResponse.json(
          { ok: false, message: 'email_bounced' },
          { status: 400 },
        )
      }
    } else {
      throw e
    }
  }

  try {
    const unsubToken = makeUnsubToken(subscriberId, lower)
    const unsubscribeUrl = `${APP_BASE_URL()}/api/newsletter/unsubscribe?token=${unsubToken}`

    const { html, text } = generateWelcomeEmail({
      email: lower,
      unsubscribeUrl,
    })

    await sendSmtpMail({
      from: {
        name: SMTP_FROM_NAME(),
        email: SMTP_FROM_EMAIL(),
      },
      to: lower,
      subject: '🚀 Bienvenue à la newsletter du Bureau Des Étudiants !',
      html,
      text,
    })

    console.log(`✅ Email de bienvenue envoyé à ${lower}`)
  } catch (emailError) {
    // L'échec d'envoi d'email ne doit pas empêcher l'inscription
    console.error(
      "❌ Erreur lors de l'envoi de l'email de bienvenue:",
      emailError,
    )
  }

  return NextResponse.json({ ok: true, message: 'subscribed' })
}
