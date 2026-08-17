import type { CollectionConfig } from 'payload'

// Lightweight slug registry — records which URL paths exist so the admin
// "View Site" link (SiteSettings.homePage) can point at one of them. This
// collection does NOT drive front-end rendering; app/(site)/** renders its
// own routes independently of these docs.
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
  ],
}
