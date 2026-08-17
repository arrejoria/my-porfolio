import type { CollectionConfig } from 'payload'

// Payload's own CMS login, fully separate from Better Auth (see lib/auth.ts).
// slug/dbName are both explicit and distinct from every existing table name
// (user, session, account, verification, and the app's own collections) so
// Payload's Postgres adapter can never generate a colliding table.
export const Admins: CollectionConfig = {
  slug: 'admins',
  dbName: 'admins',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
}
