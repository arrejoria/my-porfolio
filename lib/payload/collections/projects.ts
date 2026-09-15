import type { CollectionConfig } from 'payload'

// Mirrors the old lib/site-data.ts `Project` shape: title stays plain text
// (not bilingual in the original data), description is bilingual.
//
// payload-i18n-migration (A3): `description` used to be a `group` field with
// hand-authored `es`/`en` sub-fields. It is now a native `localized: true`
// scalar — Payload's `localization` config (payload.config.ts) stores
// per-locale values in a satellite `cms_projects_locales` table instead of
// an `_es`/`_en` group. The field name is unchanged on purpose so
// `pickContent()` call sites don't need a rename (design D3). `required:
// true` is still honored, but Payload only enforces it for the locale being
// saved — see lib/payload/types.ts's `AllLocales<T, K>` doc comment (design
// D4) for why a doc can now exist with `es` filled and `en` empty. Replays
// the A1 (case-studies) / A2 (posts) playbook; no richText field here, so a
// single additive migration is sufficient (see
// migrations/*_localize_projects.ts).
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
    { name: 'description', type: 'text', localized: true, required: true },
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
