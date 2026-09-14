import { CaseStudiesPageContent } from './case-studies-page-content'
import { getPayload } from '@/lib/payload/get-payload'
import type { CaseStudyDoc } from '@/lib/payload/types'

// See app/(site)/page.tsx for why this is forced dynamic.
export const dynamic = 'force-dynamic'

export default async function CaseStudiesPage() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { published: { equals: true } },
    limit: 100,
    sort: '-createdAt',
    locale: 'all',
  })

  return <CaseStudiesPageContent caseStudies={docs as CaseStudyDoc[]} />
}
