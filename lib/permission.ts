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

// Optional: DB-backed check for server-only use when you want fresh reads
export async function hasPermissionDb(userId: string, key: string) {
  const { getDb } = await import('@/lib/db/instance') // avoid edge bundling issues
  const db = getDb()
  const row = await db
    .selectFrom('User')
    .select(['permissions'])
    .where('id', '=', userId)
    .executeTakeFirst()
  const perms = (row?.permissions as PermissionMap | null) ?? {}
  return perms[key] === 1
}
