'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { X } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { prefersReducedMotion } from '@/components/motion/reveal'
import { useI18n } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { t, locale, toggleLocale } = useI18n()
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  const [open, setOpen] = useState(false)
  // Same hydration-safe mount gate used in theme-toggle.tsx: the server (and
  // the client's first paint, before hydration) can't know the resolved
  // theme or the OS's reduced-motion preference, so both must render the
  // same deterministic state or React flags a hydration mismatch.
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return

    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const nav = [
    { href: '/', label: t.nav.home },
    { href: '/portfolio', label: t.nav.portfolio },
    { href: '/case-studies', label: t.nav.caseStudies },
    { href: '/blog', label: t.nav.blog },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const isDark = mounted && resolvedTheme === 'dark'
  const reduceMotion = mounted && prefersReducedMotion()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandLogo />

        <button
          type="button"
          className="inline-flex items-center gap-[0.55rem] rounded-full border border-border px-[0.85rem] py-[0.4rem] font-mono text-[0.68rem] tracking-[0.1em] uppercase text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
          aria-label={t.nav.openMenu}
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className="flex flex-col gap-[3px]" aria-hidden>
            <span className="h-[1.5px] w-[13px] bg-current" />
            <span className="h-[1.5px] w-[13px] bg-current" />
          </span>
          {t.nav.menu}
        </button>
      </div>

      <div
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-[95] flex flex-col justify-between bg-foreground p-[clamp(1.1rem,4vw,2.5rem)] text-background',
          reduceMotion
            ? 'transition-none'
            : open
              ? 'transition-[opacity_0.45s_cubic-bezier(.16,1,.3,1)]'
              : 'transition-[opacity_0.45s_cubic-bezier(.16,1,.3,1),visibility_0s_linear_0.45s]',
          open ? 'visible pointer-events-auto opacity-100' : 'invisible pointer-events-none opacity-0',
        )}
      >
        <div className="flex items-center justify-between">
          <BrandLogo inverted />
          <button
            type="button"
            className="flex size-[2.4rem] items-center justify-center rounded-full border border-background transition-colors duration-300 hover:bg-background hover:text-foreground"
            aria-label={t.nav.closeMenu}
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="group flex flex-col gap-[0.1rem]" aria-label={t.nav.mainLabel}>
          {nav.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-baseline gap-4 font-display text-[clamp(2.1rem,8vw,4.8rem)] leading-[1.08] font-extrabold uppercase transition-[opacity,transform] duration-300 ease-out',
                'group-hover:opacity-35 hover:!opacity-100 hover:translate-x-[0.35em]',
              )}
            >
              <span className="font-mono text-[0.85rem] font-medium opacity-50">
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.label}
              {isActive(item.href) && (
                <span className="self-center h-px w-4 bg-background" aria-hidden />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-background/25 pt-[1.4rem]">
          <div className="flex flex-col gap-2">
            <span className="text-[0.66rem] tracking-[0.1em] uppercase opacity-60">
              {t.nav.theme}
            </span>
            <div className="inline-flex gap-[0.4rem]">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={cn(
                  'rounded-full border border-background px-3 py-[0.32rem] font-mono text-[0.63rem] tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-background hover:text-foreground',
                  mounted && !isDark && 'bg-background text-foreground',
                )}
              >
                {t.nav.light}
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={cn(
                  'rounded-full border border-background px-3 py-[0.32rem] font-mono text-[0.63rem] tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-background hover:text-foreground',
                  mounted && isDark && 'bg-background text-foreground',
                )}
              >
                {t.nav.dark}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[0.66rem] tracking-[0.1em] uppercase opacity-60">
              {t.nav.language}
            </span>
            <div className="inline-flex gap-[0.4rem]">
              <button
                type="button"
                onClick={() => locale !== 'es' && toggleLocale()}
                className={cn(
                  'rounded-full border border-background px-3 py-[0.32rem] font-mono text-[0.63rem] tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-background hover:text-foreground',
                  locale === 'es' && 'bg-background text-foreground',
                )}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => locale !== 'en' && toggleLocale()}
                className={cn(
                  'rounded-full border border-background px-3 py-[0.32rem] font-mono text-[0.63rem] tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-background hover:text-foreground',
                  locale === 'en' && 'bg-background text-foreground',
                )}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
