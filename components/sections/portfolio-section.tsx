'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/provider'
import { projects } from '@/lib/site-data'

export function PortfolioSection() {
  const { t, locale } = useI18n()
  const featured = projects[0]

  return (
    <section id="work" className="border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <h2 className="font-display text-4xl uppercase tracking-tight sm:text-5xl md:text-6xl">
          {t.portfolio.title}
        </h2>
        <span className="mt-4 block h-px w-24 bg-primary" />
        <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {t.portfolio.subtitle}
        </p>

        <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-primary/50 md:grid md:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden border-b border-border md:border-b-0 md:border-r">
            <Image
              src={featured.image || '/placeholder.svg'}
              alt={featured.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-10">
            <h3 className="font-display text-2xl uppercase tracking-tight sm:text-3xl">
              {featured.title}
            </h3>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {featured.description[locale]}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {featured.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            render={
              <Link href="/portfolio">
                {t.portfolio.viewAll}
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
