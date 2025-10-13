import crypto from 'node:crypto'
import { sql } from 'kysely'
import { type NextRequest, NextResponse } from 'next/server'
import { parseSecChUaBrands, parseUserAgent } from '@/lib/analytics/ua'
import { getDb } from '@/lib/db'
import { parseCollectBody } from '../types'

const VISITOR_COOKIE = 'ba_vid'
const SESSION_COOKIE = 'ba_sid'
const SESSION_IDLE_MS = 30 * 60 * 1000 // 30 minutes

function getClientIp(req: NextRequest) {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const firstIp = xff.split(',')[0]?.trim()
    if (firstIp) return firstIp
  }
  return '0.0.0.0'
}

function hashIp(ip: string) {
  const secret = process.env.AUTH_NEXT_SECRET || ''
  return crypto
    .createHash('sha256')
    .update(`${ip}|${secret}`)
    .digest('hex')
    .slice(0, 32)
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
  let uaPlatform = chPlatform?.replace(/\\"/g, '') || null
  let uaMobile = chMobile ? chMobile.includes('1') : null

  // Try to resolve visitor country via common proxy/CDN headers
  const countryHeaders = [
    'x-vercel-ip-country',
    'x-geo-country',
    'x-country',
    'x-country-code',
    'cf-ipcountry',
    'cloudfront-viewer-country',
    'fastly-country-code',
  ] as const
  let countryCode: string | null = null
  for (const h of countryHeaders) {
    const v = req.headers.get(h)
    if (v && v.length >= 2) {
      countryCode = v.slice(0, 2).toUpperCase()
      break
    }
  }
  // Fallback: infer region from Accept-Language (e.g., en-US -> US)
  if (!countryCode) {
    const al = req.headers.get('accept-language')
    const m = al?.match(/[A-Za-z]{2,8}[-_]([A-Za-z]{2})/)
    if (m?.[1]) countryCode = m[1].toUpperCase()
  }

  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const body = parseCollectBody(rawBody)
  if (!body) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { type, path, title, referrer, locale, ua_ch, event } = body

  if (ua_ch) {
    if (ua_ch.brands && ua_ch.brands.length > 0) {
      uaBrands = ua_ch.brands
    }
    if (ua_ch.platform) {
      uaPlatform = ua_ch.platform
    }
    if (ua_ch.mobile !== undefined) {
      uaMobile = ua_ch.mobile
    }
  }
  const uaParsed = parseUserAgent(ua, {
    ua_brands: uaBrands,
    ua_platform: uaPlatform,
    ua_mobile: uaMobile,
  })

  if (type === 'event' && !event) {
    return NextResponse.json({ error: 'Missing event name' }, { status: 400 })
  }

  // Find or create visitor by cookie
  const cookies = req.cookies
  let vid = cookies.get(VISITOR_COOKIE)?.value

  // if no cookie, create visitor and set cookie
  if (!vid) {
    vid = crypto.randomUUID()
  }

  const jsonBrands = uaBrands.length ? JSON.stringify(uaBrands) : null

  const visitorResult = await db
    .insertInto('analytics_visitors')
    .values({
      visitor_key: vid,
      ip_hash: ipHash,
      user_agent: ua ?? undefined,
      ua_brands: jsonBrands ? sql`cast(${jsonBrands} as jsonb)` : undefined,
      ua_platform: uaPlatform ?? undefined,
      ua_mobile: uaMobile,
      device_category: uaParsed.device,
    })
    .onConflict((oc) =>
      oc.column('visitor_key').doUpdateSet({
        ip_hash: ipHash,
        user_agent: ua ?? undefined,
        ua_brands: jsonBrands ? sql`cast(${jsonBrands} as jsonb)` : undefined,
        ua_platform: uaPlatform ?? undefined,
        ua_mobile: uaMobile,
        device_category: uaParsed.device,
      }),
    )
    .returningAll()
    .execute()

  const visitor = visitorResult[0]
  if (!visitor) {
    return NextResponse.json(
      { error: 'Failed to create visitor' },
      { status: 500 },
    )
  }

  // Find or create session by cookie
  const sid = cookies.get(SESSION_COOKIE)?.value
  const sessionId = sid ?? crypto.randomUUID()

  // Check if existing session is still valid
  let session = await db
    .selectFrom('analytics_sessions')
    .selectAll()
    .where('id', '=', sessionId)
    .where('visitor_id', '=', visitor.id)
    .executeTakeFirst()

  const isExpired =
    !session ||
    now.getTime() - new Date(session.last_activity_at).getTime() >
      SESSION_IDLE_MS

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
        country_code: countryCode,
      })
      .onConflict((oc) => oc.doNothing())
      .returningAll()
      .executeTakeFirst()

    session =
      inserted ??
      (await db
        .selectFrom('analytics_sessions')
        .selectAll()
        .where('id', '=', sessionId)
        .executeTakeFirst())
  } else {
    await db
      .updateTable('analytics_sessions')
      .set({ last_activity_at: sql`${now}` })
      .where('id', '=', session.id)
      .execute()
  }

  if (!session) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 },
    )
  }

  // Insert event
  await db
    .insertInto('analytics_events')
    .values({
      session_id: session.id,
      happened_at: now,
      type,
      path,
      title: title ?? null,
      event_name: type === 'event' ? (event ?? null) : null,
    })
    .execute()

  const res = NextResponse.json({ ok: true })
  // Refresh cookies
  res.cookies.set(VISITOR_COOKIE, vid, { path: '/', maxAge: 365 * 24 * 3600 })
  res.cookies.set(SESSION_COOKIE, session.id, { path: '/', maxAge: 2 * 3600 })
  return res
}
