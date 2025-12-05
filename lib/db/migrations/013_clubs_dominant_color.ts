import type { Kysely } from 'kysely'
import type { Database } from '@/types/schema'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable('clubs')
    .addColumn('dominant_color', 'text')
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.alterTable('clubs').dropColumn('dominant_color').execute()
}
