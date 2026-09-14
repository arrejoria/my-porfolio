import type { CollectionConfig } from 'payload'

// payload-i18n-migration (A2): `title`/`excerpt`/`content` used to be
// `group` fields with hand-authored `es`/`en` sub-fields. They are now
// native `localized: true` scalars — Payload's `localization` config
// (payload.config.ts) stores per-locale values in a satellite
// `cms_posts_locales` table instead of `_es`/`_en` columns. Field names are
// unchanged on purpose so `doc.title[locale]` / `pick()` / `pickContent()`
// call sites don't need a rename (design D3, replayed from the A1
// case-studies pilot). `required: true` is still honored, but Payload only
// enforces it for the locale being saved — see lib/payload/types.ts's
// `AllLocales<T, K>` doc comment (design D4) for why a doc can now exist
// with `es` filled and `en` empty.
export const Posts: CollectionConfig = {
  slug: 'posts',
  dbName: 'cms_posts',
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'excerpt', type: 'text', localized: true, required: true },
    {
      name: 'category',
      type: 'text',
    },
    { name: 'content', type: 'richText', localized: true, required: true },
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
