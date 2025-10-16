import { describe, expect, it } from 'vitest'
import {
  detectFromVisitor,
  parseSecChUaBrands,
  parseUserAgent,
} from '@/lib/analytics/ua'

describe('Analytics User Agent Parser', () => {
  describe('parseSecChUaBrands', () => {
    it('should parse valid Sec-CH-UA header', () => {
      const header =
        '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"'
      const result = parseSecChUaBrands(header)

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ brand: 'Chromium', version: '122' })
      expect(result[2]).toEqual({ brand: 'Google Chrome', version: '122' })
    })

    it('should handle empty header', () => {
      expect(parseSecChUaBrands(null)).toEqual([])
      expect(parseSecChUaBrands(undefined)).toEqual([])
      expect(parseSecChUaBrands('')).toEqual([])
    })

    it('should parse Edge UA-CH header', () => {
      const header =
        '"Microsoft Edge";v="120", "Chromium";v="120", "Not=A?Brand";v="99"'
      const result = parseSecChUaBrands(header)

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ brand: 'Microsoft Edge', version: '120' })
    })
  })

  describe('parseUserAgent - Browser Detection', () => {
    it('should detect Chrome', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Chrome')
    })

    it('should detect Firefox', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Firefox')
    })

    it('should detect Safari', () => {
      const ua =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Safari')
    })

    it('should detect Edge (Chromium)', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Edge (Chromium)')
    })

    it('should detect Opera', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Opera')
    })

    it('should detect Chrome iOS', () => {
      const ua =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Chrome (iOS)')
    })

    it('should detect Firefox iOS', () => {
      const ua =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/122.0 Mobile/15E148 Safari/605.1.15'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Firefox (iOS)')
    })

    it('should prefer UA-CH brand over user agent string', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      const result = parseUserAgent(ua, {
        ua_brands: [
          { brand: 'Not A;Brand', version: '99' },
          { brand: 'Microsoft Edge', version: '122' },
        ],
      })
      expect(result.browser).toBe('Microsoft Edge')
    })
  })

  describe('parseUserAgent - OS Detection', () => {
    it('should detect Windows 10/11', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      const result = parseUserAgent(ua)
      expect(result.os).toBe('Windows 10/11')
    })

    it('should detect Windows 7', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36'
      const result = parseUserAgent(ua)
      expect(result.os).toBe('Windows 7')
    })

    it('should detect macOS', () => {
      const ua =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15'
      const result = parseUserAgent(ua)
      expect(result.os).toBe('macOS')
    })

    it('should detect iOS', () => {
      const ua =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15'
      const result = parseUserAgent(ua)
      expect(result.os).toBe('macOS')
    })

    it('should detect Android', () => {
      const ua =
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36'
      const result = parseUserAgent(ua)
      expect(result.os).toBe('Android')
    })

    it('should detect Linux', () => {
      const ua =
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      const result = parseUserAgent(ua)
      expect(result.os).toBe('Linux')
    })

    it('should detect ChromeOS', () => {
      const ua =
        'Mozilla/5.0 (X11; CrOS x86_64 15236.80.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.125 Safari/537.36'
      const result = parseUserAgent(ua)
      expect(result.os).toBe('ChromeOS')
    })

    it('should prefer UA-CH platform over user agent string', () => {
      const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      const result = parseUserAgent(ua, { ua_platform: 'Windows' })
      expect(result.os).toBe('Windows')
    })
  })

  describe('parseUserAgent - Device Detection', () => {
    it('should detect Desktop by default', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      const result = parseUserAgent(ua)
      expect(result.device).toBe('Desktop')
    })

    it('should detect Mobile from user agent', () => {
      const ua =
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Mobile Safari/537.36'
      const result = parseUserAgent(ua)
      expect(result.device).toBe('Mobile')
    })

    it('should detect Mobile from iPhone', () => {
      const ua =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15'
      const result = parseUserAgent(ua)
      expect(result.device).toBe('Mobile')
    })

    it('should detect Tablet from iPad', () => {
      const ua =
        'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15'
      const result = parseUserAgent(ua)
      expect(result.device).toBe('Tablet')
    })

    it('should prefer UA-CH mobile flag', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      const result = parseUserAgent(ua, { ua_mobile: true })
      expect(result.device).toBe('Mobile')
    })

    it('should handle UA-CH mobile false', () => {
      const ua =
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Mobile Safari/537.36'
      const result = parseUserAgent(ua, { ua_mobile: false })
      expect(result.device).toBe('Mobile')
    })
  })

  describe('parseUserAgent - Edge Cases', () => {
    it('should handle null user agent', () => {
      const result = parseUserAgent(null)
      expect(result.browser).toBe('Other')
      expect(result.os).toBe('Unknown')
      expect(result.device).toBe('Desktop')
    })

    it('should handle undefined user agent', () => {
      const result = parseUserAgent(undefined)
      expect(result.browser).toBe('Other')
      expect(result.os).toBe('Unknown')
      expect(result.device).toBe('Desktop')
    })

    it('should handle empty user agent', () => {
      const result = parseUserAgent('')
      expect(result.browser).toBe('Other')
      expect(result.os).toBe('Unknown')
      expect(result.device).toBe('Desktop')
    })
  })

  describe('detectFromVisitor', () => {
    it('should parse visitor with full data', () => {
      const visitor = {
        user_agent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        ua_brands: [
          { brand: 'Chromium', version: '122' },
          { brand: 'Google Chrome', version: '122' },
        ],
        ua_platform: 'Windows',
        ua_mobile: false,
      }

      const result = detectFromVisitor(visitor)
      expect(result.browser).toBe('Google Chrome')
      expect(result.os).toBe('Windows')
      expect(result.device).toBe('Desktop')
    })

    it('should handle visitor with minimal data', () => {
      const visitor = {
        user_agent: null,
        ua_brands: undefined,
        ua_platform: null,
        ua_mobile: null,
      }

      const result = detectFromVisitor(visitor)
      expect(result.browser).toBe('Other')
      expect(result.os).toBe('Unknown')
      expect(result.device).toBe('Desktop')
    })

    it('should handle visitor with invalid ua_brands', () => {
      const visitor = {
        user_agent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
        ua_brands: 'invalid' as unknown,
        ua_platform: 'macOS',
        ua_mobile: false,
      }

      const result = detectFromVisitor(visitor)
      expect(result.os).toBe('macOS')
      expect(result.device).toBe('Desktop')
    })
  })
})
