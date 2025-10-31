export const SPONSOR_LOGO_CONSTRAINTS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/svg+xml'],
  allowedExtensions: ['.svg'],
}

export interface FileValidationError {
  type: 'size' | 'format' | 'extension'
  message: string
}

export function validateSponsorLogo(file: File): FileValidationError[] {
  const errors: FileValidationError[] = []

  // Check file size
  if (file.size > SPONSOR_LOGO_CONSTRAINTS.maxSize) {
    errors.push({
      type: 'size',
      message: `File size must be less than ${Math.round(SPONSOR_LOGO_CONSTRAINTS.maxSize / 1024 / 1024)}MB`,
    })
  }

  // Check MIME type
  if (!SPONSOR_LOGO_CONSTRAINTS.allowedTypes.includes(file.type)) {
    errors.push({
      type: 'format',
      message: 'Only SVG files are allowed for sponsor logos',
    })
  }

  // Check file extension
  const extension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf('.'))
  if (!SPONSOR_LOGO_CONSTRAINTS.allowedExtensions.includes(extension)) {
    errors.push({
      type: 'extension',
      message: 'File must have a .svg extension',
    })
  }

  return errors
}

export function generateSponsorLogoKey(originalFilename: string): string {
  // Remove special characters and spaces, keep only alphanumeric and hyphens
  const cleanName = originalFilename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  // Add timestamp to ensure uniqueness
  const timestamp = Date.now()
  return `sponsors/${cleanName}-${timestamp}.svg`
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}
