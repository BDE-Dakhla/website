import { describe, expect, it } from 'vitest'
import { formatMoroccanPhone, phoneNumberSchema } from '@/lib/validation/phone'

describe('Phone Validation', () => {
  describe('phoneNumberSchema', () => {
    it('should accept valid Moroccan mobile numbers with +212', () => {
      expect(() => phoneNumberSchema.parse('+212 6 12 34 56 78')).not.toThrow()
      expect(() => phoneNumberSchema.parse('+212 7 12 34 56 78')).not.toThrow()
    })

    it('should accept valid Moroccan fixed numbers with +212', () => {
      expect(() => phoneNumberSchema.parse('+212 5 12 34 56 78')).not.toThrow()
    })

    it('should accept national format numbers', () => {
      expect(() => phoneNumberSchema.parse('0612345678')).not.toThrow()
      expect(() => phoneNumberSchema.parse('0712345678')).not.toThrow()
      expect(() => phoneNumberSchema.parse('0512345678')).not.toThrow()
    })

    it('should accept optional/empty phone numbers', () => {
      expect(() => phoneNumberSchema.parse(undefined)).not.toThrow()
      expect(() => phoneNumberSchema.parse('')).not.toThrow()
    })

    it('should reject invalid phone numbers', () => {
      expect(() => phoneNumberSchema.parse('123456')).toThrow()
      expect(() => phoneNumberSchema.parse('+1234567890')).toThrow()
      expect(() => phoneNumberSchema.parse('0912345678')).toThrow() // Invalid prefix
    })

    it('should handle numbers with spaces and formatting', () => {
      expect(() => phoneNumberSchema.parse('+212 612 345 678')).not.toThrow()
      expect(() => phoneNumberSchema.parse('+212-6-12-34-56-78')).not.toThrow()
      expect(() => phoneNumberSchema.parse('(+212) 612345678')).not.toThrow()
    })
  })

  describe('formatMoroccanPhone', () => {
    it('should format valid numbers correctly', () => {
      expect(formatMoroccanPhone('0612345678')).toBe('+212 6 12 345 678')
      expect(formatMoroccanPhone('+212612345678')).toBe('+212 6 12 345 678')
      expect(formatMoroccanPhone('212612345678')).toBe('+212 6 12 345 678')
    })

    it('should handle various input formats', () => {
      expect(formatMoroccanPhone('+212 6 12 34 56 78')).toBe(
        '+212 6 12 345 678',
      )
      expect(formatMoroccanPhone('+212-612-345-678')).toBe('+212 6 12 345 678')
      expect(formatMoroccanPhone('(+212) 612345678')).toBe('+212 6 12 345 678')
    })

    it('should return null for invalid numbers', () => {
      expect(formatMoroccanPhone('123')).toBeNull()
      expect(formatMoroccanPhone('invalid')).toBeNull()
      expect(formatMoroccanPhone('+1234567890')).toBeNull()
    })

    it('should return null for empty input', () => {
      expect(formatMoroccanPhone('')).toBeNull()
    })

    it('should format fixed line numbers', () => {
      expect(formatMoroccanPhone('0512345678')).toBe('+212 5 12 345 678')
    })
  })
})
