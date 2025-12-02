import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { getDb } from '@/lib/db/instance'
import { hasPermission } from '@/lib/permission'

const updateClubSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be less than 100 characters')
    .optional(),
  hasInternationalGroup: z.boolean().optional(),
  memberCount: z.number().int().min(0).optional(),
  imageUrl: z.string().nullable().optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth()
    const canManageClubs =
      session?.user && hasPermission(session.user.permissions, 'MANAGE_CLUBS')

    if (!canManageClubs) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateClubSchema.parse(body)

    const db = getDb()
    const club = await db
      .updateTable('clubs')
      .set(validatedData)
      .where('id', '=', params.id)
      .returningAll()
      .executeTakeFirst()

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 })
    }

    return NextResponse.json(club)
  } catch (error) {
    console.error('Error updating club:', error)

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

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth()
    const canManageClubs =
      session?.user && hasPermission(session.user.permissions, 'MANAGE_CLUBS')

    if (!canManageClubs) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const db = getDb()
    const club = await db
      .deleteFrom('clubs')
      .where('id', '=', params.id)
      .returningAll()
      .executeTakeFirst()

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting club:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
