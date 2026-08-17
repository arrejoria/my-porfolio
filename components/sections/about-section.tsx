'use client'

import { MapPin } from 'lucide-react'
import { useI18n } from '@/lib/i18n/provider'
import { experience, profile } from '@/lib/site-data'
import { Reveal } from '@/components/motion/reveal'

export function AboutSection() {
  const { t, locale } = useI18n()

  return (
    <section id="about" className="border-t border-border/60">
      <Reveal className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
        <div>
          <h2 className="font-display text-4xl uppercase tracking-tight sm:text-5xl">
            {t.about.title}
          </h2>
          <span className="mt-4 block h-px w-24 bg-primary" />
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
            {t.about.body}
          </p>

          <h3 className="mt-10 font-display text-2xl uppercase tracking-tight">
            {t.about.experienceTitle}
          </h3>
          <ol className="mt-4 space-y-5">
            {experience.map((item, i) => (
              <li key={i} className="relative border-l border-border pl-5">
                <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="font-medium text-foreground">
                    {item.role[locale]}{' '}
                    <span className="text-muted-foreground">· {item.company}</span>
                  </p>
                  <span className="font-mono text-xs text-muted-foreground">
                    {item.period}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description[locale]}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-start justify-center md:justify-end">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/20">
            <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-primary/10">
              <span className="font-display text-4xl text-primary">
                {profile.initials}
              </span>
            </div>
            <p className="mt-6 text-center font-display text-2xl uppercase tracking-tight">
              {t.about.cardName}
            </p>
            <p className="text-center text-sm tracking-[0.2em] text-muted-foreground">
              {t.about.cardRole}
            </p>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              {t.about.cardLocation}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="h-px w-10 bg-border" />
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="h-px w-10 bg-border" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
