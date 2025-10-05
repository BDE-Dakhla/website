import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sql } from 'kysely'
import crypto from 'node:crypto'
import { parseSecChUaBrands, parseUserAgent } from '@/lib/analytics/ua'

const VISITOR_COOKIE = 'ba_vid'
const SESSION_COOKIE = 'ba_sid'
const SESSION_IDLE_MS = 30 * 60 * 1000 // 30 minutes

function getClientIp(req: NextRequest) {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim()
  return req.ip ?? '0.0.0.0'
}

function hashIp(ip: string) {
  const secret = process.env.AUTH_NEXT_SECRET || ''
  return crypto.createHash('sha256').update(ip + '|' + secret).digest('hex').slice(0, 32)
}

export async function POST(req: NextRequest) {
  const db = getDb()

  const now = new Date()
  const ip = getClientIp(req)
  const ipHash = hashIp(ip)
  const ua = req.headers.get('user-agent') ?? null
  // User-Agent Client Hints (low-entropy) if present
  const chUa = req.headers.get('sec-ch-ua')
  const chPlatform = req.headers.get('sec-ch-ua-platform')
  const chMobile = req.headers.get('sec-ch-ua-mobile')
  let uaBrands = parseSecChUaBrands(chUa)
  let uaPlatform = chPlatform?.replace(/\"/g, '') || null
  let uaMobile = chMobile ? chMobile.includes('1') : null

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { type, path, title, referrer, locale, ua_ch } = body as {
    type: 'pageview' | 'heartbeat'
    path: string
    title?: string
    referrer?: string
    locale?: string
    ua_ch?: { brands?: { brand: string; version?: string }[]; platform?: string; mobile?: boolean }
  }

  if (ua_ch) {
    if (Array.isArray(ua_ch.brands) && ua_ch.brands.length) uaBrands = ua_ch.brands
    if (typeof ua_ch.platform === 'string') uaPlatform = ua_ch.platform
    if (typeof ua_ch.mobile === 'boolean') uaMobile = ua_ch.mobile
  }
  const uaParsed = parseUserAgent(ua, { ua_brands: uaBrands as any, ua_platform: uaPlatform, ua_mobile: uaMobile })

  if (!type || (type !== 'pageview' && type !== 'heartbeat') || !path) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // Find or create visitor by cookie
  const cookies = req.cookies
  let vid = cookies.get(VISITOR_COOKIE)?.value

  // if no cookie, create visitor and set cookie
  if (!vid) {
    vid = crypto.randomUUID()
  }

  const [visitor] = await db
    .insertInto('analytics_visitors')
    .values({ visitor_key: vid, ip_hash: ipHash, user_agent: ua ?? undefined, ua_brands: uaBrands.length ? uaBrands : undefined, ua_platform: uaPlatform ?? undefined, ua_mobile: uaMobile as any, device_category: uaParsed.device })
    .onConflict((oc) =>
      oc
        .column('visitor_key')
        .doUpdateSet({ ip_hash: ipHash, user_agent: ua ?? undefined, ua_brands: uaBrands.length ? uaBrands : undefined, ua_platform: uaPlatform ?? undefined, ua_mobile: uaMobile as any, device_category: uaParsed.device }),
    )
    .returningAll()
    .execute()

  // Find or create session by cookie
  let sid = cookies.get(SESSION_COOKIE)?.value
  let sessionId = sid ?? crypto.randomUUID()

  // Check if existing session is still valid
  let session = await db
    .selectFrom('analytics_sessions')
    .selectAll()
    .where('id', '=', sessionId)
    .where('visitor_id', '=', visitor.id)
    .executeTakeFirst()

  const isExpired = !session || now.getTime() - new Date(session.last_activity_at as any as string).getTime() > SESSION_IDLE_MS

  if (!session || isExpired) {
    const entry_path = path
    const entry_locale = locale ?? null
    const ref = referrer ?? req.headers.get('referer') ?? null
    const inserted = await db
      .insertInto('analytics_sessions')
      .values({
        id: sessionId,
        visitor_id: visitor.id,
        started_at: now,
        last_activity_at: now,
        entry_path,
        entry_locale,
        referrer: ref,
      })
      .onConflict((oc) => oc.doNothing())
      .returningAll()
      .executeTakeFirst()

    session = inserted ?? (await db.selectFrom('analytics_sessions').selectAll().where('id', '=', sessionId).executeTakeFirst())
  } else {
    await db
      .updateTable('analytics_sessions')
      .set({ last_activity_at: now })
      .where('id', '=', session.id)
      .execute()
  }

  // Insert event
  await db
    .insertInto('analytics_events')
    .values({ session_id: session!.id, happened_at: now, type, path, title: title ?? null })
    .execute()

  const res = NextResponse.json({ ok: true })
  // Refresh cookies
  res.cookies.set(VISITOR_COOKIE, vid, { path: '/', maxAge: 365 * 24 * 3600 })
  res.cookies.set(SESSION_COOKIE, session!.id, { path: '/', maxAge: 2 * 3600 })
  return res
}