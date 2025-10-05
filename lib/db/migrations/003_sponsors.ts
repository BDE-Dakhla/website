import { type Kysely } from 'kysely'

// Placeholder for previously executed sponsors migration
export async function up(_db: Kysely<any>): Promise<void> {}
export async function down(_db: Kysely<any>): Promise<void> {}

import type { Database } from '@/types/schema'
import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable('sponsors')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .addColumn('logo_url', 'text', (col) => col.notNull())
    .addColumn('website_url', 'text')
    .addColumn('description', 'text')
    .addColumn('approved', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('approved_at', 'timestamptz')
    .addColumn('approved_by', 'uuid', (col) =>
      col.references('User.id').onDelete('set null'),
    )
    .addColumn('is_featured', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .addColumn('priority', 'integer', (col) => col.notNull().defaultTo(100))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addCheckConstraint('sponsors_priority_check', sql`priority >= 0`)
    .execute()

  // Auto-update updated_at on UPDATE
  await sql`
    create or replace function set_updated_at()
    returns trigger as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$ language plpgsql;
  `.execute(db)

  await sql`
    drop trigger if exists sponsors_set_updated_at on sponsors;
    create trigger sponsors_set_updated_at
    before update on sponsors
    for each row execute function set_updated_at();
  `.execute(db)

  // Fast homepage list: approved only, ordered by priority asc then newest
  await sql`
    create index if not exists idx_sponsors_home
    on sponsors (priority asc, created_at desc)
    where approved = true;
  `.execute(db)

  await db.schema
    .createIndex('idx_sponsors_featured')
    .ifNotExists()
    .on('sponsors')
    .column('is_featured')
    .execute()
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable('sponsors').ifExists().execute()
}
