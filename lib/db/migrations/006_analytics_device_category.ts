import type { Kysely } from 'kysely'
import type { Database } from '@/types/schema'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable('analytics_visitors')
    .addColumn('device_category', 'text')
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable('analytics_visitors')
    .dropColumn('device_category')
    .execute()
}
