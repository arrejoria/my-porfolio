import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

// Relative imports (not the `@/*` tsconfig alias) so this config loads
// correctly under CLI tools that don't resolve tsconfig path aliases
// (e.g. `payload migrate:create --use-swc`), not just Next.js's bundler.
import { account, session, user, verification } from './lib/db/schema'
import { Admins } from './lib/payload/collections/admins'
import { Media } from './lib/payload/collections/media'
import { Posts } from './lib/payload/collections/posts'
import { Projects } from './lib/payload/collections/projects'
import { ContactSettings } from './lib/payload/globals/contact-settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname, 'app', '(payload)', 'admin'),
    },
  },
  collections: [Admins, Media, Posts, Projects],
  globals: [ContactSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'lib', 'payload', 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    // Better Auth owns the `user`, `session`, `account` and `verification`
    // tables directly (see lib/db/schema.ts) and manages their own migrations.
    // Registering them here via beforeSchemaInit only makes Payload AWARE of
    // them (so its schema diffing doesn't think they're unmanaged/orphaned)
    // without Payload ever creating, altering, or dropping them itself —
    // no collection in this config maps to these slugs/table names.
    beforeSchemaInit: [
      ({ schema }) => ({
        ...schema,
        tables: {
          ...schema.tables,
          user,
          session,
          account,
          verification,
        },
      }),
    ],
  }),
  sharp,
})
