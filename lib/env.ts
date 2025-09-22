export function env(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback
  if (v === undefined) throw new Error(`Missing env: ${name}`)
  return v
}

export const APP_BASE_URL = () => env('APP_BASE_URL') // e.g. https://news.example.com
export const CRON_SECRET = () => env('CRON_SECRET')
export const SMTP_HOST = () => env('SMTP_HOST')
export const SMTP_PORT = () => Number(env('SMTP_PORT', '587'))
export const SMTP_SECURE = () => env('SMTP_SECURE', 'false') === 'true'
export const SMTP_USER = () => process.env.SMTP_USER || ''
export const SMTP_PASS = () => process.env.SMTP_PASS || ''
export const SMTP_FROM_EMAIL = () => env('SMTP_FROM_EMAIL')
export const SMTP_FROM_NAME = () => env('SMTP_FROM_NAME', 'Newsletter')
export const APP_HMAC_SECRET = () => env('APP_HMAC_SECRET') // for unsubscribe tokens
export const SEND_BATCH_SIZE = () => Number(env('SEND_BATCH_SIZE', '100'))
