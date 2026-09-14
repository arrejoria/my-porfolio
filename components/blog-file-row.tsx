'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/provider'
import type { PostDoc } from '@/lib/payload/types'
import { pickContent } from '@/lib/homepage/sections'

/**
 * One row of the "fichero" (file-record) blog list — the whole row is the
 * link, laid out as index number | title+topic stack | date pill, and
 * inverts to a solid block on hover (this site's standard "Negativo" hover
 * language). Shared between the home teaser and the /blog archive so the
 * markup only lives in one place.
 */
export function BlogFileRow({ post, index }: { post: PostDoc; index: number }) {
  const { locale } = useI18n()
  const title = pickContent(post.title, locale)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-5 bg-background p-6 transition-colors duration-[0.4s] ease-[cubic-bezier(.16,1,.3,1)] hover:bg-foreground hover:text-background"
    >
      <span className="font-mono text-[1.6rem] text-muted-foreground group-hover:text-background/70">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="min-w-0">
        <h3 className="font-sans text-lg font-bold text-balance">{title}</h3>
        {post.category && (
          <span className="mt-1.5 block font-mono text-xs tracking-wide uppercase text-muted-foreground group-hover:text-background/70">
            {post.category}
          </span>
        )}
      </span>

      <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1.5 text-[0.65rem] tracking-wider text-muted-foreground whitespace-nowrap group-hover:border-background/40 group-hover:text-background/70">
        <span className="size-[5px] animate-pulse rounded-full bg-current" />
        {new Date(post.createdAt).toLocaleDateString(locale, { timeZone: 'UTC' })}
      </span>
    </Link>
  )
}
