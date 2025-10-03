import type { Database as AuthDb } from '@auth/kysely-adapter'
import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely'
import z from 'zod'

interface AppDatabase {
  Subscribers: Subscribers
  SubscriptionTokens: SubscriptionTokens
  Campaigns: Campaigns
  CampaignRecipients: CampaignRecipients
  sponsors: SponsorTable
}

interface UserExtra {
  cdm: string | null
  username: string | null
  role: Role | null
  permissions: PermissionMap | null
  password: string | null
}

export const userRoleSchema = z.union([
  z.literal('developer'),
  z.literal('teacher'),
  z.literal('student'),
  z.literal('contributor'),
  z.literal('administrator'),
])

export type Role = z.infer<typeof userRoleSchema>

export type PermissionValue = 0 | 1
export type PermissionMap = Record<string, PermissionValue>

export type Database = Omit<AuthDb, 'User'> & {
  User: AuthDb['User'] & UserExtra
} & AppDatabase

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

interface SponsorTable {
  id: Generated<string>

  name: string
  slug: string

  description: string | null
  website_url: string | null
  logo_url: string

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
