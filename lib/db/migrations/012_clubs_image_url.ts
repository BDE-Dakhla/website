import type { Kysely } from 'kysely'
import type { Database } from '@/types/schema'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.alterTable('clubs').addColumn('imageUrl', 'text').execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.alterTable('clubs').dropColumn('imageUrl').execute()
}
