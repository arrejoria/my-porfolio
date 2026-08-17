import type { GlobalConfig } from 'payload'

// Site-wide settings consumed by the admin "View Site" link: the display
// name shown in the nav dropdown and which Pages doc counts as home.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Portfolio',
    },
    {
      name: 'homePage',
      type: 'relationship',
      relationTo: 'pages',
      required: true,
      admin: {
        description: 'Page shown when visitors open the site, and used by the admin "View Site" link.',
      },
    },
  ],
}
