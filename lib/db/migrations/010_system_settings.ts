import type { Database } from '@/types/schema'
import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('system_settings')
    .addColumn('key', 'text', (col) => col.primaryKey())
    .addColumn('value', 'jsonb', (col) => col.notNull())
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_by', 'uuid', (col) =>
      col.references('User.id').onDelete('set null'),
    )
    .execute()

  await db
    .insertInto('system_settings')
    .values({
      key: 'maintenance_mode',
      value: sql`'{"enabled": false}'::jsonb`,
    })
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('system_settings').execute()
}
