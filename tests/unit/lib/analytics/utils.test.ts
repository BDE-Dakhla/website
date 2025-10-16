import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  assertNumber,
  assertString,
  isValidTimeRange,
  previousWindow,
  resolveWindow,
} from '@/lib/analytics/utils'

describe('Analytics Utils', () => {
  describe('resolveWindow', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should resolve 3h time range', () => {
      const result = resolveWindow('3h')
      const duration = result.end.getTime() - result.start.getTime()
      expect(duration).toBe(3 * 3600 * 1000)
    })

    it('should resolve 6h time range', () => {
      const result = resolveWindow('6h')
      const duration = result.end.getTime() - result.start.getTime()
      expect(duration).toBe(6 * 3600 * 1000)
    })

    it('should resolve 12h time range', () => {
      const result = resolveWindow('12h')
      const duration = result.end.getTime() - result.start.getTime()
      expect(duration).toBe(12 * 3600 * 1000)
    })

    it('should resolve 24h time range', () => {
      const result = resolveWindow('24h')
      const duration = result.end.getTime() - result.start.getTime()
      expect(duration).toBe(24 * 3600 * 1000)
    })

    it('should resolve 7d time range', () => {
      const result = resolveWindow('7d')
      const duration = result.end.getTime() - result.start.getTime()
      expect(duration).toBe(7 * 24 * 3600 * 1000)
    })

    it('should resolve 30d time range', () => {
      const result = resolveWindow('30d')
      const duration = result.end.getTime() - result.start.getTime()
      expect(duration).toBe(30 * 24 * 3600 * 1000)
    })

    it('should resolve 90d time range', () => {
      const result = resolveWindow('90d')
      const duration = result.end.getTime() - result.start.getTime()
      expect(duration).toBe(90 * 24 * 3600 * 1000)
    })

    it('should resolve 6mo time range', () => {
      const result = resolveWindow('6mo')
      const duration = result.end.getTime() - result.start.getTime()
      expect(duration).toBe(182 * 24 * 3600 * 1000)
    })

    it('should resolve 1y time range', () => {
      const result = resolveWindow('1y')
      const duration = result.end.getTime() - result.start.getTime()
      expect(duration).toBe(365 * 24 * 3600 * 1000)
    })

    it('should default to 24h for invalid range', () => {
      const result = resolveWindow('invalid')
      const duration = result.end.getTime() - result.start.getTime()
      expect(duration).toBe(24 * 3600 * 1000)
    })

    it('should default to 24h for undefined range', () => {
      const result = resolveWindow()
      const duration = result.end.getTime() - result.start.getTime()
      expect(duration).toBe(24 * 3600 * 1000)
    })

    it('should include unit when requested for hourly range', () => {
      const result = resolveWindow('12h', true)
      expect(result.unit).toBe('hour')
    })

    it('should include unit when requested for daily range', () => {
      const result = resolveWindow('7d', true)
      expect(result.unit).toBe('day')
    })

    it('should not include unit when not requested', () => {
      const result = resolveWindow('24h', false)
      expect(result.unit).toBeUndefined()
    })
  })

  describe('previousWindow', () => {
    it('should calculate previous window with same duration', () => {
      const start = new Date('2024-01-15T00:00:00Z')
      const end = new Date('2024-01-16T00:00:00Z')
      const result = previousWindow(start, end)

      const originalDuration = end.getTime() - start.getTime()
      const previousDuration = result.end.getTime() - result.start.getTime()

      expect(previousDuration).toBe(originalDuration)
      expect(result.end).toEqual(start)
    })

    it('should calculate previous window for 24 hours', () => {
      const start = new Date('2024-01-15T12:00:00Z')
      const end = new Date('2024-01-16T12:00:00Z')
      const result = previousWindow(start, end)

      expect(result.start).toEqual(new Date('2024-01-14T12:00:00Z'))
      expect(result.end).toEqual(new Date('2024-01-15T12:00:00Z'))
    })

    it('should calculate previous window for 7 days', () => {
      const start = new Date('2024-01-08T00:00:00Z')
      const end = new Date('2024-01-15T00:00:00Z')
      const result = previousWindow(start, end)

      expect(result.start).toEqual(new Date('2024-01-01T00:00:00Z'))
      expect(result.end).toEqual(new Date('2024-01-08T00:00:00Z'))
    })
  })

  describe('assertNumber', () => {
    it('should convert valid number', () => {
      expect(assertNumber(42)).toBe(42)
      expect(assertNumber(0)).toBe(0)
      expect(assertNumber(-10)).toBe(-10)
      expect(assertNumber(3.14)).toBe(3.14)
    })

    it('should convert numeric string', () => {
      expect(assertNumber('42')).toBe(42)
      expect(assertNumber('3.14')).toBe(3.14)
    })

    it('should return fallback for null', () => {
      expect(assertNumber(null)).toBe(0)
      expect(assertNumber(null, 100)).toBe(100)
    })

    it('should return fallback for undefined', () => {
      expect(assertNumber(undefined)).toBe(0)
      expect(assertNumber(undefined, 50)).toBe(50)
    })

    it('should return fallback for NaN', () => {
      expect(assertNumber(Number.NaN)).toBe(0)
      expect(assertNumber('not-a-number')).toBe(0)
      expect(assertNumber('invalid', 99)).toBe(99)
    })

    it('should handle zero as valid number', () => {
      expect(assertNumber(0)).toBe(0)
      expect(assertNumber('0')).toBe(0)
    })
  })

  describe('assertString', () => {
    it('should return string as-is', () => {
      expect(assertString('hello')).toBe('hello')
      expect(assertString('')).toBe('')
      expect(assertString('123')).toBe('123')
    })

    it('should return empty string for non-string', () => {
      expect(assertString(42)).toBe('')
      expect(assertString(null)).toBe('')
      expect(assertString(undefined)).toBe('')
      expect(assertString(true)).toBe('')
      expect(assertString({})).toBe('')
      expect(assertString([])).toBe('')
    })
  })

  describe('isValidTimeRange', () => {
    it('should validate correct time ranges', () => {
      expect(isValidTimeRange('3h')).toBe(true)
      expect(isValidTimeRange('6h')).toBe(true)
      expect(isValidTimeRange('12h')).toBe(true)
      expect(isValidTimeRange('24h')).toBe(true)
      expect(isValidTimeRange('7d')).toBe(true)
      expect(isValidTimeRange('30d')).toBe(true)
      expect(isValidTimeRange('90d')).toBe(true)
      expect(isValidTimeRange('6mo')).toBe(true)
      expect(isValidTimeRange('1y')).toBe(true)
    })

    it('should reject invalid time ranges', () => {
      expect(isValidTimeRange('1h')).toBe(false)
      expect(isValidTimeRange('48h')).toBe(false)
      expect(isValidTimeRange('1d')).toBe(false)
      expect(isValidTimeRange('14d')).toBe(false)
      expect(isValidTimeRange('invalid')).toBe(false)
      expect(isValidTimeRange('')).toBe(false)
    })
  })
})
