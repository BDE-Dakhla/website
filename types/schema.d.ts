import type { Database as AuthDb } from '@auth/kysely-adapter'
import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely'

// Keep permissions definition in a single place (prefer your lib/permissions file)
type PermissionMask = number

interface AppDatabase {
  Subscribers: Subscribers
  SubscriptionTokens: SubscriptionTokens
  Campaigns: Campaigns
  CampaignRecipients: CampaignRecipients
  sponsors: SponsorTable // <-- add this
}

interface UserExtra {
  cdm: string | null
  first_name: string | null
  last_name: string | null
  // remove if you don't have this column in your migration
  // identity: 'student' | 'professor' | null
  permissions: PermissionMask
  password: string | null
}

export type Database = Omit<AuthDb, 'User'> & {
  User: AuthDb['User'] & UserExtra
} & AppDatabase

// ----- newsletter tables (unchanged) -----
export type SubscriberStatus = 'pending' | 'active' | 'unsubscribed' | 'bounced'
export type TokenType = 'confirm'
export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'paused'
  | 'failed'
type RecipientStatus = 'pending' | 'sent' | 'failed' | 'bounced' | 'skipped'

interface Subscribers {
  id: string
  email: string
  status: SubscriberStatus
  created_at: ColumnType<Date, Date | undefined, never>
  updated_at: ColumnType<Date, Date | undefined, never>
  unsubscribed_at: Date | null
}

interface SubscriptionTokens {
  token: string
  subscriber_id: string
  type: TokenType
  expires_at: Date
  used_at: Date | null
}

interface Campaigns {
  id: string
  subject: string
  from_name: string
  from_email: string
  html_body: string
  text_body: string | null
  status: CampaignStatus
  scheduled_at: Date | null
  created_at: ColumnType<Date, Date | undefined, never>
  updated_at: ColumnType<Date, Date | undefined, never>
}

interface CampaignRecipients {
  id: string
  campaign_id: string
  subscriber_id: string
  tracking_id: string
  status: RecipientStatus
  sent_at: Date | null
  opened_at: Date | null
  click_count: number
  last_error: string | null
}

// ----- sponsors -----
interface SponsorTable {
  // uuid default gen_random_uuid()
  id: Generated<string>

  name: string
  slug: string

  description: string | null
  website_url: string | null
  logo_url: string

  // defaults in DB -> allow omitting on insert
  priority: ColumnType<number, number | undefined, number> // default 100
  is_featured: ColumnType<boolean, boolean | undefined, boolean> // default false
  approved: ColumnType<boolean, boolean | undefined, boolean> // default false

  created_at: ColumnType<Date, Date | undefined, never> // default now()
  updated_at: ColumnType<Date, Date | undefined, never> // default now() + trigger

  approved_at: ColumnType<Date | null, Date | undefined, Date | null>
  approved_by: string | null // uuid FK to "User".id, nullable
}

export type Sponsor = Selectable<SponsorTable>
export type NewSponsor = Insertable<SponsorTable>
export type SponsorUpdate = Updateable<SponsorTable>
