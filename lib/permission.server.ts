import 'server-only'

import type { PermissionMap } from '@/types/schema'
import { getDb } from '@/lib/db/instance'

export async function hasPermissionDb(userId: string, key: string) {
  const db = getDb()
  const row = await db
    .selectFrom('User')
    .select(['permissions'])
    .where('id', '=', userId)
    .executeTakeFirst()
  const perms = (row?.permissions as PermissionMap | null) ?? {}
  return perms[key] === 1
}
