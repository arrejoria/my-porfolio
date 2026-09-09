import type { CollectionConfig } from 'payload'
import { BlogBlock } from '../blocks/blog-block'
import { CaseStudiesBlock } from '../blocks/case-studies-block'
import { ContactBlock } from '../blocks/contact-block'

// Lightweight slug registry — records which URL paths exist so the admin
// "View Site" link (SiteSettings.homePage) can point at one of them. This
// collection does NOT drive front-end rendering; app/(site)/** renders its
// own routes independently of these docs. The `layout` field below is
// schema-only for now — it is not yet read by any route or component.
// Wiring it up to actually source homepage section content is follow-up
// work, not part of this change.
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
      admin: {
        description:
          'Homepage sections. Once wired up, reordering will change render order and the ordinal numbers shown next to each section. Hero, Profile and Portfolio are fixed in code and always render first. This field is not yet read by any route, so reordering here currently has no visible effect on the live site.',
      },
    },
  ],
}
