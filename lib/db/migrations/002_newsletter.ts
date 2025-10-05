import { type Kysely } from 'kysely'

// Placeholder migration to mirror previously executed newsletter migration.
export async function up(_db: Kysely<any>): Promise<void> {}
export async function down(_db: Kysely<any>): Promise<void> {}

import type { Database } from '@/types/schema'
import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('subscribers')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('unsubscribed_at', 'timestamptz')
    .addCheckConstraint(
      'subscribers_status_check',
      sql`status in ('pending','active','unsubscribed','bounced')`,
    )
    .execute()

  await db.schema
    .createIndex('idx_subscribers_status')
    .ifNotExists()
    .on('subscribers')
    .column('status')
    .execute()

  // subscription_tokens
  await db.schema
    .createTable('subscription_tokens')
    .ifNotExists()
    .addColumn('token', 'text', (col) => col.primaryKey())
    .addColumn('subscriber_id', 'uuid', (col) =>
      col.references('subscribers.id').onDelete('cascade').notNull(),
    )
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('used_at', 'timestamptz')
    .addCheckConstraint(
      'subscription_tokens_type_check',
      sql`type in ('confirm')`,
    )
    .execute()

  await db.schema
    .createIndex('idx_sub_tokens_sub')
    .ifNotExists()
    .on('subscription_tokens')
    .column('subscriber_id')
    .execute()

  // campaigns
  await db.schema
    .createTable('campaigns')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('subject', 'text', (col) => col.notNull())
    .addColumn('from_name', 'text', (col) => col.notNull())
    .addColumn('from_email', 'text', (col) => col.notNull())
    .addColumn('html_body', 'text', (col) => col.notNull())
    .addColumn('text_body', 'text')
    .addColumn('status', 'text', (col) => col.notNull().defaultTo('draft'))
    .addColumn('scheduled_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addCheckConstraint(
      'campaigns_status_check',
      sql`status in ('draft','scheduled','sending','sent','paused','failed')`,
    )
    .execute()

  // campaign_recipients
  await db.schema
    .createTable('campaign_recipients')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('campaign_id', 'uuid', (col) =>
      col.references('campaigns.id').onDelete('cascade').notNull(),
    )
    .addColumn('subscriber_id', 'uuid', (col) =>
      col.references('subscribers.id').onDelete('cascade').notNull(),
    )
    .addColumn('tracking_id', 'uuid', (col) => col.notNull())
    .addColumn('status', 'text', (col) => col.notNull().defaultTo('pending'))
    .addColumn('sent_at', 'timestamptz')
    .addColumn('opened_at', 'timestamptz')
    .addColumn('click_count', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('last_error', 'text')
    .addCheckConstraint(
      'campaign_recipients_status_check',
      sql`status in ('pending','sent','failed','bounced','skipped')`,
    )
    .execute()

  await db.schema
    .createIndex('idx_recipients_unique')
    .ifNotExists()
    .on('campaign_recipients')
    .columns(['campaign_id', 'subscriber_id']) // or chain .column('campaign_id').column('subscriber_id')
    .unique()
    .execute()

  await db.schema
    .createIndex('idx_recipients_status')
    .ifNotExists()
    .on('campaign_recipients')
    .column('status')
    .execute()

  await db.schema
    .createIndex('idx_recipients_tracking')
    .ifNotExists()
    .on('campaign_recipients')
    .column('tracking_id')
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('campaign_recipients').ifExists().execute()
  await db.schema.dropTable('subscription_tokens').ifExists().execute()
  await db.schema.dropTable('campaigns').ifExists().execute()
  await db.schema.dropTable('subscribers').ifExists().execute()
}
