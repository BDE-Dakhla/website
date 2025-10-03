import type { Database } from '../../../types/schema'
import { type Kysely, sql } from 'kysely'

const KEY = 'HAS_ACCESS_TO_DASHBOARD'

export async function seed(db: Kysely<Database>) {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com'
  await db
    .updateTable('User')
    .set({
      permissions: sql`COALESCE("permissions", '{}'::jsonb) || jsonb_build_object(${KEY}, 1)`,
    })
    .where('email', '=', email)
    .execute()
}
