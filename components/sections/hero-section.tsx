'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Code2, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import { prefersReducedMotion } from '@/components/motion/reveal'

export function HeroSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // Above-the-fold entrance: no ScrollTrigger, just a mount-time timeline.
      gsap
        .timeline({ defaults: { opacity: 0, y: 24, duration: 0.7, ease: 'power2.out' } })
        .from('[data-reveal="headline"]', {}, 0)
        .from('[data-reveal="subtitle"]', {}, 0.12)
        .from('[data-reveal="cta"]', { stagger: 0.12 }, 0.24)
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-vignette">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:32px_32px] opacity-40" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 md:py-36">
        <span className="flex size-16 items-center justify-center rounded-xl border border-border bg-background/40 backdrop-blur">
          <Code2 className="size-7 text-primary" />
        </span>

        <h1
          data-reveal="headline"
          className="mt-8 font-display text-6xl uppercase leading-[0.95] tracking-tight text-balance sm:text-7xl md:text-8xl lg:text-9xl"
        >
          {t.hero.role}
        </h1>

        <p
          data-reveal="subtitle"
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground"
        >
          {t.hero.subtitle}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            data-reveal="cta"
            render={<Link href="/portfolio">{t.hero.discover}</Link>}
            size="lg"
            variant="outline"
            className="rounded-full px-7"
          />
          <Button
            data-reveal="cta"
            render={
              <Link href="/contact">
                {t.hero.contact}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            }
            size="lg"
            className="group rounded-full px-7"
          />
        </div>

        <div className="mt-16 h-24 w-px bg-gradient-to-b from-border to-transparent" aria-hidden />
      </div>
    </section>
  )
}
