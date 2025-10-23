import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/instance'

export async function GET() {
  try {
    const db = getDb()
    const clubs = await db
      .selectFrom('clubs')
      .selectAll()
      .orderBy('createdAt', 'desc')
      .execute()

    return NextResponse.json(clubs)
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
