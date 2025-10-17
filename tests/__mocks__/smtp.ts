import { vi } from 'vitest'

export function mockSendSmtpMail() {
  return vi.fn().mockResolvedValue({
    messageId: 'test-message-id@localhost',
  })
}

export function createMockSmtpSocket() {
  return { write: vi.fn(), on: vi.fn(), destroy: vi.fn() }
}
