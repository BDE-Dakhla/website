import type { Database } from '@/types/schema'
import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<Database>): Promise<void> {
  // Add created_at and updated_at to the User table
  await db.schema
    .alterTable('User')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute()

  // Ensure we have a helper to auto-update updated_at on UPDATE
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
    drop trigger if exists user_set_updated_at on "User";
    create trigger user_set_updated_at
    before update on "User"
    for each row execute function set_updated_at();
  `.execute(db)
}

export async function down(db: Kysely<Database>): Promise<void> {
  await sql`drop trigger if exists user_set_updated_at on "User";`.execute(db)
  await db.schema
    .alterTable('User')
    .dropColumn('updated_at')
    .dropColumn('created_at')
    .execute()
}
