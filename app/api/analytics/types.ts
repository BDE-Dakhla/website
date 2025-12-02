/**
 * Re-export shared analytics types and utilities from lib
 */
import type {
  VisitorData as LibVisitorData,
  VisitorData,
} from '@/lib/analytics/types'

export type {
  Filter,
  FilterField,
  FilterOp,
  VisitorData,
} from '@/lib/analytics/types'
export {
  isValidFilterField,
  isValidFilterOp,
  parseFilters,
} from '@/lib/analytics/types'
export {
  assertNumber,
  assertString,
  previousWindow,
  resolveWindow,
} from '@/lib/analytics/utils'

/**
 * Route-specific types below
 */

export interface MetricsTotals {
  views: number
  visits: number
  visitors: number
  bounce_rate: number
  avg_visit_duration_seconds: number
}

export interface MetricsTotalsRow {
  views: string | number
  visits: string | number
  visitors: string | number
  bounce_rate: string | number
  avg_visit_duration_seconds: string | number
}

export interface MetricsSeriesRow {
  bucket: Date
  views: string | number
  visits: string | number
  visitors: string | number
}

export interface MetricsSeriesPoint {
  time: Date
  views: number
  visits: number
  visitors: number
}

export interface VisitorRow extends LibVisitorData {
  device_category: string | null
}

export interface PathRow {
  value: string
}

export interface ReferrerRow {
  value: string
}

export type EventType = 'pageview' | 'heartbeat' | 'event'

export interface CollectRequestBody {
  type: EventType
  path: string
  title?: string
  referrer?: string
  locale?: string
  ua_ch?: {
    brands?: VisitorData['ua_brands']
    platform?: string
    mobile?: boolean
  }
  event?: string
}

export function isValidEventType(value: unknown): value is EventType {
  return value === 'pageview' || value === 'heartbeat' || value === 'event'
}

export function parseCollectBody(body: unknown): CollectRequestBody | null {
  if (!body || typeof body !== 'object') return null
  const obj = body as Record<string, unknown>

  if (!('type' in obj) || !isValidEventType(obj.type)) return null
  if (!('path' in obj) || typeof obj.path !== 'string') return null

  const result: CollectRequestBody = {
    type: obj.type,
    path: obj.path,
  }

  if ('title' in obj && typeof obj.title === 'string') {
    result.title = obj.title
  }
  if ('referrer' in obj && typeof obj.referrer === 'string') {
    result.referrer = obj.referrer
  }
  if ('locale' in obj && typeof obj.locale === 'string') {
    result.locale = obj.locale
  }
  if ('event' in obj && typeof obj.event === 'string') {
    result.event = obj.event
  }
  if ('ua_ch' in obj && obj.ua_ch && typeof obj.ua_ch === 'object') {
    const uaCh = obj.ua_ch as Record<string, unknown>
    result.ua_ch = {}
    if ('brands' in uaCh && Array.isArray(uaCh.brands)) {
      result.ua_ch.brands = uaCh.brands
    }
    if ('platform' in uaCh && typeof uaCh.platform === 'string') {
      result.ua_ch.platform = uaCh.platform
    }
    if ('mobile' in uaCh && typeof uaCh.mobile === 'boolean') {
      result.ua_ch.mobile = uaCh.mobile
    }
  }

  return result
}
