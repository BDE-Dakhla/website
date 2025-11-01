import type { MaintenanceModeSettings } from '@/types/schema'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { getDb } from '@/lib/db/instance'
import { hasPermission } from '@/lib/permission'

export const runtime = 'edge'

const maintenanceToggleSchema = z.object({
  enabled: z.boolean(),
})

export async function GET() {
  try {
    const db = getDb()
    const setting = await db
      .selectFrom('system_settings')
      .select(['value'])
      .where('key', '=', 'maintenance_mode')
      .executeTakeFirst()

    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
    }

    return NextResponse.json(setting.value as MaintenanceModeSettings)
  } catch (error) {
    console.error('Error fetching maintenance mode:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hasSystemAdmin = hasPermission(session.user.permissions, 'SYSTEM_ADMIN')
  if (!hasSystemAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const validatedData = maintenanceToggleSchema.parse(body)

    const db = getDb()

    const updated = await db
      .updateTable('system_settings')
      .set({
        value: JSON.stringify({ enabled: validatedData.enabled }),
        updated_by: session.user.id,
      })
      .where('key', '=', 'maintenance_mode')
      .returningAll()
      .executeTakeFirst()

    if (!updated) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
    }

    return NextResponse.json(updated.value as MaintenanceModeSettings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 },
      )
    }
    console.error('Error updating maintenance mode:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
