import { randomUUID } from 'node:crypto'
import { hash } from 'bcryptjs'
import { type NextRequest, NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { getDb } from '@/lib/db/instance'
import { userRoleSchema } from '@/types/schema'

const createUserSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  email: z.email('Invalid email address.'),
  phoneNumber: z.string().min(1, 'Phone number is required.'),
  role: userRoleSchema,
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  permissions: z
    .record(z.string(), z.union([z.literal(0), z.literal(1)]))
    .optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const t = await getTranslations({ locale: req.nextUrl.locale })

    if (!session?.user?.id) {
      return NextResponse.json({ error: t('unauthorized') }, { status: 401 })
    }

    const body = await req.json()
    const validationResult = createUserSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.issues },
        { status: 400 },
      )
    }

    const { username, email, role, password, permissions } =
      validationResult.data

    const db = getDb()
    const existingUser = await db
      .selectFrom('User')
      .select(['id'])
      .where('email', '=', email)
      .executeTakeFirst()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 },
      )
    }

    const hashedPassword = await hash(password, 10)
    const now = new Date()
    const userId = randomUUID()
    const newUser = await db
      .insertInto('User')
      .values({
        id: userId,
        username,
        email,
        role,
        password: hashedPassword,
        permissions: permissions || {},
        created_at: now,
        updated_at: now,
        emailVerified: null,
        image: null,
        cdm: null,
        name: username,
      })
      .returningAll()
      .executeTakeFirst()

    if (!newUser) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 },
      )
    }

    // Remove password from response
    const { password: _password, ...safeUser } = newUser
    return NextResponse.json({ success: true, user: safeUser }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
