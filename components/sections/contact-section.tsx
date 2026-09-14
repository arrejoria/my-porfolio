'use client'

import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/provider'
import { profile } from '@/lib/site-data'
import type { HomeSection } from '@/lib/homepage/sections'
import { pick } from '@/lib/homepage/sections'
import { Reveal } from '@/components/motion/reveal'

type ContactHomeSection = Extract<HomeSection, { kind: 'contact' }>

export function ContactSection({ block }: { block: ContactHomeSection }) {
  const { t, locale } = useI18n()
  const title = pick(block.title, locale, t.contact.title)
  const subtitle = pick(block.subtitle, locale, t.contact.subtitle)

  return (
    <section id="contact" className="border-t border-border/60">
      <Reveal className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 md:flex-row md:items-end md:justify-between md:py-28">
        <div className="max-w-[480px]">
          <p className="mb-5 flex items-center gap-[9px] text-[11.5px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="status-dot" />
            {t.hero.status}
          </p>
          <h2 className="font-serif-display text-[clamp(34px,4.6vw,50px)] font-medium tracking-[-0.005em] text-balance text-foreground italic">
            {title}
          </h2>
          <p className="mt-4 max-w-[42ch] text-[14.5px] leading-[1.65] text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-2.5 rounded-[3px] bg-foreground px-6 py-[15px] font-mono text-[13.5px] font-medium text-background transition-[background,transform] duration-200 ease-out hover:-translate-y-px hover:bg-foreground/90"
          >
            {profile.email}
            <ArrowUpRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </Reveal>
    </section>
  )
}
