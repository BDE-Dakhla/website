export const PERMISSIONS = {
  HAS_ACCESS_TO_DASHBOARD: 1 << 0,
} as const

export type PermissionKey = keyof typeof PERMISSIONS
export type PermissionMask = number

// Easiest: numbers are always bit values
export function permissionsToMask(
  perms: Array<PermissionKey | number>,
): number {
  return perms.reduce(
    (mask, p) => mask | (typeof p === 'number' ? p : PERMISSIONS[p]),
    0,
  )
}
