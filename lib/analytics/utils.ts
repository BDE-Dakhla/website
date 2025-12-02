/** Analytics utility functions shared across analytics API routes */

import type { TimeUnit, TimeWindow } from './types'

/**
 * Resolves a time range string to start/end dates and time unit
 * @param range - Time range string (e.g., '24h', '7d')
 * @param includeUnit - Whether to include the time unit in the result
 * @returns Object with start, end dates and optional unit
 */
export function resolveWindow(range?: string, includeUnit = false): TimeWindow {
  const now = new Date()
  const end = now
  let start: Date
  let unit: TimeUnit = 'hour'

  switch (range) {
    case '3h':
      start = new Date(end.getTime() - 3 * 3600 * 1000)
      unit = 'hour'
      break
    case '6h':
      start = new Date(end.getTime() - 6 * 3600 * 1000)
      unit = 'hour'
      break
    case '12h':
      start = new Date(end.getTime() - 12 * 3600 * 1000)
      unit = 'hour'
      break
    case '24h':
      start = new Date(end.getTime() - 24 * 3600 * 1000)
      unit = 'hour'
      break
    case '7d':
      start = new Date(end.getTime() - 7 * 24 * 3600 * 1000)
      unit = 'day'
      break
    case '30d':
      start = new Date(end.getTime() - 30 * 24 * 3600 * 1000)
      unit = 'day'
      break
    case '90d':
      start = new Date(end.getTime() - 90 * 24 * 3600 * 1000)
      unit = 'day'
      break
    case '6mo':
      start = new Date(end.getTime() - 182 * 24 * 3600 * 1000)
      unit = 'day'
      break
    case '1y':
      start = new Date(end.getTime() - 365 * 24 * 3600 * 1000)
      unit = 'day'
      break
    default:
      start = new Date(end.getTime() - 24 * 3600 * 1000)
      unit = 'hour'
  }

  return includeUnit ? { start, end, unit } : { start, end }
}

/**
 * Calculates the previous time window for comparison
 * @param start - Start date of current window
 * @param end - End date of current window
 * @returns Object with start and end dates for previous window
 */
export function previousWindow(start: Date, end: Date) {
  const duration = end.getTime() - start.getTime()
  const prevEnd = start
  const prevStart = new Date(start.getTime() - duration)
  return { start: prevStart, end: prevEnd }
}

/**
 * Safely converts unknown value to number with fallback
 * @param value - Value to convert
 * @param fallback - Fallback value if conversion fails (default: 0)
 * @returns Number or fallback value
 */
export function assertNumber(value: unknown, fallback = 0): number {
  if (value === null || value === undefined) return fallback
  const num = Number(value)
  return Number.isNaN(num) ? fallback : num
}

/**
 * Safely converts unknown value to string
 * @param value - Value to convert
 * @returns String or empty string if not a string
 */
export function assertString(value: unknown): string {
  if (typeof value === 'string') return value
  return ''
}
