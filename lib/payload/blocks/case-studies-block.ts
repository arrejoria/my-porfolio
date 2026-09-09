import type { Block } from 'payload'
import { bilingual } from './shared'

// Homepage-only content for the Case Studies section. This block does NOT
// affect app/(site)/case-studies's own page header (t.caseStudies.title /
// .subtitle in lib/i18n/dictionary.ts) — the two are intentionally
// independent, with no synchronization between them.
export const CaseStudiesBlock: Block = {
  slug: 'caseStudies',
  interfaceName: 'CaseStudiesBlock',
  fields: [
    bilingual(
      'eyebrow',
      false,
      'Homepage only. Does not change the /case-studies page header.',
    ),
    bilingual(
      'title',
      false,
      'Homepage only. Does not change the /case-studies page header.',
    ),
    bilingual(
      'subtitle',
      true,
      'Homepage only. Does not change the /case-studies page header.',
    ),
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: {
        description: 'Number of published case studies to show on the homepage.',
      },
    },
  ],
}
