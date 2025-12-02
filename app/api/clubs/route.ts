import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { getDb } from '@/lib/db/instance'
import { hasPermission } from '@/lib/permission'

const clubSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be less than 100 characters'),
  hasInternationalGroup: z.boolean().default(false),
  memberCount: z.number().int().min(0).default(0),
  imageUrl: z.string().nullable().optional(),
})

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
