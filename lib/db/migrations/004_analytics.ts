import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`create extension if not exists pgcrypto`.execute(db)

  await db.schema
    .createTable('analytics_visitors')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('visitor_key', 'text', (col) => col.notNull().unique())
    .addColumn('user_agent', 'text')
    .addColumn('ip_hash', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  await db.schema
    .createTable('analytics_sessions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('visitor_id', 'uuid', (col) => col.notNull().references('analytics_visitors.id').onDelete('cascade'))
    .addColumn('user_id', 'uuid')
    .addColumn('started_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('last_activity_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('entry_path', 'text')
    .addColumn('entry_locale', 'text')
    .addColumn('referrer', 'text')
    .execute()

  await db.schema
    .createIndex('analytics_sessions_last_activity_idx')
    .on('analytics_sessions')
    .column('last_activity_at')
    .execute()

  await db.schema
    .createTable('analytics_events')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('session_id', 'uuid', (col) => col.notNull().references('analytics_sessions.id').onDelete('cascade'))
    .addColumn('happened_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('path', 'text', (col) => col.notNull())
    .addColumn('title', 'text')
    .execute()

  await db.schema
    .createIndex('analytics_events_type_time_idx')
    .on('analytics_events')
    .columns(['type', 'happened_at'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('analytics_events').ifExists().execute()
  await db.schema.dropIndex('analytics_sessions_last_activity_idx').ifExists().execute()
  await db.schema.dropTable('analytics_sessions').ifExists().execute()
  await db.schema.dropTable('analytics_visitors').ifExists().execute()
}