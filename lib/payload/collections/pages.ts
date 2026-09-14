import type { BlocksFieldValidation, CollectionConfig } from 'payload'
import { BlogBlock } from '../blocks/blog-block'
import { CaseStudiesBlock } from '../blocks/case-studies-block'
import { ContactBlock } from '../blocks/contact-block'

// Payload's `blocks` field doesn't support a per-block-type row limit
// natively — `maxRows` caps the total row count, not rows per type. Without
// this, an admin could add two `caseStudies` blocks, and resolveHomeSections
// would render two <section id="case-studies"> elements (invalid HTML,
// breaks #case-studies anchor navigation).
export const validateUniqueBlockTypes: BlocksFieldValidation = (value) => {
  if (!Array.isArray(value)) return true
  const seen = new Set<string>()
  for (const block of value) {
    const blockType = (block as { blockType?: unknown } | null)?.blockType
    if (typeof blockType !== 'string') continue
    if (seen.has(blockType)) {
      return `Only one "${blockType}" block is allowed in this layout.`
    }
    seen.add(blockType)
  }
  return true
}

// Lightweight slug registry — records which URL paths exist so the admin
// "View Site" link (SiteSettings.homePage) can point at one of them. This
// collection does NOT drive front-end routing; app/(site)/** renders its
// own routes independently of these docs. The `layout` field below DOES
// drive homepage content, though: resolveHomeSections (lib/homepage/
// sections.ts) reads it to render the Case Studies, Blog and Contact
// sections on the live site. The page is force-dynamic, so edits here take
// effect immediately. Removing ONE block type removes that section from
// the homepage entirely. Removing ALL of them (layout ends up empty) is
// treated the same as "never configured" — the homepage falls back to the
// default 3-section layout with dictionary copy, it does not go blank.
// The seed script (scripts/seed.ts, run via `pnpm db:seed` or
// `./init.sh --reset --seed`) provisions this doc with all 3 blocks
// populated by default; that's the actual safety net for "I deleted
// everything", not runtime fallback logic here.
export const Pages: CollectionConfig = {
  slug: 'pages',
  dbName: 'cms_pages',
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
      admin: {
        description: "URL path for this page, e.g. '/' or '/portfolio'.",
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [CaseStudiesBlock, BlogBlock, ContactBlock],
      validate: validateUniqueBlockTypes,
      admin: {
        description:
          'Homepage sections. Reordering changes render order and the ordinal numbers shown next to each section, and takes effect immediately on the live site. Hero, Profile and Portfolio are fixed in code and always render first. Removing one block removes that section from the homepage. Removing all of them resets the homepage to its default content instead of leaving it blank.',
      },
    },
  ],
}
