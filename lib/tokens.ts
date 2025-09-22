import crypto from 'node:crypto'
import { APP_HMAC_SECRET } from './env'

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url')
}

export function makeUnsubToken(subscriberId: string, email: string) {
  const data = `${subscriberId}:${email.toLowerCase()}`
  const h = crypto
    .createHmac('sha256', APP_HMAC_SECRET())
    .update(data)
    .digest('base64url')
  return `${subscriberId}.${h}`
}

export function verifyUnsubToken(token: string, email: string) {
  const [id, sig] = token.split('.', 2)
  if (!id || !sig) return null
  const data = `${id}:${email.toLowerCase()}`
  const h = crypto
    .createHmac('sha256', APP_HMAC_SECRET())
    .update(data)
    .digest('base64url')
  if (crypto.timingSafeEqual(Buffer.from(h), Buffer.from(sig))) return id
  return null
}
