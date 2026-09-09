import type { Block } from 'payload'
import { bilingual } from './shared'

// Homepage-only content for the Blog section. This block does NOT affect
// app/(site)/blog's own page header (t.blog.title / .subtitle in
// lib/i18n/dictionary.ts) — the two are intentionally independent, with no
// synchronization between them.
export const BlogBlock: Block = {
  slug: 'blog',
  interfaceName: 'BlogBlock',
  fields: [
    bilingual('eyebrow', false, 'Homepage only. Does not change the /blog page header.'),
    bilingual('title', false, 'Homepage only. Does not change the /blog page header.'),
    bilingual('subtitle', true, 'Homepage only. Does not change the /blog page header.'),
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
