'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useI18n } from '@/lib/i18n/provider'
import { skillGroups } from '@/lib/site-data'
import { Reveal, prefersReducedMotion } from '@/components/motion/reveal'
import { Badge } from '@/components/ui/badge'

const SEPARATOR = '✦'

/** Per-row drift direction and speed, varied so the marquee doesn't feel mechanical. */
const ROW_MOTION: { direction: 'left' | 'right'; duration: number }[] = [
  { direction: 'left', duration: 26 },
  { direction: 'right', duration: 34 },
  { direction: 'left', duration: 20 },
  { direction: 'right', duration: 30 },
]

/** Cursor-proximity glow tuning — mirrors the reference mockup's vanilla-JS constants. */
const GLOW_FALLOFF = 140

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

function TrackContent({ tokens, prefix, markWords }: { tokens: Token[]; prefix: string; markWords?: boolean }) {
  return (
    <>
      {tokens.map((token, i) => (
        <span
          key={`${prefix}-${token.key}-${i}`}
          className={
            token.muted ? 'text-muted-foreground/30' : markWords ? 'glow-word inline-block' : undefined
          }
        >
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
  reducedMotion,
}: {
  items: string[]
  title: string
  direction: 'left' | 'right'
  duration: number
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
    <div className="grid grid-cols-[84px_1fr] items-stretch border-b border-border sm:grid-cols-[200px_1fr]">
      <div className="flex items-center gap-[9px] border-r border-border py-[18px] pr-3.5 pl-5 font-plex-mono text-[10.5px] leading-[1.3] tracking-[0.1em] text-muted-foreground uppercase sm:whitespace-nowrap sm:text-[11.5px] sm:tracking-[0.12em]">
        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-muted-foreground/70" aria-hidden="true" />
        {title}
      </div>

      <div className="overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] sm:py-6">
        <span className="sr-only">{readableList}</span>

        <div className="relative" aria-hidden="true">
          <div
            ref={ghostRef}
            className={
              reducedMotion
                ? 'flex flex-wrap items-center gap-x-6 gap-y-2 font-tick text-3xl font-extrabold uppercase text-foreground sm:text-4xl md:text-5xl'
                : 'inline-flex w-max items-center gap-6 whitespace-nowrap font-tick text-3xl font-extrabold uppercase text-muted-foreground/40 sm:text-4xl md:text-5xl'
            }
          >
            <TrackContent tokens={displayTokens} prefix="ghost" markWords={!reducedMotion} />
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
                className="inline-flex w-max items-center gap-6 whitespace-nowrap font-tick text-3xl font-extrabold uppercase text-foreground sm:text-4xl md:text-5xl"
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

/**
 * Brightens marquee words as the cursor approaches the midpoint between two
 * invisible reference rails — same smoothstep-falloff mechanic as the
 * reference mockup's vanilla-JS `tick()` loop. Mutates DOM styles directly
 * inside a `requestAnimationFrame` loop (never React state) so it doesn't
 * trigger re-renders on every frame. Bails out entirely — leaving words at
 * their default styling — under reduced motion or on coarse-pointer/touch
 * devices, matching the mockup's own reduced-motion branch.
 */
function useMarqueeGlow(
  containerRef: React.RefObject<HTMLDivElement | null>,
  railLRef: React.RefObject<HTMLSpanElement | null>,
  railRRef: React.RefObject<HTMLSpanElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    const railL = railLRef.current
    const railR = railRRef.current
    if (!container || !railL || !railR) return

    const words = Array.from(container.querySelectorAll<HTMLElement>('.glow-word'))
    if (words.length === 0) return

    let rafId: number

    function tick() {
      const lRect = railL!.getBoundingClientRect()
      const rRect = railR!.getBoundingClientRect()
      const zoneCenter = (lRect.left + rRect.left) / 2
      const halfSpan = Math.abs(rRect.left - lRect.left) / 2 + GLOW_FALLOFF

      for (const word of words) {
        const rect = word.getBoundingClientRect()
        const center = rect.left + rect.width / 2
        const distance = Math.abs(center - zoneCenter)
        let t = 1 - distance / halfSpan
        if (t < 0) t = 0
        if (t > 1) t = 1
        t = t * t * (3 - 2 * t)

        word.style.opacity = (0.4 + t * 0.6).toFixed(3)
        word.style.color = t > 0.08 ? 'var(--foreground)' : 'var(--muted-foreground)'
        word.style.transform = t > 0.02 ? `scale(${(1 + t * 0.04).toFixed(3)})` : 'none'
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [containerRef, railLRef, railRRef, enabled])
}

export function ProfileSection() {
  const { t } = useI18n()

  // Same mount-gated pattern as HeroSection: `window.matchMedia` isn't available
  // during SSR, so reduced-motion/pointer state is resolved only after the
  // client mounts.
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  const reducedMotion = mounted && prefersReducedMotion()
  const coarsePointer = mounted && window.matchMedia('(pointer: coarse)').matches
  const glowEnabled = mounted && !reducedMotion && !coarsePointer

  const rowsWrapRef = useRef<HTMLDivElement>(null)
  const railLRef = useRef<HTMLSpanElement>(null)
  const railRRef = useRef<HTMLSpanElement>(null)
  useMarqueeGlow(rowsWrapRef, railLRef, railRRef, glowEnabled)

  return (
    <section id="profile" className="border-t border-border/60 bg-vignette-soft">
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground before:h-px before:w-[22px] before:bg-muted-foreground before:content-['']">
          {t.profile.eyebrow} <b className="font-medium tabular-nums text-foreground/80">/ 01</b>
        </p>
        <h2 className="sr-only">{t.profile.title}</h2>

        <div className="lg:grid lg:grid-cols-[1fr_210px] lg:items-center lg:gap-14">
          <div>
            <p className="font-serif-display text-pretty text-[clamp(22px,3.1vw,32px)] font-[450] leading-[1.48] tracking-[-0.005em] text-muted-foreground">
              {t.profile.statementPrefix}
              <strong className="font-serif-display font-semibold text-foreground italic">
                {t.profile.statementYears}
              </strong>
              {t.profile.statementMiddle}
              <strong className="font-serif-display font-semibold text-foreground italic">
                {t.profile.statementAutomation}
              </strong>
              {t.profile.statementSuffix}
            </p>
            <div className="mt-[30px] flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                {t.profile.pill}
              </Badge>
            </div>
          </div>

          <div className="mt-[34px] flex flex-col gap-2 border-t border-border pt-[22px] lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <span className="font-tick text-[clamp(56px,6.5vw,92px)] leading-[0.88] font-extrabold tabular-nums text-foreground">
              {t.profile.statNumber}
              <span className="align-super text-[0.48em] text-muted-foreground">+</span>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/70">
              {t.profile.statLabel}
            </span>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="mx-auto mt-[26px] block h-[clamp(30px,5vw,46px)] w-px bg-gradient-to-b from-border to-transparent"
        />
      </Reveal>

      <div className="mt-16">
        <div ref={rowsWrapRef} className="relative border-t border-border">
          <span
            ref={railLRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-gradient-to-b from-transparent via-border to-transparent left-[calc(84px+22%)] sm:left-[calc(200px+22%)]"
          />
          <span
            ref={railRRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-gradient-to-b from-transparent via-border to-transparent left-[calc(84px+62%)] sm:left-[calc(200px+62%)]"
          />
          {skillGroups.map((group, i) => (
            <SkillMarqueeRow
              key={group.key}
              items={group.items.map((item) => (item === 'applied-ai' ? t.profile.appliedAi : item))}
              title={t.profile.columns[group.key]}
              direction={ROW_MOTION[i]!.direction}
              duration={ROW_MOTION[i]!.duration}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
