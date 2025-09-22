import fs from 'node:fs'
import path from 'node:path'
import { config } from 'dotenv'
import { Kysely, PostgresDialect, sql } from 'kysely'
import { Pool } from 'pg'

config()

async function migrate() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')

  const db = new Kysely({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString }),
    }),
  })

  const sqlPath = path.join(process.cwd(), 'migrations', '001_init.sql')
  const sqlText = fs.readFileSync(sqlPath, 'utf8')

  // Very simple migrator: run once. Use IF NOT EXISTS in SQL to keep idempotent.
  await sql.raw(sqlText).execute(db)

  await db.destroy()
  console.log('Migration done.')
}

migrate().catch((e) => {
  console.error(e)
  process.exit(1)
})
