import { describe, expect, it } from 'vitest'
import { generateWelcomeEmail } from '@/lib/email-templates'

describe('Email Templates', () => {
  describe('generateWelcomeEmail', () => {
    const testEmail = 'test@example.com'
    const testUnsubscribeUrl = 'https://example.com/unsubscribe?token=abc123'

    it('should generate welcome email with html and text', () => {
      const result = generateWelcomeEmail({
        email: testEmail,
        unsubscribeUrl: testUnsubscribeUrl,
      })

      expect(result).toHaveProperty('html')
      expect(result).toHaveProperty('text')
      expect(typeof result.html).toBe('string')
      expect(typeof result.text).toBe('string')
    })

    it('should include email address in content', () => {
      const result = generateWelcomeEmail({
        email: testEmail,
        unsubscribeUrl: testUnsubscribeUrl,
      })

      expect(result.html).toContain(testEmail)
      expect(result.text).toContain(testEmail)
    })

    it('should include unsubscribe URL', () => {
      const result = generateWelcomeEmail({
        email: testEmail,
        unsubscribeUrl: testUnsubscribeUrl,
      })

      expect(result.html).toContain(testUnsubscribeUrl)
      expect(result.text).toContain(testUnsubscribeUrl)
    })

    it('should have non-empty html content', () => {
      const result = generateWelcomeEmail({
        email: testEmail,
        unsubscribeUrl: testUnsubscribeUrl,
      })

      expect(result.html.length).toBeGreaterThan(100)
      expect(result.text.length).toBeGreaterThan(50)
    })

    it('should contain welcome message', () => {
      const result = generateWelcomeEmail({
        email: testEmail,
        unsubscribeUrl: testUnsubscribeUrl,
      })

      const hasWelcomeText =
        result.html.toLowerCase().includes('bienvenue') ||
        result.html.toLowerCase().includes('welcome')

      expect(hasWelcomeText).toBe(true)
    })
  })
})
