import type { CollectionConfig } from 'payload'

// Mirrors the old lib/site-data.ts `Project` shape: title stays plain text
// (not bilingual in the original data), description is bilingual.
export const Projects: CollectionConfig = {
  slug: 'projects',
  dbName: 'cms_projects',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'group',
      fields: [
        { name: 'es', type: 'text', required: true },
        { name: 'en', type: 'text', required: true },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        { name: 'tag', type: 'text', required: true },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'liveUrl',
      type: 'text',
    },
    {
      name: 'repoUrl',
      type: 'text',
    },
  ],
}
