import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.AUTH_NEXT_SECRET = 'test-secret'
process.env.SMTP_HOST = 'localhost'
process.env.SMTP_PORT = '587'
process.env.SMTP_SECURE = 'false'
process.env.SMTP_USER = 'test@test.com'
process.env.SMTP_PASS = 'test-password'
process.env.SMTP_FROM_EMAIL = 'noreply@test.com'
process.env.SMTP_FROM_NAME = 'Test App'
process.env.APP_BASE_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.AWS_REGION = 'us-east-1'
process.env.AWS_ACCESS_KEY_ID = 'test-key'
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret'
process.env.AWS_S3_BUCKET = 'test-bucket'
process.env.APP_HMAC_SECRET = 'test-hmac-secret-for-tokens'
process.env.CRON_SECRET = 'test-cron-secret'
process.env.SEND_BATCH_SIZE = '100'

// Global test utilities
beforeAll(() => {
  // Setup before all tests
})

afterEach(() => {
  // Clear all mocks after each test
  vi.clearAllMocks()
})

afterAll(() => {
  // Cleanup after all tests
  vi.resetAllMocks()
})
