import type { DB } from '@/types/schema'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

let _db: Kysely<DB> | null = null

export function getDb() {
  if (_db) return _db
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')
  _db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString }),
    }),
  })
  return _db
}
