'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import type { CaseStudyDoc } from '@/lib/payload/types'
import { Reveal } from '@/components/motion/reveal'

export function CaseStudiesSectionClient({ caseStudies }: { caseStudies: CaseStudyDoc[] }) {
  const { t, locale } = useI18n()

  return (
    <section id="case-studies" className="border-t border-border/60">
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground before:h-px before:w-[22px] before:bg-muted-foreground before:content-['']">
          {t.caseStudies.eyebrow} <b className="font-medium tabular-nums text-foreground/80">/ 03</b>
        </p>
        <h2 className="font-serif-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
          {t.caseStudies.title}
        </h2>
        <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {t.caseStudies.subtitle}
        </p>

        {caseStudies.length === 0 ? (
          <p className="mt-12 text-sm text-muted-foreground">{t.caseStudies.empty}</p>
        ) : (
          <div className="mt-12 border-t border-border">
            {caseStudies.map((cs, i) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="group relative grid grid-cols-1 gap-4 border-b border-border px-1 py-7 transition-colors hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:outline-none sm:grid-cols-[92px_1fr_232px] sm:gap-7 sm:px-4 sm:py-8"
              >
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 w-0.5 origin-center scale-y-[0.4] bg-primary opacity-0 transition-all duration-200 ease-out group-hover:scale-y-100 group-hover:opacity-100 group-focus-visible:scale-y-100 group-focus-visible:opacity-100"
                  aria-hidden="true"
                />

                <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-3.5">
                  <span className="font-mono text-xs tracking-[0.06em] text-muted-foreground tabular-nums">
                    CASE
                    <b className="mt-0.5 block text-2xl font-medium tracking-normal text-foreground/80">
                      {String(i + 1).padStart(2, '0')}
                    </b>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
                    <span
                      className={`size-1.5 shrink-0 rounded-full ${cs.status === 'live' ? 'bg-foreground' : 'bg-muted-foreground'}`}
                      aria-hidden="true"
                    />
                    {cs.status === 'live' ? t.caseStudies.statusLive : t.caseStudies.statusInProgress}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-display text-xl font-medium tracking-tight text-foreground">
                    {cs.title}
                  </h3>
                  <p className="mt-2.5 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
                    {cs.summary[locale]}
                  </p>
                  {cs.result?.[locale] && (
                    <span className="mt-3.5 flex items-center gap-2 font-mono text-xs text-muted-foreground/80">
                      <span aria-hidden="true">→</span>
                      {cs.result[locale]}
                    </span>
                  )}
                </div>

                <div className="flex flex-row items-start justify-between gap-4 sm:flex-col sm:items-end sm:justify-between">
                  {cs.tools && cs.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:justify-end">
                      {cs.tools.slice(0, 4).map(({ tool }) => (
                        <Badge key={tool} variant="secondary" className="font-mono text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                    {t.caseStudies.readMore}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button
            render={
              <Link href="/case-studies">
                {t.caseStudies.viewAll}
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
