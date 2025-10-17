import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockDb, createMockKyselyQuery } from '@/tests/__mocks__/kysely'
import { mockUsers } from '@/tests/fixtures/users'
import {
  createMockRequest,
  createMockSession,
  extractJsonFromResponse,
} from '@/tests/helpers'

// Mock dependencies
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/db/instance', () => ({
  getDb: vi.fn(),
}))

vi.mock('bcryptjs', () => ({
  hash: vi.fn((password: string) => Promise.resolve(`hashed_${password}`)),
}))

import { POST } from '@/app/api/users/route'
import { auth } from '@/auth'
import { getDb } from '@/lib/db/instance'

describe('POST /api/users', () => {
  let mockDb: ReturnType<typeof createMockDb>
  let mockQuery: ReturnType<typeof createMockKyselyQuery>

  beforeEach(() => {
    vi.clearAllMocks()
    mockQuery = createMockKyselyQuery()
    mockDb = createMockDb()

    mockDb.insertInto = vi.fn().mockReturnValue(mockQuery)
    mockDb.selectFrom = vi.fn().mockReturnValue(mockQuery)

    vi.mocked(getDb).mockReturnValue(mockDb as any)
  })

  it('should create user successfully when authenticated', async () => {
    // Mock authenticated session
    vi.mocked(auth).mockResolvedValueOnce(createMockSession())

    // Mock no existing user
    mockQuery.executeTakeFirst.mockResolvedValueOnce(undefined)

    // Mock successful insert
    const createdUser = { ...mockUsers.student }
    mockQuery.executeTakeFirst.mockResolvedValueOnce(createdUser)

    const userData = {
      username: 'newuser',
      email: 'newuser@edu.uiz.ac.ma',
      phoneNumber: '+212612345678',
      role: 'student',
      password: 'password123',
    }

    const request = createMockRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.user).toBeDefined()
    expect(data.user.password).toBeUndefined() // Password should be removed

    // Verify password was hashed
    expect(mockQuery.values).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'hashed_password123',
      }),
    )
  })

  it('should reject unauthenticated requests', async () => {
    // Mock no session
    vi.mocked(auth).mockResolvedValueOnce(null)

    const userData = {
      username: 'newuser',
      email: 'newuser@edu.uiz.ac.ma',
      phoneNumber: '+212612345678',
      role: 'student',
      password: 'password123',
    }

    const request = createMockRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should reject invalid email format', async () => {
    vi.mocked(auth).mockResolvedValueOnce(createMockSession())

    const userData = {
      username: 'newuser',
      email: 'invalid-email',
      phoneNumber: '+212612345678',
      role: 'student',
      password: 'password123',
    }

    const request = createMockRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid data')
  })

  it('should reject short passwords', async () => {
    vi.mocked(auth).mockResolvedValueOnce(createMockSession())

    const userData = {
      username: 'newuser',
      email: 'newuser@edu.uiz.ac.ma',
      phoneNumber: '+212612345678',
      role: 'student',
      password: 'short',
    }

    const request = createMockRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid data')
    expect(data.details).toBeDefined()
  })

  it('should reject duplicate email addresses', async () => {
    vi.mocked(auth).mockResolvedValueOnce(createMockSession())

    // Mock existing user
    mockQuery.executeTakeFirst.mockResolvedValueOnce(mockUsers.student)

    const userData = {
      username: 'newuser',
      email: 'student@edu.uiz.ac.ma', // Already exists
      phoneNumber: '+212612345678',
      role: 'student',
      password: 'password123',
    }

    const request = createMockRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(409)
    expect(data.error).toContain('already exists')
  })

  it('should accept valid user roles', async () => {
    const roles = [
      'student',
      'teacher',
      'contributor',
      'administrator',
      'developer',
    ]

    for (const role of roles) {
      // Mock auth for each iteration
      vi.mocked(auth).mockResolvedValueOnce(createMockSession())

      // Mock no existing user and successful creation for each iteration
      mockQuery.executeTakeFirst
        .mockResolvedValueOnce(undefined) // No existing user
        .mockResolvedValueOnce({ ...mockUsers.admin, role }) // Created user with role

      const userData = {
        username: 'newuser',
        email: 'newuser@edu.uiz.ac.ma',
        phoneNumber: '+212612345678',
        role,
        password: 'password123',
      }

      const request = createMockRequest('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    }
  })

  it('should reject invalid roles', async () => {
    vi.mocked(auth).mockResolvedValueOnce(createMockSession())

    const userData = {
      username: 'newuser',
      email: 'newuser@edu.uiz.ac.ma',
      phoneNumber: '+212612345678',
      role: 'invalid_role',
      password: 'password123',
    }

    const request = createMockRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    const response = await POST(request)
    const data = await extractJsonFromResponse(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid data')
  })

  it('should accept optional permissions', async () => {
    vi.mocked(auth).mockResolvedValueOnce(createMockSession())

    mockQuery.executeTakeFirst
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ ...mockUsers.admin })

    const userData = {
      username: 'newuser',
      email: 'newuser@edu.uiz.ac.ma',
      phoneNumber: '+212612345678',
      role: 'administrator',
      password: 'password123',
      permissions: {
        MANAGE_SPONSORS: 1,
        MANAGE_USERS: 1,
      },
    }

    const request = createMockRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    const response = await POST(request)
    const _data = await extractJsonFromResponse(response)

    expect(response.status).toBe(201)
    expect(mockQuery.values).toHaveBeenCalledWith(
      expect.objectContaining({
        permissions: userData.permissions,
      }),
    )
  })
})
