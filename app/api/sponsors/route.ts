import type { NewSponsor } from '@/types/schema'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { getDb } from '@/lib/db/instance'
import { hasPermission } from '@/lib/permission'

const sponsorSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be less than 255 characters'),
  description: z.string().nullable(),
  website_url: z.string().url('Invalid URL').nullable(),
  logo_url: z.string().min(1, 'Logo URL is required'),
  priority: z.number().int().min(0).default(100),
  is_featured: z.boolean().default(false),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const includeUnapproved = searchParams.get('include_unapproved') === 'true'

  const session = await auth()
  const canManageSponsors =
    session?.user && hasPermission(session.user.permissions, 'MANAGE_SPONSORS')

  const db = getDb()
  let query = db
    .selectFrom('sponsors')
    .select([
      'id',
      'name',
      'slug',
      'description',
      'logo_url',
      'website_url',
      'priority',
      'is_featured',
      'approved',
      'created_at',
      'updated_at',
      'approved_at',
      'approved_by',
    ])

  // Only show unapproved sponsors to users with manage permission
  if (!canManageSponsors || !includeUnapproved) {
    query = query.where('approved', '=', true)
  }

  const sponsors = await query
    .orderBy('is_featured', 'desc')
    .orderBy('priority', 'asc')
    .orderBy('created_at', 'desc')
    .execute()

  return NextResponse.json(sponsors, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canManageSponsors = hasPermission(
    session.user.permissions,
    'MANAGE_SPONSORS',
  )
  if (!canManageSponsors) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const validatedData = sponsorSchema.parse(body)

    const db = getDb()

    // Check if slug already exists
    const existingSponsor = await db
      .selectFrom('sponsors')
      .select(['id'])
      .where('slug', '=', validatedData.slug)
      .executeTakeFirst()

    if (existingSponsor) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 },
      )
    }

    const newSponsor: NewSponsor = {
      ...validatedData,
      approved: true, // Auto-approve when created by admin
      approved_by: session.user.id,
      approved_at: new Date(),
    }

    const [createdSponsor] = await db
      .insertInto('sponsors')
      .values(newSponsor)
      .returningAll()
      .execute()

    return NextResponse.json(createdSponsor)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 },
      )
    }
    console.error('Error creating sponsor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
