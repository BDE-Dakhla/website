import type { Kysely } from 'kysely'
import type { Database } from '@/types/schema'
import { hash } from 'bcryptjs'
import { getDb } from '../instance'

const data = [
  {
    name: 'CIH Bank',
    href: 'https://www.instagram.com/le_passage_dakhla',
    logo: 'cih',
  },
  {
    name: 'Attijari Wafabank',
    href: 'https://www.instagram.com/le_passage_dakhla',
    logo: 'awb',
  },
  {
    name: 'Société Générale',
    href: 'https://www.instagram.com/le_passage_dakhla',
    logo: 'sg',
  },
]

const PERM_HAS_ACCESS_TO_DASHBOARD = 1 << 0

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com'
const ADMIN_CDM = process.env.SEED_ADMIN_CDM ?? 'ADM001'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123'

async function upsertAdmin(db: Kysely<Database>) {
  const pwHash = await hash(ADMIN_PASSWORD, 10)

  const existing = await db
    .selectFrom('User') // keep exact casing
    .select(['id'])
    .where('email', '=', ADMIN_EMAIL)
    .executeTakeFirst()

  if (existing) {
    await db
      .updateTable('User')
      .set({
        first_name: 'Admin',
        last_name: 'User',
        cdm: ADMIN_CDM,
        password: pwHash,
        permissions: PERM_HAS_ACCESS_TO_DASHBOARD,
        emailVerified: new Date(),
      })
      .where('id', '=', existing.id)
      .execute()

    return existing.id
  }

  const inserted = await db
    .insertInto('User')
    .values({
      email: ADMIN_EMAIL,
      first_name: 'Admin',
      last_name: 'User',
      cdm: ADMIN_CDM,
      password: pwHash,
      permissions: PERM_HAS_ACCESS_TO_DASHBOARD,
      emailVerified: new Date(),
    })
    .returning(['id'])
    .executeTakeFirstOrThrow()

  return inserted.id
}

async function upsertSponsors(db: Kysely<Database>, approvedBy: string) {
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
    const exists = await db
      .selectFrom('sponsors')
      .select(['id'])
      .where('slug', '=', s.slug)
      .executeTakeFirst()

    if (exists) {
      await db
        .updateTable('sponsors')
        .set({
          name: s.name,
          logo_url: s.logo_url,
          website_url: s.website_url,
          description: s.description,
          is_featured: s.is_featured,
          priority: s.priority,
          approved: true,
          approved_at: now,
          approved_by: approvedBy,
        })
        .where('id', '=', exists.id)
        .execute()
    } else {
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
        .execute()
    }
  }
}

async function main() {
  const db = getDb()

  try {
    const adminId = await upsertAdmin(db)
    await upsertSponsors(db, adminId)
    console.log('Seed complete ✅')
    console.log(`- Admin email: ${ADMIN_EMAIL}`)
    console.log(`- Admin cdm:   ${ADMIN_CDM}`)
    console.log(`- Admin pass:  ${ADMIN_PASSWORD}`)
  } finally {
    // if your getDb() returns a shared singleton, you can skip destroy()
    // but for CLI use it’s fine:
    if (typeof db.destroy === 'function') await db.destroy()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
