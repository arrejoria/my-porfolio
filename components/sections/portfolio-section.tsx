import { getPayload } from '@/lib/payload/get-payload'
import type { ProjectDoc } from '@/lib/payload/types'
import { PortfolioSectionClient } from './portfolio-section-client'

export async function PortfolioSection() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'projects',
    limit: 1,
    depth: 1,
    sort: '-createdAt',
  })

  const featured = docs[0] as ProjectDoc | undefined
  if (!featured) return null

  return <PortfolioSectionClient project={featured} />
}
