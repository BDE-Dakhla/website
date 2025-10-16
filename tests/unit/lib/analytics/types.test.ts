import { describe, expect, it } from 'vitest'
import {
  isValidFilterField,
  isValidFilterOp,
  parseFilters,
} from '@/lib/analytics/types'

describe('Analytics Types', () => {
  describe('isValidFilterField', () => {
    it('should validate correct filter fields', () => {
      expect(isValidFilterField('url')).toBe(true)
      expect(isValidFilterField('referrer')).toBe(true)
      expect(isValidFilterField('browser')).toBe(true)
      expect(isValidFilterField('os')).toBe(true)
      expect(isValidFilterField('device')).toBe(true)
    })

    it('should reject invalid filter fields', () => {
      expect(isValidFilterField('invalid')).toBe(false)
      expect(isValidFilterField('country')).toBe(false)
      expect(isValidFilterField('')).toBe(false)
      expect(isValidFilterField('path')).toBe(false)
    })
  })

  describe('isValidFilterOp', () => {
    it('should validate correct filter operations', () => {
      expect(isValidFilterOp('is')).toBe(true)
      expect(isValidFilterOp('is_not')).toBe(true)
      expect(isValidFilterOp('contains')).toBe(true)
      expect(isValidFilterOp('not_contains')).toBe(true)
    })

    it('should reject invalid filter operations', () => {
      expect(isValidFilterOp('equals')).toBe(false)
      expect(isValidFilterOp('like')).toBe(false)
      expect(isValidFilterOp('')).toBe(false)
      expect(isValidFilterOp('gt')).toBe(false)
    })
  })

  describe('parseFilters', () => {
    it('should parse valid filter array', () => {
      const param = JSON.stringify([
        { field: 'url', op: 'is', value: '/home' },
        { field: 'browser', op: 'contains', value: 'Chrome' },
      ])
      const result = parseFilters(param)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ field: 'url', op: 'is', value: '/home' })
      expect(result[1]).toEqual({
        field: 'browser',
        op: 'contains',
        value: 'Chrome',
      })
    })

    it('should handle null input', () => {
      expect(parseFilters(null)).toEqual([])
    })

    it('should handle empty string', () => {
      expect(parseFilters('')).toEqual([])
    })

    it('should handle invalid JSON', () => {
      expect(parseFilters('not valid json')).toEqual([])
      expect(parseFilters('{')).toEqual([])
    })

    it('should handle non-array JSON', () => {
      expect(parseFilters(JSON.stringify({ field: 'url', op: 'is' }))).toEqual(
        [],
      )
      expect(parseFilters(JSON.stringify('string'))).toEqual([])
      expect(parseFilters(JSON.stringify(123))).toEqual([])
    })

    it('should filter out items with invalid fields', () => {
      const param = JSON.stringify([
        { field: 'url', op: 'is', value: '/home' },
        { field: 'invalid', op: 'is', value: 'test' },
      ])
      const result = parseFilters(param)

      expect(result).toHaveLength(1)
      expect(result[0]?.field).toBe('url')
    })

    it('should filter out items with invalid operations', () => {
      const param = JSON.stringify([
        { field: 'url', op: 'is', value: '/home' },
        { field: 'url', op: 'invalid', value: 'test' },
      ])
      const result = parseFilters(param)

      expect(result).toHaveLength(1)
      expect(result[0]?.op).toBe('is')
    })

    it('should filter out items with non-string values', () => {
      const param = JSON.stringify([
        { field: 'url', op: 'is', value: '/home' },
        { field: 'url', op: 'is', value: 123 },
      ])
      const result = parseFilters(param)

      expect(result).toHaveLength(1)
      expect(result[0]?.value).toBe('/home')
    })

    it('should filter out items with missing properties', () => {
      const param = JSON.stringify([
        { field: 'url', op: 'is', value: '/home' },
        { field: 'url', op: 'is' },
        { field: 'url', value: '/test' },
        { op: 'is', value: '/test' },
      ])
      const result = parseFilters(param)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({ field: 'url', op: 'is', value: '/home' })
    })

    it('should filter out non-object items', () => {
      const param = JSON.stringify([
        { field: 'url', op: 'is', value: '/home' },
        'string',
        123,
        null,
        true,
      ])
      const result = parseFilters(param)

      expect(result).toHaveLength(1)
    })

    it('should handle all valid filter fields', () => {
      const param = JSON.stringify([
        { field: 'url', op: 'is', value: '/page' },
        { field: 'referrer', op: 'contains', value: 'google' },
        { field: 'browser', op: 'is_not', value: 'IE' },
        { field: 'os', op: 'not_contains', value: 'Windows' },
        { field: 'device', op: 'is', value: 'Mobile' },
      ])
      const result = parseFilters(param)

      expect(result).toHaveLength(5)
      expect(result.map((f) => f.field)).toEqual([
        'url',
        'referrer',
        'browser',
        'os',
        'device',
      ])
    })
  })
})
