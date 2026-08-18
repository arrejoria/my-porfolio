'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import type { PostDoc } from '@/lib/payload/types'
import { Reveal } from '@/components/motion/reveal'

export function BlogSectionClient({ posts }: { posts: PostDoc[] }) {
  const { t, locale } = useI18n()

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
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <p className="font-mono text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString(locale)}
                </p>
                <h3 className="mt-3 font-display text-xl uppercase tracking-tight">
                  {post.title[locale]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt[locale]}
                </p>
              </Link>
            ))}
          </div>
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
