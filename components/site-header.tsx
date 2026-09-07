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
import type { PostDoc } from '@/lib/payload/types'

export function SiteHeader({ latestPost }: { latestPost: PostDoc | null }) {
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
    // The backdrop/dialog below are deliberately siblings of <header>, not
    // descendants: <header> has backdrop-blur-md, and per spec any
    // backdrop-filter/filter/transform on an ancestor becomes the containing
    // block for position:fixed descendants — nesting the overlay inside
    // <header> would size `inset-0` against the 64px header box instead of
    // the viewport.
    <>
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
      </header>

        {/* Backdrop */}
        <div
          aria-hidden={!open}
          onClick={() => setOpen(false)}
          className={cn(
            'fixed inset-0 z-[95] bg-black/50',
            reduceMotion ? 'transition-none' : 'transition-opacity duration-300 ease-out',
            open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          )}
        />

        {/* Menu panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menu}
          aria-hidden={!open}
          className={cn(
            'fixed inset-0 z-[96] flex items-center justify-center p-4',
            open ? 'pointer-events-auto' : 'pointer-events-none',
          )}
        >
          <div
            className={cn(
              'flex max-h-[85vh] w-full max-w-3xl flex-col overflow-y-auto rounded-3xl border border-border bg-popover p-[clamp(1.1rem,3vw,2rem)] text-popover-foreground shadow-2xl',
              reduceMotion
                ? 'transition-none'
                : 'transition-[opacity,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
              open ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.98] opacity-0',
            )}
          >
            <div className="flex items-center justify-between">
              <BrandLogo />
              <button
                type="button"
                className="flex size-[2.4rem] items-center justify-center rounded-full border border-border transition-colors duration-300 hover:bg-foreground hover:text-background"
                aria-label={t.nav.closeMenu}
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_1fr]">
              <nav className="group flex flex-col gap-1" aria-label={t.nav.mainLabel}>
                {nav.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-baseline gap-3 font-display text-2xl leading-tight font-extrabold uppercase transition-[opacity,transform] duration-300 ease-out sm:text-3xl',
                      'group-hover:opacity-40 hover:!opacity-100 hover:translate-x-[0.2em]',
                    )}
                  >
                    <span className="font-mono text-xs font-medium opacity-50">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                    {isActive(item.href) && (
                      <span className="self-center h-px w-4 bg-current" aria-hidden />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col rounded-2xl border border-border bg-background/50 p-5">
                <span className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-muted-foreground">
                  {t.nav.latestPost}
                </span>

                {latestPost ? (
                  <Link
                    href={`/blog/${latestPost.slug}`}
                    onClick={() => setOpen(false)}
                    className="group mt-3 flex flex-1 flex-col justify-between gap-4"
                  >
                    <span>
                      <h3 className="text-balance font-sans text-lg font-bold transition-colors group-hover:text-primary">
                        {latestPost.title[locale]}
                      </h3>
                      <span className="mt-2 block text-sm text-muted-foreground">
                        {new Date(latestPost.createdAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          timeZone: 'UTC',
                        })}
                      </span>
                    </span>
                    <span className="font-mono text-xs tracking-wide uppercase text-muted-foreground group-hover:text-foreground">
                      {t.blog.readMore} →
                    </span>
                  </Link>
                ) : (
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{t.blog.comingSoon}</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <div className="flex flex-col gap-2">
                <span className="text-[0.66rem] tracking-[0.1em] uppercase text-muted-foreground">
                  {t.nav.theme}
                </span>
                <div className="inline-flex gap-[0.4rem]">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={cn(
                      'rounded-full border border-border px-3 py-[0.32rem] font-mono text-[0.63rem] tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background',
                      mounted && !isDark && 'bg-foreground text-background',
                    )}
                  >
                    {t.nav.light}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'rounded-full border border-border px-3 py-[0.32rem] font-mono text-[0.63rem] tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background',
                      mounted && isDark && 'bg-foreground text-background',
                    )}
                  >
                    {t.nav.dark}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[0.66rem] tracking-[0.1em] uppercase text-muted-foreground">
                  {t.nav.language}
                </span>
                <div className="inline-flex gap-[0.4rem]">
                  <button
                    type="button"
                    onClick={() => locale !== 'es' && toggleLocale()}
                    className={cn(
                      'rounded-full border border-border px-3 py-[0.32rem] font-mono text-[0.63rem] tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background',
                      locale === 'es' && 'bg-foreground text-background',
                    )}
                  >
                    ES
                  </button>
                  <button
                    type="button"
                    onClick={() => locale !== 'en' && toggleLocale()}
                    className={cn(
                      'rounded-full border border-border px-3 py-[0.32rem] font-mono text-[0.63rem] tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background',
                      locale === 'en' && 'bg-foreground text-background',
                    )}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}
