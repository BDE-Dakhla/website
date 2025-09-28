import 'dotenv/config'
import type { Kysely } from 'kysely'
import type { Database } from '../../types/schema'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { getDb } from './instance'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const seedsDir = path.join(__dirname, 'seeds')

type SeedModule = {
  seed?: (db: Kysely<Database>) => Promise<void>
  default?: (db: Kysely<Database>) => Promise<void>
}

function sortByNumericPrefix(a: string, b: string) {
  const pa = a.match(/^(\d{3,})/)?.[1]
  const pb = b.match(/^(\d{3,})/)?.[1]
  const na = pa ? parseInt(pa, 10) : Number.POSITIVE_INFINITY
  const nb = pb ? parseInt(pb, 10) : Number.POSITIVE_INFINITY
  if (na !== nb) return na - nb
  return a.localeCompare(b)
}

function normalizeName(file: string) {
  return file.replace(/\.(t|j)sx?$/i, '')
}

async function listSeeds() {
  const files = (await fs.readdir(seedsDir)).filter((f) => /\.[tj]s$/.test(f))
  files.sort(sortByNumericPrefix)
  console.log('Available seeds:')
  for (const f of files) console.log(' -', normalizeName(f))
}

async function runSeed(db: Kysely<Database>, filePath: string, label: string) {
  const mod: SeedModule = await import(pathToFileURL(filePath).href)
  const fn = mod.seed ?? mod.default
  if (typeof fn !== 'function') {
    throw new Error(`Seed "${label}" does not export a seed() function`)
  }
  // one transaction per seed
  await db.transaction().execute(async (trx) => {
    await fn(trx as unknown as Kysely<Database>)
  })
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to run seeds in production.')
  }

  const arg = process.argv[2]?.toLowerCase() ?? 'all'

  if (arg === 'help' || arg === '--help' || arg === '-h') {
    console.log('Usage:')
    console.log(' bun run seed -- list # list seeds')
    console.log(' bun run seed # run all seeds')
    console.log(' bun run seed -- sponsors # run specific seed (fuzzy match)')
    process.exit(0)
  }

  const db = getDb()

  try {
    if (arg === 'list') {
      await listSeeds()
      return
    }

    const files = (await fs.readdir(seedsDir)).filter((f) => /\.[tj]s$/.test(f))
    files.sort(sortByNumericPrefix)

    if (arg === 'all') {
      for (const f of files) {
        const fp = path.join(seedsDir, f)
        const label = normalizeName(f)
        console.log(`→ Running seed: ${label}`)
        await runSeed(db, fp, label)
        console.log(`✔ Done: ${label}`)
      }
      return
    }

    // fuzzy match by substring in filename (without extension)
    const match = files.find((f) =>
      normalizeName(f).toLowerCase().includes(arg),
    )

    if (!match) {
      console.error(
        `No seed matched "${arg}". Try "bun run lib/db/seed.ts list".`,
      )
      process.exit(1)
    }

    const fp = path.join(seedsDir, match)
    const label = normalizeName(match)
    console.log(`→ Running seed: ${label}`)
    await runSeed(db, fp, label)
    console.log(`✔ Done: ${label}`)
  } finally {
    if (typeof db.destroy === 'function') await db.destroy()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
