'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import { blogPreviewPosts } from '@/lib/site-data'

export function BlogSection() {
  const { t, locale } = useI18n()

  return (
    <section id="blog" className="border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <h2 className="font-display text-4xl uppercase tracking-tight sm:text-5xl md:text-6xl">
          {t.blog.title}
        </h2>
        <span className="mt-4 block h-px w-24 bg-primary" />
        <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {t.blog.subtitle}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {blogPreviewPosts.map((post) => (
            <div key={post.slug} className="rounded-2xl border border-border bg-card p-6">
              <p className="font-mono text-xs text-muted-foreground">
                {post.date} · {post.minutes} {t.blog.minRead}
              </p>
              <h3 className="mt-3 font-display text-xl uppercase tracking-tight">
                {post.title[locale]}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt[locale]}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            render={
              <Link href="/blog">
                {t.blog.viewAll}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            }
            variant="outline"
            className="group rounded-full px-7"
          />
        </div>
      </div>
    </section>
  )
}
