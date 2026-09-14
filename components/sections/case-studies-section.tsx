import { getPayload } from '@/lib/payload/get-payload'
import type { CaseStudyDoc } from '@/lib/payload/types'
import type { HomeSection } from '@/lib/homepage/sections'
import { CaseStudiesSectionClient } from './case-studies-section-client'

type CaseStudiesHomeSection = Extract<HomeSection, { kind: 'caseStudies' }>

export async function CaseStudiesSection({ block }: { block: CaseStudiesHomeSection }) {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { published: { equals: true } },
    limit: block.limit,
    sort: '-createdAt',
    locale: 'all',
  })

  return <CaseStudiesSectionClient caseStudies={docs as CaseStudyDoc[]} block={block} />
}
