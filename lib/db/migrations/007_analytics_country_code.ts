import type { Kysely } from 'kysely'
import type { Database } from '@/types/schema'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable('analytics_sessions')
    .addColumn('country_code', 'text')
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable('analytics_sessions')
    .dropColumn('country_code')
    .execute()
}
