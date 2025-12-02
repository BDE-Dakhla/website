export type FilterField = 'url' | 'referrer' | 'browser' | 'os' | 'device'
export type FilterOp = 'is' | 'is_not' | 'contains' | 'not_contains'
export type Kind = 'browsers' | 'os' | 'devices'
export type TimeRange =
  | '3h'
  | '6h'
  | '12h'
  | '24h'
  | '7d'
  | '30d'
  | '90d'
  | '6mo'
  | '1y'

export type TimeUnit = 'hour' | 'day'

export interface TimeWindow {
  start: Date
  end: Date
  unit?: TimeUnit
}

export interface Filter {
  field: FilterField
  op: FilterOp
  value: string
}

export interface VisitorData {
  user_agent: string | null
  ua_brands: { brand: string; version?: string }[]
  ua_platform: string | null
  ua_mobile: boolean | null
  device_category?: string | null
}

export function isValidFilterField(field: string): field is FilterField {
  return ['url', 'referrer', 'browser', 'os', 'device'].includes(field)
}

export function isValidFilterOp(op: string): op is FilterOp {
  return ['is', 'is_not', 'contains', 'not_contains'].includes(op)
}

/**
 * Validates if a string is a valid time range
 * @param value - Value to check
 * @returns True if value is a valid TimeRange
 */
export function isValidTimeRange(value: string): value is TimeRange {
  return ['3h', '6h', '12h', '24h', '7d', '30d', '90d', '6mo', '1y'].includes(
    value,
  )
}

/**
 * Parses and validates filter parameters from query string
 * @param param - JSON string containing filter array
 * @returns Array of validated Filter objects
 */
export function parseFilters(param: string | null): Filter[] {
  if (!param) return []
  try {
    const parsed = JSON.parse(param)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is Filter => {
      if (!item || typeof item !== 'object') return false
      if (!('field' in item) || !('op' in item) || !('value' in item))
        return false
      return (
        isValidFilterField(item.field) &&
        isValidFilterOp(item.op) &&
        typeof item.value === 'string'
      )
    })
  } catch {
    return []
  }
}
