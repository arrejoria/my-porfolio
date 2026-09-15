import type { Block } from 'payload'

// Homepage-only content for the Contact section. No eyebrow (Contact never
// renders a numbered ordinal, per design.md) and no limit (this section
// performs no collection query).
//
// payload-i18n-migration (A4): `title`/`subtitle` used to be `group` fields
// with hand-authored `es`/`en` sub-fields (the `bilingual()` helper, now
// deleted from ./shared). They are now native `localized: true` scalars,
// same field names, so `pick()` keeps working unchanged (design D3).
export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'Homepage only.' },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      admin: { description: 'Homepage only.' },
    },
  ],
}
