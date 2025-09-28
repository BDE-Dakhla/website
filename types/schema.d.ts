import type { Database as AuthDb } from '@auth/kysely-adapter'
import type { ColumnType } from 'kysely'

export enum Permission {
  HAS_ACCESS_TO_DASHBOARD = 0,
  HAS_ACCESS_TO_SYLLABUS = 0,
}

interface AppDatabase {
  Subscribers: Subscribers
  SubscriptionTokens: SubscriptionTokens
  Campaigns: Campaigns
  CampaignRecipients: CampaignRecipients
}

interface UserExtra {
  cdm: string
  first_name: string
  last_name: string
  identity: 'student' | 'professor'
  permissions: Permission[]
  password: string
}

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
