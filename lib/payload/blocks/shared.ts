import type { Field, GroupField } from 'payload'

// Bilingual fields are modeled as a `group` with `es`/`en` sub-fields rather
// than Payload's native `localization`, so they mirror the shape the app's
// custom lib/i18n system already expects (see lib/i18n/dictionary.ts) and
// the same convention used by lib/payload/collections/case-studies.ts and
// posts.ts. Every sub-field is intentionally optional — optionality is the
// per-field fallback-to-dictionary mechanism for homepage blocks.
//
// `description`, when provided, is surfaced as this group field's
// `admin.description` — used by the homepage blocks to document that their
// content is homepage-only and independent from a collection's own page
// header (see case-studies-block.ts / blog-block.ts).
export const bilingual = (name: string, multiline = false, description?: string): GroupField => {
  const subFields: Field[] = multiline
    ? [
        { name: 'es', type: 'textarea' },
        { name: 'en', type: 'textarea' },
      ]
    : [
        { name: 'es', type: 'text' },
        { name: 'en', type: 'text' },
      ]

  return {
    name,
    type: 'group',
    fields: subFields,
    ...(description ? { admin: { description } } : {}),
  }
}
