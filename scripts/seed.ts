if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env.local and set DATABASE_URL before running `pnpm db:seed`.',
  )
}

import { db, pool } from '../lib/db'
import { posts } from '../lib/db/schema'

// No real auth user exists yet in local dev seeding, so posts are attached
// to a fake placeholder id instead of a real `user.id` foreign key value.
const SEED_USER_ID = 'seed-user'

const seedPosts = [
  {
    userId: SEED_USER_ID,
    slug: 'hello-world',
    title: 'Hello World',
    excerpt: 'The first post on this blog.',
    content: 'This is the content of the first seeded post.',
    published: true,
  },
  {
    userId: SEED_USER_ID,
    slug: 'building-with-drizzle',
    title: 'Building with Drizzle',
    excerpt: 'Notes on setting up Drizzle ORM with Postgres.',
    content: 'This is the content of the second seeded post.',
    published: true,
  },
  {
    userId: SEED_USER_ID,
    slug: 'draft-post',
    title: 'Draft Post',
    excerpt: 'A post still being worked on.',
    content: 'This is an unpublished draft post.',
    published: false,
  },
]

async function seed() {
  const inserted = await db
    .insert(posts)
    .values(seedPosts)
    .onConflictDoNothing({ target: posts.slug })
    .returning({ slug: posts.slug })

  const insertedSlugs = new Set(inserted.map((row) => row.slug))
  const skippedSlugs = seedPosts
    .map((post) => post.slug)
    .filter((slug) => !insertedSlugs.has(slug))

  console.log(`Inserted ${inserted.length} post(s): ${[...insertedSlugs].join(', ') || 'none'}`)
  console.log(`Skipped ${skippedSlugs.length} existing post(s): ${skippedSlugs.join(', ') || 'none'}`)
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })
