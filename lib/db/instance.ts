import type { Database as AuthDb } from '@auth/kysely-adapter'
import type { Database } from '@/types/schema'
import { type Codegen, KyselyAuth } from '@auth/kysely-adapter'
import { type Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

let _db: KyselyAuth<Database, Codegen> | null = null

export function getDb(): KyselyAuth<Database, Codegen> {
  if (_db) return _db
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')

  _db = new KyselyAuth<Database, Codegen>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString }),
    }),
  })
  return _db
}

export function getAuthDb(): Kysely<AuthDb> {
  return getDb() as unknown as Kysely<AuthDb>
}
