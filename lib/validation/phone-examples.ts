/**
 * Examples of Moroccan phone number validation and formatting
 */

import { formatMoroccanPhone, validateAndFormatPhone } from './phone'

// Test cases for Moroccan phone numbers
const testCases = [
  // Valid formats
  '+212612345678',     // International format
  '212612345678',      // Without + prefix
  '0612345678',        // National format (mobile)
  '0712345678',        // National format (mobile)
  '0512345678',        // National format (fixed)
  '+212 6 12 34 56 78', // International with spaces
  '06 12 34 56 78',    // National with spaces
  '06-12-34-56-78',    // National with dashes
  '06.12.34.56.78',    // National with dots

  // Invalid formats
  '0812345678',        // Invalid prefix (8)
  '0412345678',        // Invalid prefix (4)
  '+33612345678',      // Wrong country code
  '12345',             // Too short
  'abcd123456',        // Contains letters
]

console.log('=== Moroccan Phone Number Validation Examples ===\n')

testCases.forEach(phone => {
  const result = validateAndFormatPhone(phone)
  console.log(`Input: "${phone}"`)
  console.log(`Valid: ${result.isValid}`)
  console.log(`Formatted: ${result.formatted || 'N/A'}`)
  if (result.error) {
    console.log(`Error: ${result.error}`)
  }
  console.log('---')
})

// Examples of specific formatting
console.log('\n=== Formatting Examples ===')
console.log('0612345678 →', formatMoroccanPhone('0612345678'))
console.log('212712345678 → ', formatMoroccanPhone('212712345678'))
console.log('+212512345678 → ', formatMoroccanPhone('+212512345678'))
console.log('06 12 34 56 78 → ', formatMoroccanPhone('06 12 34 56 78'))