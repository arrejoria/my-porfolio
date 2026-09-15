import { PortfolioPageContent } from './portfolio-page-content'
import { getPayload } from '@/lib/payload/get-payload'
import type { ProjectDoc } from '@/lib/payload/types'

// See app/(site)/page.tsx for why this is forced dynamic.
export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'projects',
    limit: 100,
    depth: 1,
    sort: '-createdAt',
    locale: 'all',
  })

  return <PortfolioPageContent projects={docs as ProjectDoc[]} />
}
