'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { GithubIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/provider'
import type { CaseStudyDoc } from '@/lib/payload/types'

export function CaseStudyContent({ caseStudy }: { caseStudy: CaseStudyDoc }) {
  const { t, locale } = useI18n()
  // `content` is richText (lexical), so `pickContent()` (string-only, design
  // D4) doesn't apply — same es-fallback intent, applied by hand: no
  // lib/i18n/dictionary.ts entry exists for case-study body copy, so an
  // unset `en` falls back to `es` instead of rendering a blank article.
  const content = caseStudy.content?.[locale] ?? caseStudy.content?.es

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 md:py-20">
      <Link
        href="/case-studies"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t.caseStudies.back}
      </Link>
      <h1 className="mt-6 text-balance font-display text-4xl uppercase tracking-tight sm:text-5xl">
        {caseStudy.title}
      </h1>
      {caseStudy.tools && caseStudy.tools.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {caseStudy.tools.map(({ tool }) => (
            <Badge key={tool} variant="secondary" className="font-mono text-xs">
              {tool}
            </Badge>
          ))}
        </div>
      )}
      {(caseStudy.repoUrl || caseStudy.demoUrl) && (
        <div className="mt-6 flex items-center gap-4 text-sm">
          {caseStudy.demoUrl && (
            <a
              href={caseStudy.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
            >
              {t.caseStudies.demo}
              <ArrowUpRight className="size-4" />
            </a>
          )}
          {caseStudy.repoUrl && (
            <a
              href={caseStudy.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-4" />
              {t.caseStudies.code}
            </a>
          )}
        </div>
      )}
      <div className="mt-10 max-w-none text-pretty leading-relaxed [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:uppercase [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:uppercase [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
        {content && <RichText data={content} />}
      </div>
    </article>
  )
}
