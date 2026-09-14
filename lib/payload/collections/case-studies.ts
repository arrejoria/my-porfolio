import type { CollectionConfig } from 'payload'

// payload-i18n-migration (A1, pilot slice): `summary`/`content`/`result` used
// to be `group` fields with hand-authored `es`/`en` sub-fields. They are now
// native `localized: true` scalars — Payload's `localization` config
// (payload.config.ts) stores per-locale values in a satellite
// `cms_case_studies_locales` table instead of `_es`/`_en` columns. Field
// names are unchanged on purpose so `doc.summary[locale]` / `pick()` /
// `pickContent()` call sites don't need a rename (design D3). `required:
// true` is still honored, but Payload only enforces it for the locale being
// saved — see lib/payload/types.ts's `AllLocales<T, K>` doc comment (design
// D4) for why a doc can now exist with `es` filled and `en` empty.
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  dbName: 'cms_case_studies',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'summary', type: 'text', localized: true, required: true },
    { name: 'content', type: 'richText', localized: true, required: true },
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
    { name: 'result', type: 'text', localized: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'repoUrl', type: 'text' },
    { name: 'demoUrl', type: 'text' },
    { name: 'published', type: 'checkbox', defaultValue: false },
  ],
}
