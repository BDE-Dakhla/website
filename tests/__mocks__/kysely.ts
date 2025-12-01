import type { Codegen, KyselyAuth } from '@auth/kysely-adapter'
import type { Database } from '@/types/schema'
import { vi } from 'vitest'

export function createMockKyselyQuery() {
  const mockQuery = {
    selectFrom: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    selectAll: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    whereRef: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
    executeTakeFirst: vi.fn().mockResolvedValue(undefined),
    executeTakeFirstOrThrow: vi.fn().mockResolvedValue({}),
    insertInto: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    returningAll: vi.fn().mockReturnThis(),
    updateTable: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    deleteFrom: vi.fn().mockReturnThis(),
  }
  return mockQuery
}

export function createMockDb() {
  const mockQuery = createMockKyselyQuery()

  return {
    selectFrom: mockQuery.selectFrom,
    insertInto: mockQuery.insertInto,
    updateTable: mockQuery.updateTable,
    deleteFrom: mockQuery.deleteFrom,
  } as unknown as KyselyAuth<Database, Codegen>
}

export function mockGetDb() {
  return vi.fn(() => createMockDb())
}
