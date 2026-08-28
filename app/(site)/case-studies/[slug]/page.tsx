import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload/get-payload'
import type { CaseStudyDoc } from '@/lib/payload/types'
import { CaseStudyContent } from './case-study-content'

// See app/(site)/page.tsx for why this is forced dynamic.
export const dynamic = 'force-dynamic'

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
  })

  const caseStudy = docs[0] as CaseStudyDoc | undefined
  if (!caseStudy) notFound()

  return <CaseStudyContent caseStudy={caseStudy} />
}
