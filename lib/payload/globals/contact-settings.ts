import type { GlobalConfig } from 'payload'

// Single editable contact CTA (e.g. a WhatsApp link) instead of a contact
// form. `message`, when set, is appended to buttonLink as a WhatsApp
// prefilled-text `?text=` param — see whatsappHref() in lib/payload/types.ts.
export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  fields: [
    {
      name: 'buttonLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'buttonLink',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'text',
    },
  ],
}
