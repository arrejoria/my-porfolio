import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload/get-payload'
import type { PostDoc } from '@/lib/payload/types'
import { BlogPostContent } from './blog-post-content'

// See app/(site)/page.tsx for why this is forced dynamic.
export const dynamic = 'force-dynamic'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
  })

  const post = docs[0] as PostDoc | undefined
  if (!post) notFound()

  return <BlogPostContent post={post} />
}
