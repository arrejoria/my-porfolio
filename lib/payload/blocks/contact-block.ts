import type { Block } from 'payload'
import { bilingual } from './shared'

// Homepage-only content for the Contact section. No eyebrow (Contact never
// renders a numbered ordinal, per design.md) and no limit (this section
// performs no collection query).
export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  fields: [
    bilingual('title', false, 'Homepage only.'),
    bilingual('subtitle', true, 'Homepage only.'),
  ],
}
