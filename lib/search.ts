import z from 'zod'
import { roles } from '@/components/data'

const asArrayOf = <T extends z.ZodTypeAny>(item: T) =>
  z.preprocess((v) => {
    if (Array.isArray(v)) return v
    if (typeof v === 'string') return v.split(',').filter(Boolean)
    return []
  }, z.array(item))

export const usersSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  pageSize: z.coerce.number().int().positive().max(200).catch(10),
  status: asArrayOf(
    z.enum(['active', 'inactive', 'invited', 'suspended']),
  ).catch([]),
  role: asArrayOf(
    z.enum(roles.map((r) => r.value) as [string, ...string[]]),
  ).catch([]),
  username: z.string().catch(''),
})

export type UsersSearch = z.infer<typeof usersSearchSchema>

export function parseUsersSearch(
  input: Record<string, string | string[] | undefined>,
) {
  return usersSearchSchema.parse(input)
}

export function serializeUsersSearch(s: UsersSearch) {
  const params = new URLSearchParams()
  if (s.page !== 1) params.set('page', String(s.page))
  if (s.pageSize !== 10) params.set('pageSize', String(s.pageSize))
  s.status.forEach((v) => params.append('status', v))
  s.role.forEach((v) => params.append('role', v))
  if (s.username) params.set('username', s.username)
  return params.toString()
}
