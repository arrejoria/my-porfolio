import { ContactPageContent } from './contact-page-content'
import { getPayload } from '@/lib/payload/get-payload'
import type { ContactSettingsDoc } from '@/lib/payload/types'

// See app/(site)/page.tsx for why this is forced dynamic.
export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const payload = await getPayload()
  const settings = (await payload.findGlobal({
    slug: 'contact-settings',
  })) as ContactSettingsDoc

  return <ContactPageContent settings={settings} />
}
