'use client'

import Link from 'next/link'
import { Code2, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'

export function HeroSection() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden bg-vignette">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:32px_32px] opacity-40" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 md:py-36">
        <span className="flex size-16 items-center justify-center rounded-xl border border-border bg-background/40 backdrop-blur">
          <Code2 className="size-7 text-primary" />
        </span>

        <h1 className="mt-8 font-display text-6xl uppercase leading-[0.95] tracking-tight text-balance sm:text-7xl md:text-8xl lg:text-9xl">
          {t.hero.role}
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
          {t.hero.subtitle}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="outline" className="rounded-full px-7">
            <Link href="/portfolio">{t.hero.discover}</Link>
          </Button>
          <Button asChild size="lg" className="group rounded-full px-7">
            <Link href="/contact">
              {t.hero.contact}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-16 h-24 w-px bg-gradient-to-b from-border to-transparent" aria-hidden />
      </div>
    </section>
  )
}
