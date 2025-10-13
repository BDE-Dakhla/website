import type { Kysely } from 'kysely'
import type { Database } from '@/types/schema'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable('analytics_events')
    .addColumn('event_name', 'text')
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable('analytics_events')
    .dropColumn('event_name')
    .execute()
}
