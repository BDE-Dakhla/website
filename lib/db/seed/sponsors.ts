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
