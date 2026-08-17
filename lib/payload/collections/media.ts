import type { CollectionConfig } from 'payload'

// Local disk storage only (default adapter behavior via `staticDir`) — no
// cloud storage plugin. Docker volume wiring for persistence is a separate
// follow-up task.
export const Media: CollectionConfig = {
  slug: 'media',
  dbName: 'media',
  upload: {
    staticDir: 'media',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
