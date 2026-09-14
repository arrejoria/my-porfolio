import { getPayload } from '@/lib/payload/get-payload'
import type { PostDoc } from '@/lib/payload/types'
import type { HomeSection } from '@/lib/homepage/sections'
import { BlogSectionClient } from './blog-section-client'

type BlogHomeSection = Extract<HomeSection, { kind: 'blog' }>

export async function BlogSection({ block }: { block: BlogHomeSection }) {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { published: { equals: true } },
    limit: block.limit,
    sort: '-createdAt',
  })

  return <BlogSectionClient posts={docs as PostDoc[]} block={block} />
}
