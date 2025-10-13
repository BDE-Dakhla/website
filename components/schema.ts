import type { Database } from '@/types/schema'
import { z } from 'zod'

export type User = Database['User'] & {
  username?: string | null
  phoneNumber?: string | null
  status?: 'active' | 'inactive' | 'invited' | 'suspended'
}

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])

export type UserStatus = z.infer<typeof userStatusSchema>
