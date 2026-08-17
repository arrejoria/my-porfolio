'use client'

import { SocialLinks } from '@/components/social-links'
import { useI18n } from '@/lib/i18n/provider'
import { profile } from '@/lib/site-data'

export function SiteFooter() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6">
        <SocialLinks />
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
          <span>
            &copy; {year} {profile.name}
          </span>
          <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />
          <span>{t.footer.builtWith}</span>
        </div>
      </div>
    </footer>
  )
}
