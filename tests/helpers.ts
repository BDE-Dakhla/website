import type { NextRequest } from 'next/server'
import type { PermissionMap, Role } from '@/types/schema'

export function createMockRequest(
  url: string,
  options: RequestInit = {},
): NextRequest {
  const request = new Request(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }) as NextRequest

  // Add Next.js specific properties
  Object.defineProperty(request, 'cookies', {
    value: {
      get: () => ({ get: () => null }),
      getAll: () => [],
      has: () => false,
    },
    writable: false,
  })

  Object.defineProperty(request, 'nextUrl', {
    value: {
      pathname: new URL(url).pathname,
      searchParams: new URL(url).searchParams,
    },
    writable: false,
  })

  Object.defineProperty(request, 'page', {
    value: { params: {} },
    writable: false,
  })

  Object.defineProperty(request, 'ua', {
    value: { get: () => null },
    writable: false,
  })

  return request
}

export function createMockUser(overrides?: {
  id?: string
  email?: string
  role?: Role
  permissions?: PermissionMap
}) {
  return {
    id: overrides?.id || 'user-123',
    email: overrides?.email || 'test@edu.uiz.ac.ma',
    name: 'Test User',
    role: (overrides?.role || 'student') as Role,
    permissions: overrides?.permissions || {},
    username: 'testuser',
    image: null,
  }
}

export function createMockSession(
  userOverrides?: Parameters<typeof createMockUser>[0],
) {
  return {
    user: createMockUser(userOverrides),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }
}

export async function extractJsonFromResponse(response: Response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return { error: 'Invalid JSON response', body: text }
  }
}
