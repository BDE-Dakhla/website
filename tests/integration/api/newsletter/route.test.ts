import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockDb, createMockKyselyQuery } from '@/tests/__mocks__/kysely'
import { mockSubscribers } from '@/tests/fixtures/subscribers'
import { createMockRequest, extractJsonFromResponse } from '@/tests/helpers'

// Mock dependencies
vi.mock('@/lib/db/instance', () => ({
  getDb: vi.fn(),
}))

vi.mock('@/lib/smtp', () => ({
  sendSmtpMail: vi.fn().mockResolvedValue({
    messageId: 'test-message-id@localhost',
  }),
}))

vi.mock('@/lib/email-templates', () => ({
  generateWelcomeEmail: vi.fn(() => ({
    html: '<p>Welcome!</p>',
    text: 'Welcome!',
  })),
}))

vi.mock('@/lib/tokens', () => ({
  makeUnsubToken: vi.fn(() => 'mock-unsub-token'),
}))

import { POST } from '@/app/api/newsletter/route'
import { getDb } from '@/lib/db/instance'
import { generateWelcomeEmail } from '@/lib/email-templates'
import { sendSmtpMail } from '@/lib/smtp'

describe('POST /api/newsletter', () => {
  let mockDb: ReturnType<typeof createMockDb>
  let mockQuery: ReturnType<typeof createMockKyselyQuery>

  beforeEach(() => {
    vi.clearAllMocks()
    mockQuery = createMockKyselyQuery()
    mockDb = createMockDb()

    // Setup default mock implementations
    mockDb.insertInto = vi.fn().mockReturnValue(mockQuery)
    mockDb.selectFrom = vi.fn().mockReturnValue(mockQuery)
    mockDb.updateTable = vi.fn().mockReturnValue(mockQuery)

    vi.mocked(getDb).mockReturnValue(mockDb as any)
  })

  it('should successfully subscribe a new user', async () => {
    const email = 'newuser@example.com'

    // Mock successful insert (no duplicate)
    mockQuery.execute.mockResolvedValueOnce(undefined) // successful insert

    const request = createMockRequest('http://localhost/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.message).toBe('subscribed')

    // Verify DB insert was called
    expect(mockDb.insertInto).toHaveBeenCalledWith('subscribers')
    expect(mockQuery.values).toHaveBeenCalled()

    // Verify email was sent
    expect(sendSmtpMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: email,
        subject: expect.stringContaining('newsletter'),
      }),
    )
  })

  it('should reject invalid email addresses', async () => {
    const request = createMockRequest('http://localhost/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid-email' }),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid email')
  })

  it('should reject missing email', async () => {
    const request = createMockRequest('http://localhost/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid email')
  })

  it('should handle already subscribed active user', async () => {
    const email = 'existing@example.com'

    // Mock duplicate error
    const duplicateError: any = new Error('Duplicate key')
    duplicateError.code = '23505'
    mockQuery.execute.mockRejectedValueOnce(duplicateError)

    // Mock finding existing active subscriber
    mockQuery.executeTakeFirst.mockResolvedValueOnce(mockSubscribers.active)

    const request = createMockRequest('http://localhost/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.message).toBe('already_subscribed')

    // Should not send email for already subscribed
    expect(sendSmtpMail).not.toHaveBeenCalled()
  })

  it('should reactivate unsubscribed user', async () => {
    const email = 'unsubscribed@example.com'

    // Mock duplicate error
    const duplicateError: any = new Error('Duplicate key')
    duplicateError.code = '23505'
    mockQuery.execute
      .mockRejectedValueOnce(duplicateError) // insert fails
      .mockResolvedValueOnce(undefined) // update succeeds

    // Mock finding existing unsubscribed subscriber
    mockQuery.executeTakeFirst.mockResolvedValueOnce(
      mockSubscribers.unsubscribed,
    )

    const request = createMockRequest('http://localhost/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.message).toBe('subscribed')

    // Verify update was called to reactivate
    expect(mockDb.updateTable).toHaveBeenCalledWith('subscribers')

    // Should send welcome email for reactivated user
    expect(sendSmtpMail).toHaveBeenCalled()
  })

  it('should reject bounced email addresses', async () => {
    const email = 'bounced@example.com'

    // Mock duplicate error
    const duplicateError: any = new Error('Duplicate key')
    duplicateError.code = '23505'
    mockQuery.execute.mockRejectedValueOnce(duplicateError)

    // Mock finding existing bounced subscriber
    mockQuery.executeTakeFirst.mockResolvedValueOnce(mockSubscribers.bounced)

    const request = createMockRequest('http://localhost/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(400)
    expect(data.ok).toBe(false)
    expect(data.message).toBe('email_bounced')
  })

  it('should handle email sending failure gracefully', async () => {
    const email = 'newuser@example.com'

    // Mock successful insert
    mockQuery.execute.mockResolvedValueOnce(undefined)

    // Mock email sending failure
    vi.mocked(sendSmtpMail).mockRejectedValueOnce(new Error('SMTP error'))

    const request = createMockRequest('http://localhost/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    // Should still return success even if email fails
    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.message).toBe('subscribed')
  })

  it('should normalize email to lowercase', async () => {
    const email = 'UPPERCASE@EXAMPLE.COM'

    mockQuery.execute.mockResolvedValueOnce(undefined)

    const request = createMockRequest('http://localhost/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    await POST(request)

    // Verify values was called with lowercase email
    expect(mockQuery.values).toHaveBeenCalledWith(
      expect.objectContaining({
        email: email.toLowerCase(),
      }),
    )
  })

  it('should generate unsubscribe token and include in email', async () => {
    const email = 'newuser@example.com'

    mockQuery.execute.mockResolvedValueOnce(undefined)

    const request = createMockRequest('http://localhost/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    await POST(request)

    // Verify welcome email generation with unsubscribe URL
    expect(generateWelcomeEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: email.toLowerCase(),
        unsubscribeUrl: expect.stringContaining('unsubscribe'),
      }),
    )
  })

  it('should handle database errors', async () => {
    const email = 'test@example.com'

    // Mock unexpected database error
    mockQuery.execute.mockRejectedValueOnce(
      new Error('Database connection failed'),
    )

    const request = createMockRequest('http://localhost/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    // Should throw and be caught by error boundary
    await expect(POST(request)).rejects.toThrow()
  })
})
