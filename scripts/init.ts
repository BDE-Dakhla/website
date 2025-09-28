import type { Database } from '@/types/schema'
import { type Kysely, sql } from 'kysely'

export async function up_newsletter(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('Subscribers')
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
    .createTable('SubscriptionTokens')
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
    .createTable('Campaigns')
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
    .createTable('CampaignRecipients')
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

export async function up(db: Kysely<Database>): Promise<void> {
  /** User */
  await db.schema
    .createTable('User')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('name', 'text')
    .addColumn('email', 'text', (col) => col.unique().notNull())
    .addColumn('emailVerified', 'timestamptz')
    .addColumn('image', 'text')
    .addColumn('cdm', 'text')
    .addColumn('first_name', 'text')
    .addColumn('last_name', 'text')
    .addColumn('password', 'text')
    .execute()

  // unique on cdm (Postgres allows multiple NULLs; fine for OAuth users without cdm)
  await db.schema
    .createIndex('User_cdm_unique')
    .on('User')
    .column('cdm')
    .unique()
    .execute()

  /** Account */
  await db.schema
    .createTable('Account')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('userId', 'uuid', (col) =>
      col.references('User.id').onDelete('cascade').notNull(),
    )
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('providerAccountId', 'text', (col) => col.notNull())
    .addColumn('refresh_token', 'text')
    .addColumn('access_token', 'text')
    .addColumn('expires_at', 'bigint')
    .addColumn('token_type', 'text')
    .addColumn('scope', 'text')
    .addColumn('id_token', 'text')
    .addColumn('session_state', 'text')
    .execute()

  // composite unique for provider + providerAccountId
  await db.schema
    .createIndex('Account_provider_providerAccountId_key')
    .on('Account')
    .column('provider')
    .column('providerAccountId')
    .unique()
    .execute()

  /** Session */

  await db.schema
    .createTable('Session')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('userId', 'uuid', (col) =>
      col.references('User.id').onDelete('cascade').notNull(),
    )
    .addColumn('sessionToken', 'text', (col) => col.notNull().unique())
    .addColumn('expires', 'timestamptz', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('VerificationToken')
    .addColumn('identifier', 'text', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.notNull().unique())
    .addColumn('expires', 'timestamptz', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('Account_userId_index')
    .on('Account')
    .column('userId')
    .execute()

  await db.schema
    .createIndex('Session_userId_index')
    .on('Session')
    .column('userId')
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('Account').ifExists().execute()
  await db.schema.dropTable('Session').ifExists().execute()
  await db.schema.dropTable('User').ifExists().execute()
  await db.schema.dropTable('VerificationToken').ifExists().execute()
  await db.schema.dropTable('Subscribers').ifExists().execute()
  await db.schema.dropTable('SubscriptionTokens').ifExists().execute()
  await db.schema.dropTable('Campaigns').ifExists().execute()
  await db.schema.dropTable('CampaignRecipients').ifExists().execute()
}
