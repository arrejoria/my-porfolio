'use client'

import { useI18n } from '@/lib/i18n/provider'
import { skillGroups } from '@/lib/site-data'
import { Reveal } from '@/components/motion/reveal'

export function SkillsSection() {
  const { t } = useI18n()

  return (
    <section id="skills" className="border-t border-border/60 bg-vignette">
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
            {t.skills.title}
          </h2>
          <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
            {t.skills.body}
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12">
          {skillGroups.map((group) => (
            <div key={group.key}>
              <h3 className="text-center font-display text-2xl uppercase tracking-[0.15em] text-foreground">
                {t.skills.columns[group.key]}
              </h3>
              <span className="mx-auto mt-3 block h-px w-12 bg-primary" aria-hidden="true" />
              <ul className="mt-6 space-y-5">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-sm text-foreground">{item.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.level}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${item.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
