import path from 'node:path'
import type { CollectionConfig } from 'payload'

// Local disk storage only (default adapter behavior via `staticDir`) — no
// cloud storage plugin. Resolved explicitly against process.cwd() (repo root
// in dev, /app in the standalone Docker image, since both run with that as
// their working directory) so the Docker volume mount target is unambiguous.
export const Media: CollectionConfig = {
  slug: 'media',
  dbName: 'media',
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
