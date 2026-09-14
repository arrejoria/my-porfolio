'use client'

import { PageHeader } from '@/components/page-header'
import { useI18n } from '@/lib/i18n/provider'
import type { PostDoc } from '@/lib/payload/types'
import { pickContent } from '@/lib/homepage/sections'
import { Ticker } from '@/components/motion/ticker'
import { BlogFileRow } from '@/components/blog-file-row'

export function BlogPageContent({ posts }: { posts: PostDoc[] }) {
  const { t, locale } = useI18n()
  const tickerItems =
    posts.length > 0 ? posts.map((post) => pickContent(post.title, locale)) : [t.blog.comingSoon]

  return (
    <>
      <PageHeader title={t.blog.title} subtitle={t.blog.subtitle} />
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.blog.empty}</p>
        ) : (
          <>
            <Ticker items={tickerItems} />
            <div className="grid gap-px border border-border bg-border">
              {posts.map((post, i) => (
                <BlogFileRow key={post.slug} post={post} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
