'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useI18n } from '@/lib/i18n/provider'
import { skillGroups } from '@/lib/site-data'
import { Reveal, prefersReducedMotion } from '@/components/motion/reveal'

const SEPARATOR = '✦'

/** Per-row drift direction and speed, varied so the marquee doesn't feel mechanical. */
const ROW_MOTION: { direction: 'left' | 'right'; duration: number }[] = [
  { direction: 'left', duration: 26 },
  { direction: 'right', duration: 34 },
  { direction: 'left', duration: 20 },
  { direction: 'right', duration: 30 },
]

type Token = { key: string; text: string; muted: boolean }

/** One item+separator sequence — the exact repeating unit for the marquee loop. */
function buildUnit(items: string[]): Token[] {
  const tokens: Token[] = []
  items.forEach((item, i) => {
    tokens.push({ key: `w-${i}`, text: item, muted: false })
    tokens.push({ key: `s-${i}`, text: SEPARATOR, muted: true })
  })
  return tokens
}

function TrackContent({ tokens, prefix }: { tokens: Token[]; prefix: string }) {
  return (
    <>
      {tokens.map((token, i) => (
        <span key={`${prefix}-${token.key}-${i}`} className={token.muted ? 'text-muted-foreground/30' : undefined}>
          {token.text}
        </span>
      ))}
    </>
  )
}

function SkillMarqueeRow({
  items,
  title,
  direction,
  duration,
  isLast,
  reducedMotion,
}: {
  items: string[]
  title: string
  direction: 'left' | 'right'
  duration: number
  isLast: boolean
  reducedMotion: boolean
}) {
  const ghostRef = useRef<HTMLDivElement>(null)
  const solidRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const targets = [ghostRef.current, solidRef.current].filter((el): el is HTMLDivElement => el !== null)
      if (targets.length === 0) return

      if (direction === 'left') {
        gsap.to(targets, { xPercent: -50, duration, ease: 'none', repeat: -1 })
      } else {
        // Identical mechanism, opposite feel: starting at -50% (which, because the
        // content is exactly two copies of the same unit, looks pixel-identical to
        // 0%) and animating up to 0% drifts the row visually rightward. On repeat,
        // GSAP resets to the `-50%` start state — invisible, since it matches the
        // frame the row just displayed.
        gsap.fromTo(targets, { xPercent: -50 }, { xPercent: 0, duration, ease: 'none', repeat: -1 })
      }
    },
    { dependencies: [reducedMotion], scope: ghostRef },
  )

  const unit = buildUnit(items)
  const displayTokens = reducedMotion ? unit.slice(0, -1) : [...unit, ...unit]
  const readableList = items.join(', ')

  return (
    <div className="relative">
      <span className="relative z-10 mb-2 inline-block border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:absolute sm:left-4 sm:top-1/2 sm:mb-0 sm:-translate-y-1/2 sm:z-10">
        {title}
      </span>

      <div className={`overflow-hidden border-t border-border/60 py-4 sm:py-6${isLast ? ' border-b' : ''}`}>
        <span className="sr-only">{readableList}</span>

        <div className="relative" aria-hidden="true">
          <div
            ref={ghostRef}
            className={
              reducedMotion
                ? 'flex flex-wrap items-center gap-x-6 gap-y-2 font-display text-3xl font-extrabold uppercase text-foreground sm:text-4xl md:text-5xl'
                : 'inline-flex w-max items-center gap-6 whitespace-nowrap font-display text-3xl font-extrabold uppercase text-muted-foreground/40 sm:text-4xl md:text-5xl'
            }
          >
            <TrackContent tokens={displayTokens} prefix="ghost" />
          </div>

          {!reducedMotion && (
            // Clip-path needs its own reference box to be the row's (viewport)
            // width so the visible window sits at a fixed point on screen — the
            // GSAP-transformed track inside it is content-width instead (same
            // width as `ghostRef`, so `xPercent` moves both by an identical
            // pixel distance and the loop stays in lockstep).
            <div className="absolute inset-0 flex items-center [clip-path:inset(0_calc(50%-3rem)_0_calc(50%-3rem))] sm:[clip-path:inset(0_calc(50%-4rem)_0_calc(50%-4rem))] md:[clip-path:inset(0_calc(50%-5rem)_0_calc(50%-5rem))]">
              <div
                ref={solidRef}
                className="inline-flex w-max items-center gap-6 whitespace-nowrap font-display text-3xl font-extrabold uppercase text-foreground sm:text-4xl md:text-5xl"
              >
                <TrackContent tokens={displayTokens} prefix="solid" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function SkillsSection() {
  const { t } = useI18n()

  // Same mount-gated pattern as HeroSection: `window.matchMedia` isn't available
  // during SSR, so reduced-motion state is resolved only after the client mounts.
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  const reducedMotion = mounted && prefersReducedMotion()

  return (
    <section id="skills" className="border-t border-border/60 bg-vignette">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-5 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground before:h-px before:w-[22px] before:bg-muted-foreground before:content-['']">
            {t.skills.eyebrow} <b className="font-medium tabular-nums text-foreground/80">/ 02</b>
          </p>
          <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
            {t.skills.title}
          </h2>
          <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
            {t.skills.body}
          </p>
        </Reveal>
      </div>

      <div className="mt-16">
        {skillGroups.map((group, i) => (
          <SkillMarqueeRow
            key={group.key}
            items={group.items.map((item) => (item === 'applied-ai' ? t.skills.appliedAi : item))}
            title={t.skills.columns[group.key]}
            direction={ROW_MOTION[i]!.direction}
            duration={ROW_MOTION[i]!.duration}
            isLast={i === skillGroups.length - 1}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  )
}
