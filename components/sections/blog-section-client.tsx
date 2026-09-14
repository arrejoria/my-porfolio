'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import type { PostDoc } from '@/lib/payload/types'
import type { HomeSection } from '@/lib/homepage/sections'
import { pick } from '@/lib/homepage/sections'
import { Reveal } from '@/components/motion/reveal'

type BlogHomeSection = Extract<HomeSection, { kind: 'blog' }>

export function BlogSectionClient({ posts, block }: { posts: PostDoc[]; block: BlogHomeSection }) {
  const { t, locale } = useI18n()
  const eyebrow = pick(block.eyebrow, locale, t.blog.eyebrow)
  const title = pick(block.title, locale, t.blog.title)
  const subtitle = pick(block.subtitle, locale, t.blog.subtitle)

  return (
    <section id="blog" className="border-t border-border/60">
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground before:h-px before:w-[22px] before:bg-muted-foreground before:content-['']">
          {eyebrow}{' '}
          <b className="font-medium tabular-nums text-foreground/80">
            / {String(block.number).padStart(2, '0')}
          </b>
        </p>
        <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
          {title}
        </h2>
        <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {subtitle}
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 text-sm text-muted-foreground">{t.blog.empty}</p>
        ) : (
          <div className="mt-12 border-t border-border">
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative grid grid-cols-[36px_1fr] items-center gap-x-5 gap-y-2.5 border-b border-border px-1 py-6 transition-colors hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:outline-none sm:grid-cols-[60px_1fr_auto] sm:px-4"
              >
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 w-0.5 origin-center scale-y-[0.4] bg-primary opacity-0 transition-all duration-200 ease-out group-hover:scale-y-100 group-hover:opacity-100 group-focus-visible:scale-y-100 group-focus-visible:opacity-100"
                  aria-hidden="true"
                />

                <span className="font-mono text-2xl text-muted-foreground/70 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0">
                  <h3 className="font-serif-display text-lg tracking-tight text-foreground">
                    {post.title[locale]}
                  </h3>
                  {post.category && (
                    <span className="mt-1.5 block font-mono text-xs tracking-wide text-muted-foreground uppercase">
                      {post.category}
                    </span>
                  )}
                </span>

                <span className="col-span-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11.5px] whitespace-nowrap text-muted-foreground sm:col-span-1">
                  <span className="size-[5px] shrink-0 rounded-full bg-muted-foreground/70" aria-hidden="true" />
                  {new Date(post.createdAt).toLocaleDateString(locale, { timeZone: 'UTC' })}
                </span>
              </Link>
            ))}

            <div className="flex items-center gap-x-5 border-b border-border px-1 py-6 sm:px-4">
              <span className="font-mono text-2xl text-muted-foreground/50 tabular-nums">··</span>
              <span className="font-mono text-sm text-muted-foreground/70 italic">
                {t.blog.moreComing}
              </span>
            </div>
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
