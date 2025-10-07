import type { Database } from '@/types/schema'
import { z } from 'zod'
import { userRoleSchema } from '@/types/schema'

// Use the proper database User type for table components
export type User = Database['User'] & {
  // Add any additional fields that might be computed/transformed
  username?: string | null // Can be transformed from 'name'
  phoneNumber?: string | null // If this field exists
  status?: 'active' | 'inactive' | 'invited' | 'suspended' // If this field exists
}

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])

export type UserStatus = z.infer<typeof userStatusSchema>

// Keep the old schema for compatibility if needed elsewhere
const legacyUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const userListSchema = z.array(legacyUserSchema)
