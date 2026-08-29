'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import type { PostDoc } from '@/lib/payload/types'
import { Reveal } from '@/components/motion/reveal'
import { Ticker } from '@/components/motion/ticker'
import { BlogFileRow } from '@/components/blog-file-row'

export function BlogSectionClient({ posts }: { posts: PostDoc[] }) {
  const { t, locale } = useI18n()
  const tickerItems = posts.length > 0 ? posts.map((post) => post.title[locale]) : [t.blog.comingSoon]

  return (
    <section id="blog" className="border-t border-border/60">
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
          {t.blog.title}
        </h2>
        <span className="mt-4 block h-px w-24 bg-primary" aria-hidden="true" />
        <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {t.blog.subtitle}
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 text-sm text-muted-foreground">{t.blog.empty}</p>
        ) : (
          <>
            <div className="mt-12">
              <Ticker items={tickerItems} />
            </div>
            <div className="grid gap-px border border-border bg-border">
              {posts.map((post, i) => (
                <BlogFileRow key={post.slug} post={post} index={i} />
              ))}
            </div>
          </>
        )}

        <div className="mt-10 flex justify-center">
          <Button
            render={
              <Link href="/blog">
                {t.blog.viewAll}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            }
            nativeButton={false}
            variant="outline"
            className="group rounded-full px-7"
          />
        </div>
      </Reveal>
    </section>
  )
}
