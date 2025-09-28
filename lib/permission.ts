export const PERMISSIONS = {
  HAS_ACCESS_TO_DASHBOARD: 1 << 0,
  HAS_ACCESS_TO_SYLLABUS: 1 << 1,
} as const

export type PermissionKey = keyof typeof PERMISSIONS
export type PermissionMask = number

export function permissionsToMask(
  perms: Array<PermissionKey | number>,
): number {
  return perms.reduce((mask, p) => {
    if (typeof p === 'number') {
      // if you store bit positions (0,1,2...), shift them; if you store bit values, OR them directly
      const isBitPosition = p <= 31 && (p & (p - 1)) !== 0 // crude heuristic
      return mask | (isBitPosition ? 1 << p : p)
    }
    return mask | PERMISSIONS[p]
  }, 0)
}
