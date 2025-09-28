import { z } from 'zod'

export const signInSchema = z.strictObject({
  cdm: z
    .string({ error: 'Code Massar is required' })
    .trim()
    .regex(/^R\d{9}$/i, 'Invalid Code Massar (e.g., R142002537)')
    .transform((v) => v.toUpperCase()),
  password: z
    .string({ error: 'Password is required' })
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
})
