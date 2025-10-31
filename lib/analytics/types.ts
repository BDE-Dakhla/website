export type FilterField = 'url' | 'referrer' | 'browser' | 'os' | 'device'
export type FilterOp = 'is' | 'is_not' | 'contains' | 'not_contains'
export type Kind = 'browsers' | 'os' | 'devices'

export interface Filter {
  field: FilterField
  op: FilterOp
  value: string
}

export function isValidFilterField(field: string): field is FilterField {
  return ['url', 'referrer', 'browser', 'os', 'device'].includes(field)
}

export function isValidFilterOp(op: string): op is FilterOp {
  return ['is', 'is_not', 'contains', 'not_contains'].includes(op)
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

export interface VisitorData {
  user_agent: string | null
  ua_brands: unknown
  ua_platform: string | null
  ua_mobile: boolean | null
  device_category?: string | null
}
