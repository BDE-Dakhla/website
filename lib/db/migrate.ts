import type { Database } from '@/types/schema'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
  sql,
} from 'kysely'
import { Pool } from 'pg'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const cmd = process.argv[2]

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})

async function main() {
  if (cmd === 'reset') {
    await sql`drop schema if exists public cascade`.execute(db)
    await sql`create schema public`.execute(db)
    await sql`create extension if not exists pgcrypto`.execute(db) // needed when gen_random_uuid() is used
  }

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../db/migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  for (const it of results ?? []) {
    console.log(`${it.status === 'Success' ? '✔' : '·'} ${it.migrationName}`)
    //@ts-expect-error
    if (it.status === 'Error') console.error(it.error)
  }

  if (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }

  await db.destroy()
}

main().catch(async (e) => {
  console.error(e)
  await db.destroy()
  process.exit(1)
})
