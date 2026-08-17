'use client'

import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { useI18n } from '@/lib/i18n/provider'
import type { PostDoc } from '@/lib/payload/types'

export function BlogPageContent({ posts }: { posts: PostDoc[] }) {
  const { t, locale } = useI18n()

  return (
    <>
      <PageHeader title={t.blog.title} subtitle={t.blog.subtitle} />
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.blog.empty}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <p className="font-mono text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString(locale)}
                </p>
                <h2 className="mt-3 font-display text-2xl uppercase tracking-tight">
                  {post.title[locale]}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt[locale]}
                </p>
                <span className="mt-4 text-sm font-medium text-foreground">
                  {t.blog.readMore}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
