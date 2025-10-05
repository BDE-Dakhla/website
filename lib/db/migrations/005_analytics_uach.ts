import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('analytics_visitors')
    .addColumn('ua_brands', 'jsonb')
    .addColumn('ua_platform', 'text')
    .addColumn('ua_mobile', 'boolean')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('analytics_visitors')
    .dropColumn('ua_brands')
    .dropColumn('ua_platform')
    .dropColumn('ua_mobile')
    .execute()
}