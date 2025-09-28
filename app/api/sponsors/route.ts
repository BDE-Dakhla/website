import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/instance'

export async function GET() {
  const db = getDb()
  const sponsors = await db
    .selectFrom('sponsors')
    .select(['id', 'name', 'logo_url', 'website_url', 'is_featured'])
    .where('approved', '=', true)
    .orderBy('is_featured', 'desc')
    .orderBy('priority', 'asc')
    .orderBy('created_at', 'desc')
    .execute()

  return NextResponse.json(sponsors, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
