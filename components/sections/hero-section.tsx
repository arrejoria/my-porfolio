'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Code2, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import { prefersReducedMotion } from '@/components/motion/reveal'

const HERO_MEDIA_FILTER = '[filter:grayscale(1)_brightness(0.45)_contrast(1.1)_blur(2px)]'

export function HeroSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  // Same mount-gated pattern as ThemeToggle: `window.matchMedia` isn't
  // available during SSR, and calling it unconditionally on the first client
  // render (before hydration) would render a different media element than
  // the server did. Gating on `mounted` keeps both renders deterministic.
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  const reducedMotion = mounted && prefersReducedMotion()

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
    <section
      ref={sectionRef}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-vignette"
    >
      {reducedMotion ? (
        <Image
          src="/hero-bg-poster.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className={`pointer-events-none object-cover ${HERO_MEDIA_FILTER}`}
        />
      ) : (
        <video
          src="/hero-bg.mp4"
          poster="/hero-bg-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${HERO_MEDIA_FILTER}`}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-background/85" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:32px_32px] opacity-40" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 md:py-36">
        <span className="flex size-16 items-center justify-center rounded-xl border border-border bg-background/40 backdrop-blur">
          <Code2 className="size-7 text-primary" aria-hidden="true" />
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
            nativeButton={false}
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
            nativeButton={false}
            size="lg"
            className="group rounded-full px-7"
          />
        </div>

        <div className="mt-16 h-24 w-px bg-gradient-to-b from-border to-transparent" aria-hidden />
      </div>
    </section>
  )
}
