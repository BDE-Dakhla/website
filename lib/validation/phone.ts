import { z } from 'zod'
import { getTranslations } from 'next-intl/server'

/**
 * Moroccan phone number formats:
 * - Mobile: +212 6XX XXX XXX or +212 7XX XXX XXX
 * - Fixed: +212 5XX XXX XXX
 * - International format: +212XXXXXXXXX
 * - National format: 06XXXXXXXX, 07XXXXXXXX, 05XXXXXXXX
 */

const moroccanPhoneRegex = /^(?:\+212|212|0)?([567]\d{8})$/

export async function createPhoneNumberSchema() {
  const t = await getTranslations('validation.phone')
  
  return z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone || phone.trim() === '') return true
      
      const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
      
      return moroccanPhoneRegex.test(cleanPhone)
    }, {
      message: t('invalid')
    })
}

export async function createRequiredPhoneNumberSchema() {
  const t = await getTranslations('validation.phone')
  
  return z
    .string()
    .min(1, t('required'))
    .refine((phone) => {
      const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
      return moroccanPhoneRegex.test(cleanPhone)
    }, {
      message: t('invalid')
    })
}

export const phoneNumberSchema = z
  .string()
  .optional()
  .refine((phone) => {
    if (!phone || phone.trim() === '') return true
    
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
    
    return moroccanPhoneRegex.test(cleanPhone)
  }, {
    message: 'Le numéro de téléphone doit être un numéro marocain valide (+212 6XX XXX XXX, +212 7XX XXX XXX, ou +212 5XX XXX XXX)'
  })

export const requiredPhoneNumberSchema = z
  .string()
  .min(1, 'Le numéro de téléphone est requis')
  .refine((phone) => {
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
    return moroccanPhoneRegex.test(cleanPhone)
  }, {
    message: 'Le numéro de téléphone doit être un numéro marocain valide (+212 6XX XXX XXX, +212 7XX XXX XXX, ou +212 5XX XXX XXX)'
  })

/**
 * Format a Moroccan phone number to international format
 * @param phone - Raw phone number input
 * @returns Formatted phone number or null if invalid
 */
export function formatMoroccanPhone(phone: string): string | null {
  if (!phone) return null
  
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
  const match = cleanPhone.match(moroccanPhoneRegex)
  
  if (!match) return null
  
  const nationalNumber = match[1]
  return `+212 ${nationalNumber.substring(0, 1)} ${nationalNumber.substring(1, 3)} ${nationalNumber.substring(3, 6)} ${nationalNumber.substring(6)}`
}

/**
 * Validate and format a phone number input
 * @param phone - Raw phone number input
 * @returns Object with validation result and formatted number
 */
export function validateAndFormatPhone(phone: string): { 
  isValid: boolean
  formatted: string | null
  error?: string 
} {
  try {
    phoneNumberSchema.parse(phone)
    const formatted = formatMoroccanPhone(phone)
    return { 
      isValid: true, 
      formatted 
    }
  } catch (error) {
    return { 
      isValid: false, 
      formatted: null,
      error: error instanceof Error ? error.message : 'Invalid phone number'
    }
  }
}