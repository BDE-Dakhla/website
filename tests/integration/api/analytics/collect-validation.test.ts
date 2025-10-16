import { describe, expect, it } from 'vitest'

import { POST } from '@/app/api/analytics/collect/route'

describe('POST /api/analytics/collect - Input Validation', () => {
  const createRequest = (
    body: unknown,
    headers: Record<string, string> = {},
  ) => {
    return new Request('http://localhost:3000/api/analytics/collect', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers,
      },
      body: JSON.stringify(body),
    })
  }

  it('should return 400 for invalid JSON', async () => {
    const req = new Request('http://localhost:3000/api/analytics/collect', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'invalid json',
    })

    const response = await POST(req as never)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid JSON')
  })

  it('should return 400 for invalid payload', async () => {
    const req = createRequest({
      invalid: 'payload',
    })

    const response = await POST(req as never)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid payload')
  })

  it('should return 400 for missing type field', async () => {
    const req = createRequest({
      path: '/home',
    })

    const response = await POST(req as never)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid payload')
  })

  it('should return 400 for missing path field', async () => {
    const req = createRequest({
      type: 'pageview',
    })

    const response = await POST(req as never)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid payload')
  })

  it('should return 400 for invalid type', async () => {
    const req = createRequest({
      type: 'invalid-type',
      path: '/home',
    })

    const response = await POST(req as never)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid payload')
  })

  it('should return 400 for missing event name on event type', async () => {
    const req = createRequest({
      type: 'event',
      path: '/contact',
    })

    const response = await POST(req as never)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing event name')
  })
})
