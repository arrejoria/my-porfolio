if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Load the right env file before running `pnpm db:reset`.',
  )
}

import { Pool } from 'pg'

// Drops EVERYTHING in the target database's public schema — Better Auth's
// tables, every Payload collection/rels/preferences table, all of it — then
// recreates an empty schema. This is intentionally a full nuke rather than
// an enumerated table list: Payload generates its own internal tables
// (relationship join tables, `payload_preferences`, `payload_migrations`,
// etc.) that aren't declared anywhere in this codebase, so listing them by
// name would silently drift out of date. Only ever invoked by
// `init.sh --reset`, which gates this behind an interactive confirmation
// (typed project name in --prod) before calling it.
async function resetSchema() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
    console.log('Dropped and recreated the public schema.')
  } finally {
    await pool.end()
  }
}

resetSchema().catch((error) => {
  console.error('Reset failed:', error)
  process.exitCode = 1
})
