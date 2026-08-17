import { defineConfig } from 'drizzle-kit'

// `generate` only reads the schema statically and needs no live connection,
// so we don't throw here for a missing DATABASE_URL — commands that do need
// one (migrate, push, studio) will fail on their own with drizzle-kit's
// connection error when DATABASE_URL is unset or unreachable.
export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
})
