import { readFileSync, readdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import postgres from 'postgres'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function runMigrations() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is required')

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS __schema_migrations (
        id serial PRIMARY KEY,
        name text NOT NULL UNIQUE,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `

    const candidates = [
      join(__dirname, '../../drizzle'),
      join(__dirname, '../drizzle'),
      join(process.cwd(), 'drizzle'),
    ]
    const migrationsDir = candidates.find((p) => existsSync(p))
    if (!migrationsDir) {
      console.warn('No drizzle migrations directory found; skipping SQL migrations')
      return
    }

    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort()

    for (const file of files) {
      const applied = await sql`SELECT 1 FROM __schema_migrations WHERE name = ${file} LIMIT 1`
      if (applied.length > 0) continue

      const body = readFileSync(join(migrationsDir, file), 'utf8')
      console.log(`Applying migration ${file}...`)
      await sql.unsafe(body)
      await sql`INSERT INTO __schema_migrations (name) VALUES (${file})`
      console.log(`Applied migration ${file}`)
    }
  } finally {
    await sql.end({ timeout: 5 })
  }
}
