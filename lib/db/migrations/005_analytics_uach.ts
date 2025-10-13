import type { Kysely } from 'kysely'
import type { Database } from '@/types/schema'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable('analytics_visitors')
    .addColumn('ua_brands', 'jsonb')
    .addColumn('ua_platform', 'text')
    .addColumn('ua_mobile', 'boolean')
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable('analytics_visitors')
    .dropColumn('ua_brands')
    .dropColumn('ua_platform')
    .dropColumn('ua_mobile')
    .execute()
}
