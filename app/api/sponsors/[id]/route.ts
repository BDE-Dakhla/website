import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/instance'
import { auth } from '@/auth'
import { hasPermission } from '@/lib/permission.server'
import { z } from 'zod'
import type { SponsorUpdate } from '@/types/schema'

const sponsorUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug must be less than 255 characters').optional(),
  description: z.string().nullable().optional(),
  website_url: z.string().url('Invalid URL').nullable().optional(),
  logo_url: z.string().min(1, 'Logo URL is required').optional(),
  priority: z.number().int().min(0).optional(),
  is_featured: z.boolean().optional(),
  approved: z.boolean().optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const canManageSponsors = await hasPermission(session.user.permissions, 'MANAGE_SPONSORS')
  if (!canManageSponsors) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const validatedData = sponsorUpdateSchema.parse(body)
    
    const db = getDb()
    
    // Check if sponsor exists
    const existingSponsor = await db
      .selectFrom('sponsors')
      .select(['id', 'slug'])
      .where('id', '=', params.id)
      .executeTakeFirst()
    
    if (!existingSponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }
    
    // Check if slug already exists (but not for current sponsor)
    if (validatedData.slug && validatedData.slug !== existingSponsor.slug) {
      const slugExists = await db
        .selectFrom('sponsors')
        .select(['id'])
        .where('slug', '=', validatedData.slug)
        .where('id', '!=', params.id)
        .executeTakeFirst()
      
      if (slugExists) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }
    }
    
    const updateData: SponsorUpdate = {
      ...validatedData,
      updated_at: new Date(),
    }
    
    // If approving, set approval metadata
    if (validatedData.approved === true) {
      updateData.approved_at = new Date()
      updateData.approved_by = session.user.id
    }
    
    const [updatedSponsor] = await db
      .updateTable('sponsors')
      .set(updateData)
      .where('id', '=', params.id)
      .returningAll()
      .execute()
    
    return NextResponse.json(updatedSponsor)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error updating sponsor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const canManageSponsors = await hasPermission(session.user.permissions, 'MANAGE_SPONSORS')
  if (!canManageSponsors) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const db = getDb()
    
    // Check if sponsor exists
    const existingSponsor = await db
      .selectFrom('sponsors')
      .select(['id'])
      .where('id', '=', params.id)
      .executeTakeFirst()
    
    if (!existingSponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }
    
    await db
      .deleteFrom('sponsors')
      .where('id', '=', params.id)
      .execute()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sponsor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}