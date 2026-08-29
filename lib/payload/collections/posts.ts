import type { CollectionConfig } from 'payload'

// Bilingual fields are modeled as a `group` with `es`/`en` sub-fields rather
// than Payload's native `localization`, so they mirror the shape the app's
// custom lib/i18n system already expects (see lib/i18n/dictionary.ts).
export const Posts: CollectionConfig = {
  slug: 'posts',
  dbName: 'cms_posts',
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name: 'title',
      type: 'group',
      fields: [
        { name: 'es', type: 'text', required: true },
        { name: 'en', type: 'text', required: true },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'excerpt',
      type: 'group',
      fields: [
        { name: 'es', type: 'text', required: true },
        { name: 'en', type: 'text', required: true },
      ],
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'content',
      type: 'group',
      fields: [
        { name: 'es', type: 'richText', required: true },
        { name: 'en', type: 'richText', required: true },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
