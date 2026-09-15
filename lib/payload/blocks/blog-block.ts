import type { Block } from 'payload'

// Homepage-only content for the Blog section. This block does NOT affect
// app/(site)/blog's own page header (t.blog.title / .subtitle in
// lib/i18n/dictionary.ts) — the two are intentionally independent, with no
// synchronization between them.
//
// payload-i18n-migration (A4): `eyebrow`/`title`/`subtitle` used to be
// `group` fields with hand-authored `es`/`en` sub-fields (the `bilingual()`
// helper, now deleted from ./shared). They are now native `localized: true`
// scalars, same field names, so `pick()` keeps working unchanged (design D3).
export const BlogBlock: Block = {
  slug: 'blog',
  interfaceName: 'BlogBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: { description: 'Homepage only. Does not change the /blog page header.' },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'Homepage only. Does not change the /blog page header.' },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      admin: { description: 'Homepage only. Does not change the /blog page header.' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: {
        description: 'Number of published posts to show on the homepage.',
      },
    },
  ],
}
