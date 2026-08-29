'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/provider'
import { profile } from '@/lib/site-data'

interface BrandLogoProps {
  /**
   * Renders the logo in inverted colors — for use on panels whose background
   * IS the page's normal foreground color (e.g. the color-inverted nav
   * overlay), where the default `text-foreground`/`bg-border` classes would
   * render invisible (foreground-on-foreground).
   */
  inverted?: boolean
}

export function BrandLogo({ inverted = false }: BrandLogoProps) {
  const { t } = useI18n()

  return (
    <Link
      href="/"
      className="group flex items-center gap-2"
      aria-label={`${profile.name} — ${t.nav.home}`}
    >
      <span
        className={`font-display text-3xl leading-none tracking-tight transition-colors ${inverted ? 'text-background' : 'text-foreground group-hover:text-primary'}`}
      >
        {profile.initials}
      </span>
      <span className={`h-8 w-px ${inverted ? 'bg-background/30' : 'bg-border'}`} aria-hidden />
      <span
        className={`flex flex-col font-display leading-[0.85] tracking-wide ${inverted ? 'text-background' : 'text-foreground'}`}
      >
        <span className="text-sm">WEB</span>
        <span className="text-sm">DEVELOPER</span>
      </span>
    </Link>
  )
}
