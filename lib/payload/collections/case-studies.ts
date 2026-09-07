import type { CollectionConfig } from 'payload'

// Bilingual fields are modeled as a `group` with `es`/`en` sub-fields rather
// than Payload's native `localization`, so they mirror the shape the app's
// custom lib/i18n system already expects (see lib/i18n/dictionary.ts).
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  dbName: 'cms_case_studies',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'summary',
      type: 'group',
      fields: [
        { name: 'es', type: 'text', required: true },
        { name: 'en', type: 'text', required: true },
      ],
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
      name: 'tools',
      type: 'array',
      fields: [{ name: 'tool', type: 'text', required: true }],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Live', value: 'live' },
        { label: 'In progress', value: 'in-progress' },
      ],
      defaultValue: 'live',
      required: true,
    },
    {
      name: 'result',
      type: 'group',
      fields: [
        { name: 'es', type: 'text' },
        { name: 'en', type: 'text' },
      ],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'repoUrl', type: 'text' },
    { name: 'demoUrl', type: 'text' },
    { name: 'published', type: 'checkbox', defaultValue: false },
  ],
}
