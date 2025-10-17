import { describe, expect, it } from 'vitest'
import { isValidEventType, parseCollectBody } from '@/app/api/analytics/types'

describe('Analytics API Types', () => {
  describe('isValidEventType', () => {
    it('should validate correct event types', () => {
      expect(isValidEventType('pageview')).toBe(true)
      expect(isValidEventType('heartbeat')).toBe(true)
      expect(isValidEventType('event')).toBe(true)
    })

    it('should reject invalid event types', () => {
      expect(isValidEventType('click')).toBe(false)
      expect(isValidEventType('invalid')).toBe(false)
      expect(isValidEventType('')).toBe(false)
      expect(isValidEventType(null)).toBe(false)
      expect(isValidEventType(undefined)).toBe(false)
      expect(isValidEventType(123)).toBe(false)
    })
  })

  describe('parseCollectBody', () => {
    it('should parse valid pageview body', () => {
      const body = {
        type: 'pageview',
        path: '/home',
        title: 'Home Page',
        referrer: 'https://google.com',
        locale: 'en',
      }
      const result = parseCollectBody(body)

      expect(result).toEqual({
        type: 'pageview',
        path: '/home',
        title: 'Home Page',
        referrer: 'https://google.com',
        locale: 'en',
      })
    })

    it('should parse valid heartbeat body', () => {
      const body = {
        type: 'heartbeat',
        path: '/dashboard',
      }
      const result = parseCollectBody(body)

      expect(result).toEqual({
        type: 'heartbeat',
        path: '/dashboard',
      })
    })

    it('should parse valid event body', () => {
      const body = {
        type: 'event',
        path: '/contact',
        event: 'form_submit',
      }
      const result = parseCollectBody(body)

      expect(result).toEqual({
        type: 'event',
        path: '/contact',
        event: 'form_submit',
      })
    })

    it('should parse body with ua_ch data', () => {
      const body = {
        type: 'pageview',
        path: '/about',
        ua_ch: {
          brands: [
            { brand: 'Chrome', version: '122' },
            { brand: 'Chromium', version: '122' },
          ],
          platform: 'Windows',
          mobile: false,
        },
      }
      const result = parseCollectBody(body)

      expect(result).toEqual({
        type: 'pageview',
        path: '/about',
        ua_ch: {
          brands: [
            { brand: 'Chrome', version: '122' },
            { brand: 'Chromium', version: '122' },
          ],
          platform: 'Windows',
          mobile: false,
        },
      })
    })

    it('should handle optional fields', () => {
      const body = {
        type: 'pageview',
        path: '/page',
      }
      const result = parseCollectBody(body)

      expect(result).toEqual({
        type: 'pageview',
        path: '/page',
      })
      expect(result?.title).toBeUndefined()
      expect(result?.referrer).toBeUndefined()
    })

    it('should return null for missing type', () => {
      const body = {
        path: '/home',
      }
      const result = parseCollectBody(body)
      expect(result).toBeNull()
    })

    it('should return null for invalid type', () => {
      const body = {
        type: 'invalid',
        path: '/home',
      }
      const result = parseCollectBody(body)
      expect(result).toBeNull()
    })

    it('should return null for missing path', () => {
      const body = {
        type: 'pageview',
      }
      const result = parseCollectBody(body)
      expect(result).toBeNull()
    })

    it('should return null for non-string path', () => {
      const body = {
        type: 'pageview',
        path: 123,
      }
      const result = parseCollectBody(body)
      expect(result).toBeNull()
    })

    it('should return null for null body', () => {
      expect(parseCollectBody(null)).toBeNull()
    })

    it('should return null for undefined body', () => {
      expect(parseCollectBody(undefined)).toBeNull()
    })

    it('should return null for non-object body', () => {
      expect(parseCollectBody('string')).toBeNull()
      expect(parseCollectBody(123)).toBeNull()
      expect(parseCollectBody(true)).toBeNull()
    })

    it('should ignore non-string optional fields', () => {
      const body = {
        type: 'pageview',
        path: '/home',
        title: 123,
        referrer: true,
        locale: {},
        event: [],
      }
      const result = parseCollectBody(body)

      expect(result).toEqual({
        type: 'pageview',
        path: '/home',
      })
    })

    it('should handle partial ua_ch data', () => {
      const body1 = {
        type: 'pageview',
        path: '/test',
        ua_ch: { platform: 'macOS' },
      }
      const result1 = parseCollectBody(body1)
      expect(result1?.ua_ch).toEqual({ platform: 'macOS' })

      const body2 = {
        type: 'pageview',
        path: '/test',
        ua_ch: { mobile: true },
      }
      const result2 = parseCollectBody(body2)
      expect(result2?.ua_ch).toEqual({ mobile: true })
    })

    it('should ignore invalid ua_ch brands', () => {
      const body = {
        type: 'pageview',
        path: '/test',
        ua_ch: {
          brands: 'not an array',
          platform: 'Linux',
        },
      }
      const result = parseCollectBody(body)
      expect(result?.ua_ch).toEqual({ platform: 'Linux' })
    })

    it('should ignore invalid ua_ch platform', () => {
      const body = {
        type: 'pageview',
        path: '/test',
        ua_ch: {
          platform: 123,
          mobile: false,
        },
      }
      const result = parseCollectBody(body)
      expect(result?.ua_ch).toEqual({ mobile: false })
    })

    it('should ignore invalid ua_ch mobile', () => {
      const body = {
        type: 'pageview',
        path: '/test',
        ua_ch: {
          mobile: 'yes',
        },
      }
      const result = parseCollectBody(body)
      expect(result?.ua_ch).toEqual({})
    })

    it('should ignore non-object ua_ch', () => {
      const body = {
        type: 'pageview',
        path: '/test',
        ua_ch: 'string',
      }
      const result = parseCollectBody(body)
      expect(result?.ua_ch).toBeUndefined()
    })
  })
})
