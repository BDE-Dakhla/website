import type { PermissionMap, Role } from '@/types/schema'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/auth'
import { publicUserSchema } from '@/components/schema'
import { getDb } from '@/lib/db/instance'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    const t = await getTranslations()

    if (!session?.user?.id) {
      return NextResponse.json({ error: t('unauthorized') }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = publicUserSchema(t).safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.issues },
        { status: 400 },
      )
    }

    const { username, email, role, password, permissions } =
      validationResult.data

    const db = getDb()
    const { id: userId } = await params

    // Check if user exists
    const existingUser = await db
      .selectFrom('User')
      .select(['id'])
      .where('id', '=', userId)
      .executeTakeFirst()

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Build update object
    const updateData: {
      username: string
      email: string
      role: Role
      password?: string
      permissions?: PermissionMap
      updated_at?: Date
    } = {
      username,
      email,
      role,
      updated_at: new Date(),
    }

    // Add phoneNumber if the column exists (assuming it might be a custom field)
    // Note: Based on the schema, phoneNumber might not be in the User table
    // We'll include it in a type-safe way

    // Hash password if provided
    if (password && password.trim().length > 0) {
      const hashedPassword = await hash(password.trim(), 10)
      updateData.password = hashedPassword
    }

    // Add permissions if provided
    if (permissions !== undefined) {
      updateData.permissions = permissions
    }

    // Update user in database
    const updatedUser = await db
      .updateTable('User')
      .set(updateData)
      .where('id', '=', userId)
      .returningAll()
      .executeTakeFirst()

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 },
      )
    }

    // Remove password from response
    const { password: _password, ...safeUser } = updatedUser

    return NextResponse.json({
      success: true,
      user: safeUser,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
