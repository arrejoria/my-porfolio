'use client'

import { SocialLinks } from '@/components/social-links'
import { useI18n } from '@/lib/i18n/provider'
import { profile } from '@/lib/site-data'

export function SiteFooter() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-5 px-4 py-5 sm:px-6">
        <span className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground/70">
          &copy; {year} {profile.name} <span className="text-muted-foreground/50">·</span>{' '}
          {t.footer.builtWith}
        </span>

        <div className="flex items-center gap-3.5">
          <SocialLinks subset={2} />
          <span className="h-4 w-px bg-border" aria-hidden />
          <a
            href="#top"
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground/70 transition-colors hover:text-muted-foreground"
          >
            {t.footer.backToTop}
            <span className="inline-block transition-transform duration-150 ease-out group-hover:-translate-y-0.5">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
