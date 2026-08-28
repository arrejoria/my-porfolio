'use client'

import { useI18n } from '@/lib/i18n/provider'
import { profile } from '@/lib/site-data'
import { Reveal } from '@/components/motion/reveal'

export function AboutSection() {
  const { t } = useI18n()

  return (
    <section id="about" className="border-t border-border/60">
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl">
          {t.about.title}
        </h2>
        <span className="mt-4 block h-px w-24 bg-primary" aria-hidden="true" />
        <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          <strong className="text-foreground">{profile.name}</strong> — {t.about.body}
        </p>
      </Reveal>
    </section>
  )
}
