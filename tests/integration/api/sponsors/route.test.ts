import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockRequest, createMockSession, extractJsonFromResponse } from '@/tests/helpers'
import { createMockDb, createMockKyselyQuery } from '@/tests/__mocks__/kysely'
import { mockSponsors } from '@/tests/fixtures/sponsors'

// Mock dependencies
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/db/instance', () => ({
  getDb: vi.fn(),
}))

import { GET, POST } from '@/app/api/sponsors/route'
import { auth } from '@/auth'
import { getDb } from '@/lib/db/instance'

describe('GET /api/sponsors', () => {
  let mockDb: ReturnType<typeof createMockDb>
  let mockQuery: ReturnType<typeof createMockKyselyQuery>

  beforeEach(() => {
    vi.clearAllMocks()
    mockQuery = createMockKyselyQuery()
    mockDb = createMockDb()
    
    mockDb.selectFrom = vi.fn().mockReturnValue(mockQuery)
    vi.mocked(getDb).mockReturnValue(mockDb as any)
  })

  it('should return only approved sponsors for public users', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null)
    
    mockQuery.execute.mockResolvedValueOnce([mockSponsors.approved, mockSponsors.featured])
    
    const request = createMockRequest('http://localhost/api/sponsors', {
      method: 'GET',
    })

    const response = await GET(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    
    // Verify where clause was added for approved only
    expect(mockQuery.where).toHaveBeenCalledWith('approved', '=', true)
  })

  it('should return all sponsors when user has MANAGE_SPONSORS permission and requests include_unapproved', async () => {
    vi.mocked(auth).mockResolvedValueOnce(
      createMockSession({
        permissions: { MANAGE_SPONSORS: 1 },
      }),
    )
    
    mockQuery.execute.mockResolvedValueOnce([
      mockSponsors.approved,
      mockSponsors.unapproved,
      mockSponsors.featured,
    ])
    
    const request = createMockRequest(
      'http://localhost/api/sponsors?include_unapproved=true',
      { method: 'GET' },
    )

    const response = await GET(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(3)
    
    // Should not filter by approved status
    expect(mockQuery.where).not.toHaveBeenCalledWith('approved', '=', true)
  })

  it('should order sponsors by featured, priority, and created date', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null)
    
    mockQuery.execute.mockResolvedValueOnce([mockSponsors.featured, mockSponsors.approved])
    
    const request = createMockRequest('http://localhost/api/sponsors', {
      method: 'GET',
    })

    await GET(request)

    expect(mockQuery.orderBy).toHaveBeenCalledWith('is_featured', 'desc')
    expect(mockQuery.orderBy).toHaveBeenCalledWith('priority', 'asc')
    expect(mockQuery.orderBy).toHaveBeenCalledWith('created_at', 'desc')
  })
})

describe('POST /api/sponsors', () => {
  let mockDb: ReturnType<typeof createMockDb>
  let mockQuery: ReturnType<typeof createMockKyselyQuery>

  beforeEach(() => {
    vi.clearAllMocks()
    mockQuery = createMockKyselyQuery()
    mockDb = createMockDb()
    
    mockDb.selectFrom = vi.fn().mockReturnValue(mockQuery)
    mockDb.insertInto = vi.fn().mockReturnValue(mockQuery)
    
    vi.mocked(getDb).mockReturnValue(mockDb as any)
  })

  it('should create sponsor when user has MANAGE_SPONSORS permission', async () => {
    vi.mocked(auth).mockResolvedValueOnce(
      createMockSession({
        id: 'admin-123',
        permissions: { MANAGE_SPONSORS: 1 },
      }),
    )
    
    // Mock no existing sponsor
    mockQuery.executeTakeFirst.mockResolvedValueOnce(undefined)
    
    // Mock successful insert
    mockQuery.execute.mockResolvedValueOnce([mockSponsors.approved])
    
    const sponsorData = {
      name: 'New Sponsor',
      slug: 'new-sponsor',
      description: 'A new sponsor',
      website_url: 'https://newsponsor.com',
      logo_url: 'https://cdn.example.com/new.png',
      priority: 100,
      is_featured: false,
    }

    const request = createMockRequest('http://localhost/api/sponsors', {
      method: 'POST',
      body: JSON.stringify(sponsorData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('id')
    
    // Verify auto-approval for admin
    expect(mockQuery.values).toHaveBeenCalledWith(
      expect.objectContaining({
        approved: true,
        approved_by: 'admin-123',
      }),
    )
  })

  it('should reject unauthenticated requests', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null)
    
    const sponsorData = {
      name: 'New Sponsor',
      slug: 'new-sponsor',
      description: 'A new sponsor',
      website_url: 'https://newsponsor.com',
      logo_url: 'https://cdn.example.com/new.png',
      priority: 100,
      is_featured: false,
    }

    const request = createMockRequest('http://localhost/api/sponsors', {
      method: 'POST',
      body: JSON.stringify(sponsorData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should reject users without MANAGE_SPONSORS permission', async () => {
    vi.mocked(auth).mockResolvedValueOnce(
      createMockSession({
        permissions: {}, // No permissions
      }),
    )
    
    const sponsorData = {
      name: 'New Sponsor',
      slug: 'new-sponsor',
      description: 'A new sponsor',
      website_url: 'https://newsponsor.com',
      logo_url: 'https://cdn.example.com/new.png',
      priority: 100,
      is_featured: false,
    }

    const request = createMockRequest('http://localhost/api/sponsors', {
      method: 'POST',
      body: JSON.stringify(sponsorData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(403)
    expect(data.error).toBe('Forbidden')
  })

  it('should reject duplicate slug', async () => {
    vi.mocked(auth).mockResolvedValueOnce(
      createMockSession({
        permissions: { MANAGE_SPONSORS: 1 },
      }),
    )
    
    // Mock existing sponsor with same slug
    mockQuery.executeTakeFirst.mockResolvedValueOnce(mockSponsors.approved)
    
    const sponsorData = {
      name: 'New Sponsor',
      slug: 'approved-sponsor', // Already exists
      description: 'A new sponsor',
      website_url: 'https://newsponsor.com',
      logo_url: 'https://cdn.example.com/new.png',
      priority: 100,
      is_featured: false,
    }

    const request = createMockRequest('http://localhost/api/sponsors', {
      method: 'POST',
      body: JSON.stringify(sponsorData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(400)
    expect(data.error).toContain('already exists')
  })

  it('should validate required fields', async () => {
    vi.mocked(auth).mockResolvedValueOnce(
      createMockSession({
        permissions: { MANAGE_SPONSORS: 1 },
      }),
    )
    
    const sponsorData = {
      name: '', // Invalid: empty name
      slug: 'new-sponsor',
      logo_url: 'https://cdn.example.com/new.png',
    }

    const request = createMockRequest('http://localhost/api/sponsors', {
      method: 'POST',
      body: JSON.stringify(sponsorData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation error')
  })

  it('should validate URL format for website_url', async () => {
    vi.mocked(auth).mockResolvedValueOnce(
      createMockSession({
        permissions: { MANAGE_SPONSORS: 1 },
      }),
    )
    
    const sponsorData = {
      name: 'New Sponsor',
      slug: 'new-sponsor',
      description: 'A new sponsor',
      website_url: 'not-a-valid-url',
      logo_url: 'https://cdn.example.com/new.png',
      priority: 100,
      is_featured: false,
    }

    const request = createMockRequest('http://localhost/api/sponsors', {
      method: 'POST',
      body: JSON.stringify(sponsorData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Validation error')
  })
})
