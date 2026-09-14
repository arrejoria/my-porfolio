import { BlogPageContent } from './blog-page-content'
import { getPayload } from '@/lib/payload/get-payload'
import type { PostDoc } from '@/lib/payload/types'

// See app/(site)/page.tsx for why this is forced dynamic.
export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { published: { equals: true } },
    limit: 100,
    sort: '-createdAt',
    locale: 'all',
  })

  return <BlogPageContent posts={docs as PostDoc[]} />
}
