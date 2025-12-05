import type { getTranslations } from 'next-intl/server'
import { z } from 'zod'
import { phoneNumberSchema } from '@/lib/validation/phone'
import { type Database, userRoleSchema } from '@/types/schema'

export type Translator = Awaited<ReturnType<typeof getTranslations>>

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

export const userFullNameSchema = (t: Translator) =>
  z.string().min(8, {
    error: (value) =>
      value.input?.length === 0
        ? t('validation.username.required')
        : t('validation.username.invalid'),
  })

export type UserStatus = z.infer<typeof userStatusSchema>

export const emailSchema = (t: Translator) =>
  z.email({
    error: (value) =>
      value.input === undefined
        ? t('validation.email.required')
        : t('validation.email.invalid'),
  })

export const permissionsSchema = z
  .record(z.string(), z.union([z.literal(0), z.literal(1)]))
  .optional()

export const passwordSchema = (t: Translator) =>
  z
    .string()
    .min(8, t('')) // 'Password must be at least 8 characters.'
    .transform((pwd) => pwd.trim())

export const publicUserSchema = (t: Translator) =>
  z.object({
    username: userFullNameSchema(t),
    email: emailSchema(t),
    phoneNumber: phoneNumberSchema(t),
    role: userRoleSchema,
    password: passwordSchema(t),
    permissions: permissionsSchema,
  })

export const clubSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be less than 100 characters'),
  hasInternationalGroup: z.boolean().default(false),
  memberCount: z.number().int().min(0).default(0),
  imageUrl: z.string().nullable().optional(),
  dominant_color: z.string().nullable().optional(),
})
