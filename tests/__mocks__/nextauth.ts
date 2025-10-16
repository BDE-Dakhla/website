import { vi } from 'vitest'
import type { Session } from 'next-auth'

export function mockAuth(session: Session | null = null) {
  return vi.fn().mockResolvedValue(session)
}

export function createMockAuth() {
  return {
    auth: mockAuth(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    handlers: { GET: vi.fn(), POST: vi.fn() },
  }
}
