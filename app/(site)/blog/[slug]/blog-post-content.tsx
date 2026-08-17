'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { useI18n } from '@/lib/i18n/provider'
import type { PostDoc } from '@/lib/payload/types'

export function BlogPostContent({ post }: { post: PostDoc }) {
  const { t, locale } = useI18n()

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 md:py-20">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t.blog.back}
      </Link>
      <h1 className="mt-6 text-balance font-display text-4xl uppercase tracking-tight sm:text-5xl">
        {post.title[locale]}
      </h1>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        {t.blog.publishedOn} {new Date(post.createdAt).toLocaleDateString(locale)}
      </p>
      <div className="mt-10 max-w-none text-pretty leading-relaxed [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:uppercase [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:uppercase [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
        <RichText data={post.content[locale]} />
      </div>
    </article>
  )
}
