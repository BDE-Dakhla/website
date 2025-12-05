import type { Translator } from '@/components/schema'
import { z } from 'zod'

/**
 * Moroccan phone number formats:
 * - Mobile: +212 6XX XXX XXX or +212 7XX XXX XXX
 * - Fixed: +212 5XX XXX XXX
 * - International format: +212XXXXXXXXX
 * - National format: 06XXXXXXXX, 07XXXXXXXX, 05XXXXXXXX
 */
const moroccanPhoneRegex = /^(?:\+212|212|0)?([567]\d{8})$/

const cleanUp = (phone: string | undefined): boolean => {
  if (!phone || phone.trim() === '') return true
  else return moroccanPhoneRegex.test(phone.replace(/[\s\-().]/g, ''))
}

export const phoneNumberSchema = (t: Translator) =>
  z
    .string()
    .optional()
    .refine(cleanUp, {
      error: (value) =>
        value.input === undefined
          ? t('validation.phone.required')
          : t('validation.phone.invalid'),
    })

/**
 * Format a Moroccan phone number to international format
 * @param phone - Raw phone number input
 * @returns Formatted phone number or null if invalid
 */
export function formatMoroccanPhone(phone: string): string | null {
  if (!phone) return null

  const cleanPhone = phone.replace(/[\s\-().]/g, '')
  const match = cleanPhone.match(moroccanPhoneRegex)

  if (!match) return null

  const nationalNumber = match[1]
  return `+212 ${nationalNumber.substring(0, 1)} ${nationalNumber.substring(1, 3)} ${nationalNumber.substring(3, 6)} ${nationalNumber.substring(6)}`
}
