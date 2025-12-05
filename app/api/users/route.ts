import { randomUUID } from 'node:crypto'
import { hash } from 'bcryptjs'
import { type NextRequest, NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/auth'
import { publicUserSchema } from '@/components/schema'
import { getDb } from '@/lib/db/instance'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const t = await getTranslations({ locale: req.nextUrl.locale })

    if (!session?.user?.id) {
      return NextResponse.json({ error: t('unauthorized') }, { status: 401 })
    }

    const body = await req.json()
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
