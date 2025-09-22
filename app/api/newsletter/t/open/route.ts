import type { NextRequest } from 'next/server'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

const GIF = Buffer.from(
  'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64',
)

export async function GET(req: NextRequest) {
  const db = getDb()
  const rid = new URL(req.url).searchParams.get('rid') || ''
  if (rid) {
    await db
      .updateTable('campaign_recipients')
      .set({ opened_at: new Date() })
      .where('tracking_id', '=', rid)
      .where('opened_at', 'is', null)
      .execute()
  }

  return new Response(GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Content-Length': String(GIF.length),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  })
}
