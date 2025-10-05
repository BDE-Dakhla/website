import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('analytics_visitors').addColumn('device_category', 'text').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('analytics_visitors').dropColumn('device_category').execute()
}