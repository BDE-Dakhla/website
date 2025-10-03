import type { Database } from '@/types/schema'
import { type Kysely, sql } from 'kysely'

const KEYS = ['HAS_ACCESS_TO_DASHBOARD', 'CAN_READ_DOCS'] as const

function jsonbBuildObjectForKeys(keys: readonly string[]) {
  const parts = keys.flatMap((k) => [sql.lit(k), sql.lit(1)])
  return sql`jsonb_build_object(${sql.join(parts)})`
}

export async function seed(db: Kysely<Database>) {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com'
  const patch = jsonbBuildObjectForKeys(KEYS)

  const res = await db
    .updateTable('User')
    .set({
      permissions: sql<Database['User']['permissions']>`
        COALESCE("permissions", '{}'::jsonb) || ${patch}
      `,
    })
    .where('email', '=', email)
    .executeTakeFirst()

  console.log('updated rows:', res.numUpdatedRows?.toString() ?? '0')
}
