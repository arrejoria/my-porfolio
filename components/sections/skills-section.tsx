'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useI18n } from '@/lib/i18n/provider'
import { skillGroups, type SkillGroup } from '@/lib/site-data'
import { Reveal, prefersReducedMotion } from '@/components/motion/reveal'

function SkillColumn({ group, title }: { group: SkillGroup; title: string }) {
  const columnRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !columnRef.current) return

      const bars = Array.from(columnRef.current.querySelectorAll<HTMLElement>('[data-skill-bar]'))

      gsap.from(bars, {
        width: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: columnRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: columnRef },
  )

  return (
    <div ref={columnRef}>
      <h3 className="text-center font-display text-2xl uppercase tracking-[0.15em] text-foreground">
        {title}
      </h3>
      <span className="mx-auto mt-3 block h-px w-12 bg-primary" aria-hidden="true" />
      <ul className="mt-6 space-y-5">
        {group.items.map((item) => (
          <li key={item.name}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-sm text-foreground">{item.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{item.level}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                data-skill-bar
                className="h-full rounded-full bg-primary"
                style={{ width: `${item.level}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SkillsSection() {
  const { t } = useI18n()

  return (
    <section id="skills" className="border-t border-border/60 bg-vignette">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
            {t.skills.title}
          </h2>
          <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
            {t.skills.body}
          </p>
        </Reveal>

        <Reveal className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12" stagger={0.12}>
          {skillGroups.map((group) => (
            <SkillColumn key={group.key} group={group} title={t.skills.columns[group.key]} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
