import { getPayload } from '@/lib/payload/get-payload'
import type { CaseStudyDoc } from '@/lib/payload/types'
import { CaseStudiesSectionClient } from './case-studies-section-client'

export async function CaseStudiesSection() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { published: { equals: true } },
    limit: 3,
    sort: '-createdAt',
  })

  return <CaseStudiesSectionClient caseStudies={docs as CaseStudyDoc[]} />
}
