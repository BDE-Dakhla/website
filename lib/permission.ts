import type { PermissionMap } from '@/types/schema'

export function hasPermission(
  perms: PermissionMap | null | undefined,
  key: string,
): boolean {
  return perms?.[key] === 1
}

export function listPermissions(
  perms: PermissionMap | null | undefined,
): string[] {
  const p = perms ?? {}
  return Object.keys(p).filter((k) => p[k] === 1)
}
