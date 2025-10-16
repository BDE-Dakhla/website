import { describe, it, expect, beforeEach } from 'vitest'
import { randomToken, makeUnsubToken, verifyUnsubToken } from '@/lib/tokens'

describe('Token Utilities', () => {
  describe('randomToken', () => {
    it('should generate a random token with default 32 bytes', () => {
      const token = randomToken()
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('should generate tokens of different lengths', () => {
      const token16 = randomToken(16)
      const token64 = randomToken(64)
      
      expect(token16.length).toBeLessThan(token64.length)
    })

    it('should generate unique tokens', () => {
      const token1 = randomToken()
      const token2 = randomToken()
      
      expect(token1).not.toBe(token2)
    })
  })

  describe('makeUnsubToken and verifyUnsubToken', () => {
    const subscriberId = 'sub-123'
    const email = 'test@example.com'

    it('should create a valid unsubscribe token', () => {
      const token = makeUnsubToken(subscriberId, email)
      
      expect(token).toBeTruthy()
      expect(token).toContain('.')
      expect(token.split('.')[0]).toBe(subscriberId)
    })

    it('should verify a valid token', () => {
      const token = makeUnsubToken(subscriberId, email)
      const verified = verifyUnsubToken(token, email)
      
      expect(verified).toBe(subscriberId)
    })

    it('should handle email case insensitivity', () => {
      const token = makeUnsubToken(subscriberId, 'TEST@EXAMPLE.COM')
      const verified = verifyUnsubToken(token, 'test@example.com')
      
      expect(verified).toBe(subscriberId)
    })

    it('should reject token with wrong email', () => {
      const token = makeUnsubToken(subscriberId, email)
      const verified = verifyUnsubToken(token, 'wrong@example.com')
      
      expect(verified).toBeNull()
    })

    it('should reject malformed token', () => {
      const verified = verifyUnsubToken('invalid-token', email)
      expect(verified).toBeNull()
    })

    it('should reject token with tampered signature', () => {
      const token = makeUnsubToken(subscriberId, email)
      const tamperedToken = token.slice(0, -5) + 'xxxxx'
      const verified = verifyUnsubToken(tamperedToken, email)
      
      expect(verified).toBeNull()
    })

    it('should reject token with missing parts', () => {
      const verified1 = verifyUnsubToken('only-id', email)
      const verified2 = verifyUnsubToken('', email)
      
      expect(verified1).toBeNull()
      expect(verified2).toBeNull()
    })
  })
})
