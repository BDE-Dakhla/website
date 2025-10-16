import type { SubscriberStatus } from '@/types/schema'

export const mockSubscribers = {
  active: {
    id: 'sub-active-123',
    email: 'active@example.com',
    status: 'active' as SubscriberStatus,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    unsubscribed_at: null,
  },
  pending: {
    id: 'sub-pending-123',
    email: 'pending@example.com',
    status: 'pending' as SubscriberStatus,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    unsubscribed_at: null,
  },
  unsubscribed: {
    id: 'sub-unsub-123',
    email: 'unsubscribed@example.com',
    status: 'unsubscribed' as SubscriberStatus,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-10'),
    unsubscribed_at: new Date('2024-01-10'),
  },
  bounced: {
    id: 'sub-bounced-123',
    email: 'bounced@example.com',
    status: 'bounced' as SubscriberStatus,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-05'),
    unsubscribed_at: null,
  },
}

export const mockCampaigns = {
  draft: {
    id: 'campaign-draft-123',
    subject: 'Test Draft Campaign',
    from_name: 'BDE Dakhla',
    from_email: 'noreply@test.com',
    html_body: '<p>Hello!</p>',
    text_body: 'Hello!',
    status: 'draft' as const,
    scheduled_at: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  sent: {
    id: 'campaign-sent-123',
    subject: 'Test Sent Campaign',
    from_name: 'BDE Dakhla',
    from_email: 'noreply@test.com',
    html_body: '<p>Hello!</p>',
    text_body: 'Hello!',
    status: 'sent' as const,
    scheduled_at: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-02'),
  },
}
