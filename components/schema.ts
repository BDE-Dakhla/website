import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])

export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('developer'),
  z.literal('teacher'),
  z.literal('student'),
  z.literal('contributor'),
  z.literal('administrator'),
])

export type Role = z.infer<typeof userRoleSchema>

const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof userSchema>
export const userListSchema = z.array(userSchema)
