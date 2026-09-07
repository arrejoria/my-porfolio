import { getPayload } from '@/lib/payload/get-payload'
import type { ProjectDoc } from '@/lib/payload/types'
import { PortfolioSectionClient } from './portfolio-section-client'

export async function PortfolioSection() {
  const payload = await getPayload()
  const { docs, totalDocs } = await payload.find({
    collection: 'projects',
    limit: 5,
    depth: 1,
    sort: '-createdAt',
  })

  if (docs.length === 0) return null

  return <PortfolioSectionClient projects={docs as ProjectDoc[]} totalCount={totalDocs} />
}
