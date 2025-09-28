import type { Kysely } from 'kysely'
import type { Database } from '../../../types/schema'

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com'

export async function seed(db: Kysely<Database>) {
  const admin = await db
    .selectFrom('User')
    .select(['id'])
    .where('email', '=', ADMIN_EMAIL)
    .executeTakeFirst()

  const approvedBy = admin?.id ?? null
  const now = new Date()

  const sponsors = [
    {
      name: 'Acme Inc.',
      slug: 'acme',
      logo_url: 'https://placehold.co/240x100?text=ACME',
      website_url: 'https://acme.example',
      description: 'Leading provider of widgets.',
      is_featured: true,
      priority: 10,
    },
    {
      name: 'Globex',
      slug: 'globex',
      logo_url: 'https://placehold.co/240x100?text=Globex',
      website_url: 'https://globex.example',
      description: 'Global solutions for modern teams.',
      is_featured: false,
      priority: 50,
    },
    {
      name: 'Initech',
      slug: 'initech',
      logo_url: 'https://placehold.co/240x100?text=Initech',
      website_url: 'https://initech.example',
      description: 'Enterprise-grade TPS reports.',
      is_featured: true,
      priority: 20,
    },
  ] as const

  for (const s of sponsors) {
    await db
      .insertInto('sponsors')
      .values({
        name: s.name,
        slug: s.slug,
        logo_url: s.logo_url,
        website_url: s.website_url,
        description: s.description,
        is_featured: s.is_featured,
        priority: s.priority,
        approved: true,
        approved_at: now,
        approved_by: approvedBy,
      })
      .onConflict((oc) =>
        oc.column('slug').doUpdateSet({
          name: s.name,
          logo_url: s.logo_url,
          website_url: s.website_url,
          description: s.description,
          is_featured: s.is_featured,
          priority: s.priority,
          approved: true,
          approved_at: now,
          approved_by: approvedBy,
        }),
      )
      .execute()
  }
}
