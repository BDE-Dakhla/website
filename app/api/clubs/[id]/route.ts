import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { clubSchema } from '@/components/schema'
import { getDb } from '@/lib/db/instance'
import { hasPermission } from '@/lib/permission'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    const canManageClubs =
      session?.user && hasPermission(session.user.permissions, 'MANAGE_CLUBS')

    if (!canManageClubs) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await context.params

    const body = await request.json()
    const validatedData = clubSchema.parse(body)

    const db = getDb()
    const club = await db
      .updateTable('clubs')
      .set(validatedData)
      .where('id', '=', id)
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
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    const canManageClubs =
      session?.user && hasPermission(session.user.permissions, 'MANAGE_CLUBS')

    if (!canManageClubs) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await context.params

    const db = getDb()
    const club = await db
      .deleteFrom('clubs')
      .where('id', '=', id)
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
