
-- no custom types; use check constraints for portability
CREATE TABLE IF NOT EXISTS subscribers (
id uuid PRIMARY KEY,
email text UNIQUE NOT NULL,
status text NOT NULL CHECK (status IN ('pending','active','unsubscribed','bounced')),
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now(),
unsubscribed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);

CREATE TABLE IF NOT EXISTS subscription_tokens (
token text PRIMARY KEY,
subscriber_id uuid NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
type text NOT NULL CHECK (type IN ('confirm')),
expires_at timestamptz NOT NULL,
used_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_sub_tokens_sub ON subscription_tokens(subscriber_id);

CREATE TABLE IF NOT EXISTS campaigns (
id uuid PRIMARY KEY,
subject text NOT NULL,
from_name text NOT NULL,
from_email text NOT NULL,
html_body text NOT NULL,
text_body text,
status text NOT NULL CHECK (status IN ('draft','scheduled','sending','sent','paused','failed')) DEFAULT 'draft',
scheduled_at timestamptz,
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaign_recipients (
id uuid PRIMARY KEY,
campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
subscriber_id uuid NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
tracking_id uuid NOT NULL,
status text NOT NULL CHECK (status IN ('pending','sent','failed','bounced','skipped')) DEFAULT 'pending',
sent_at timestamptz,
opened_at timestamptz,
click_count integer NOT NULL DEFAULT 0,
last_error text
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_recipients_unique ON campaign_recipients(campaign_id, subscriber_id);
CREATE INDEX IF NOT EXISTS idx_recipients_status ON campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_recipients_tracking ON campaign_recipients(tracking_id);