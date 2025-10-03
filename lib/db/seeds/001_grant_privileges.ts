import type { Kysely } from 'kysely'
import type { Database } from '../../../types/schema'

// bitmask flags (keep in sync with lib/permissions if needed)
const PERM_DASHBOARD = 1 << 0

export async function seed(db: Kysely<Database>) {
  const test = await db
    .updateTable('User')
    .set('permissions', PERM_DASHBOARD)
    .where('email', '=', process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com')
    .executeTakeFirst()

  console.log(test)
}
