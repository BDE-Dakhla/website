import type { Kysely } from 'kysely'
import type { Database } from '../../../types/schema'
import { hash } from 'bcryptjs'

// bitmask flags (keep in sync with lib/permissions if needed)
const PERM_DASHBOARD = 1 << 0

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com'
const ADMIN_CDM = process.env.SEED_ADMIN_CDM ?? 'ADM001'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123'

export async function seed(db: Kysely<Database>) {
  const pwHash = await hash(ADMIN_PASSWORD, 10)

  await db
    .insertInto('User')
    .values({
      email: ADMIN_EMAIL,
      first_name: 'Admin',
      last_name: 'User',
      cdm: ADMIN_CDM,
      password: pwHash,
      permissions: PERM_DASHBOARD,
      emailVerified: new Date(),
    })
    .onConflict((oc) =>
      oc.column('email').doUpdateSet({
        first_name: 'Admin',
        last_name: 'User',
        cdm: ADMIN_CDM,
        password: pwHash,
        permissions: PERM_DASHBOARD,
        emailVerified: new Date(),
      }),
    )
    .execute()
}
