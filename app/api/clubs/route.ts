import { NextResponse } from 'next/server'
import { Vibrant } from 'node-vibrant/node'
import { z } from 'zod'
import { auth } from '@/auth'
import { clubSchema } from '@/components/schema'
import { getDb } from '@/lib/db/instance'
import { hasPermission } from '@/lib/permission'

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

export async function POST(request: Request) {
  try {
    const session = await auth()
    const canManageClubs =
      session?.user && hasPermission(session.user.permissions, 'MANAGE_CLUBS')

    if (!canManageClubs) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = clubSchema.parse(body)

    let dominantColor: string | null = validatedData.dominant_color || null

    if (validatedData.imageUrl && !dominantColor) {
      try {
        const palette = await Vibrant.from(validatedData.imageUrl).getPalette()
        dominantColor = palette.Vibrant?.hex || palette.Muted?.hex || null
      } catch (error) {
        console.error('Error extracting dominant color:', error)
        dominantColor = null
      }
    }

    const db = getDb()
    const club = await db
      .insertInto('clubs')
      .values({
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        hasInternationalGroup: validatedData.hasInternationalGroup,
        memberCount: validatedData.memberCount,
        imageUrl: validatedData.imageUrl || null,
        dominant_color: dominantColor,
      })
      .returningAll()
      .executeTakeFirst()

    return NextResponse.json(club)
  } catch (error) {
    console.error('Error creating club:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
