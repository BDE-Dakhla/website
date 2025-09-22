import type { ColumnType } from 'kysely'

export type SubscriberStatus = 'pending' | 'active' | 'unsubscribed' | 'bounced'
export type TokenType = 'confirm'
export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'paused'
  | 'failed'
export type RecipientStatus =
  | 'pending'
  | 'sent'
  | 'failed'
  | 'bounced'
  | 'skipped'

export interface Subscribers {
  id: string
  email: string
  status: SubscriberStatus
  created_at: ColumnType<Date, Date | undefined, never>
  updated_at: ColumnType<Date, Date | undefined, never>
  unsubscribed_at: Date | null
}

export interface SubscriptionTokens {
  token: string
  subscriber_id: string
  type: TokenType
  expires_at: Date
  used_at: Date | null
}

export interface Campaigns {
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

export interface CampaignRecipients {
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

export interface DB {
  subscribers: Subscribers
  subscription_tokens: SubscriptionTokens
  campaigns: Campaigns
  campaign_recipients: CampaignRecipients
}
