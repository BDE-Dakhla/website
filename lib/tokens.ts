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
  const sigBuf = Buffer.from(sig)
  const hBuf = Buffer.from(h)
  if (sigBuf.length !== hBuf.length) return null
  if (crypto.timingSafeEqual(hBuf, sigBuf)) return id
  return null
}
