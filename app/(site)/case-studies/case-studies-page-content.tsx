'use client'

import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/provider'
import type { CaseStudyDoc } from '@/lib/payload/types'
import { pickContent } from '@/lib/homepage/sections'

export function CaseStudiesPageContent({ caseStudies }: { caseStudies: CaseStudyDoc[] }) {
  const { t, locale } = useI18n()

  return (
    <>
      <PageHeader title={t.caseStudies.title} subtitle={t.caseStudies.subtitle} />
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        {caseStudies.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.caseStudies.empty}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {caseStudies.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 outline-none transition-colors hover:border-primary/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <h2 className="font-display text-2xl uppercase tracking-tight">{cs.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {pickContent(cs.summary, locale)}
                </p>
                {cs.tools && cs.tools.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cs.tools.map(({ tool }) => (
                      <Badge key={tool} variant="secondary" className="font-mono text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                )}
                <span className="mt-4 text-sm font-medium text-foreground">
                  {t.caseStudies.readMore}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
