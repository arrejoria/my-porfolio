'use client'

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/provider'
import type { Dictionary, Locale } from '@/lib/i18n/dictionary'
import { mediaUrl, type ProjectDoc } from '@/lib/payload/types'
import { Reveal, prefersReducedMotion } from '@/components/motion/reveal'

const EASE = 0.22
const FRICTION = 0.94
const VELOCITY_SCALE = -15
const MOMENTUM_STOP_THRESHOLD = 0.05
const SETTLE_DELAY_MS = 60

const SPROCKET_CLASS =
  'h-3 w-full bg-repeat [background-image:radial-gradient(circle,var(--border)_0_3px,transparent_3.5px)] [background-size:26px_13px]'

/**
 * Drag-to-scroll physics for the film reel: a single continuous easing loop
 * drives both direct-drag-follow and post-release momentum, using one
 * `target` (desired scrollLeft) eased toward by one `current` (actual
 * scrollLeft). This mirrors the mockup's already-tuned drag feel — see
 * AGENTS.md/the phase 4a brief for the user-testing history behind the
 * per-frame clamp and the settle-delay before re-enabling scroll-snap.
 *
 * Progress bar / sprocket sync is driven by the reel's native `scroll`
 * event (fires for drag, trackpad, and keyboard alike), independent of this
 * loop.
 */
function useFilmReelDrag({
  reelRef,
  sprocketRefs,
  progressRef,
  mounted,
}: {
  reelRef: RefObject<HTMLDivElement | null>
  sprocketRefs: RefObject<HTMLDivElement | null>[]
  progressRef: RefObject<HTMLDivElement | null>
  mounted: boolean
}) {
  useEffect(() => {
    if (!mounted) return
    const reel = reelRef.current
    if (!reel) return

    const reducedMotion = prefersReducedMotion()
    const ease = reducedMotion ? 1 : EASE

    let target = reel.scrollLeft
    let current = reel.scrollLeft
    let momentumVelocity = 0
    let dragging = false
    let startX = 0
    let startScroll = 0
    let lastX = 0
    let lastTime = 0
    let rafId = 0
    let loopActive = false
    let settleTimeout: ReturnType<typeof setTimeout> | undefined

    function clampTarget(value: number) {
      const max = Math.max(reel!.scrollWidth - reel!.clientWidth, 0)
      return Math.min(Math.max(value, 0), max)
    }

    function stopLoop() {
      loopActive = false
      if (rafId) cancelAnimationFrame(rafId)
    }

    function startLoop() {
      if (loopActive) return
      loopActive = true
      rafId = requestAnimationFrame(tick)
    }

    function tick() {
      if (!dragging) {
        target += momentumVelocity
        momentumVelocity *= FRICTION
        if (Math.abs(momentumVelocity) < MOMENTUM_STOP_THRESHOLD) momentumVelocity = 0
      }

      // Clamp every frame (not just at drag end) — without this, dragging
      // past an edge accumulates an invisible overshoot in `target` that
      // snaps back later, which read as "abrupt/sticky" in user testing.
      target = clampTarget(target)
      current += (target - current) * ease
      reel!.scrollLeft = current

      const settled = !dragging && momentumVelocity === 0 && Math.abs(target - current) < 0.5
      if (settled) {
        current = target
        reel!.scrollLeft = current
        stopLoop()
        if (settleTimeout) clearTimeout(settleTimeout)
        settleTimeout = setTimeout(() => {
          reel!.style.scrollSnapType = ''
        }, SETTLE_DELAY_MS)
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      reel!.setPointerCapture(event.pointerId)
      dragging = true
      startX = event.clientX
      startScroll = reel!.scrollLeft
      lastX = event.clientX
      lastTime = performance.now()
      momentumVelocity = 0
      target = reel!.scrollLeft
      current = reel!.scrollLeft
      if (settleTimeout) clearTimeout(settleTimeout)
      reel!.style.scrollSnapType = 'none'
      reel!.style.cursor = 'grabbing'
      reel!.style.touchAction = 'none'
      startLoop()
    }

    function handlePointerMove(event: PointerEvent) {
      if (!dragging) return
      target = startScroll - (event.clientX - startX)
      if (!reducedMotion) {
        const now = performance.now()
        const dt = now - lastTime
        if (dt > 0) {
          momentumVelocity = ((event.clientX - lastX) / dt) * VELOCITY_SCALE
        }
        lastX = event.clientX
        lastTime = now
      }
    }

    function handlePointerUp(event: PointerEvent) {
      if (!dragging) return
      dragging = false
      reel!.style.cursor = ''
      reel!.style.touchAction = ''
      if (reel!.hasPointerCapture(event.pointerId)) reel!.releasePointerCapture(event.pointerId)
      startLoop()
    }

    function handleScroll() {
      const max = reel!.scrollWidth - reel!.clientWidth
      const progress = max > 0 ? reel!.scrollLeft / max : 0
      if (progressRef.current) progressRef.current.style.width = `${progress * 100}%`
      sprocketRefs.forEach((ref) => {
        if (ref.current) ref.current.style.backgroundPositionX = `-${reel!.scrollLeft}px`
      })
    }

    handleScroll()

    reel.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    reel.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      stopLoop()
      if (settleTimeout) clearTimeout(settleTimeout)
      reel.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      reel.removeEventListener('scroll', handleScroll)
    }
    // sprocketRefs is a stable tuple of refs created once by the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, reelRef, progressRef])
}

function FilmFrame({ project, index, locale }: { project: ProjectDoc; index: number; locale: Locale }) {
  return (
    <div className="group flex w-[78vw] shrink-0 snap-start flex-col sm:w-[360px]">
      <div className="relative aspect-[16/11] overflow-hidden border border-border bg-card">
        <span className="absolute left-2 top-2 z-10 rounded border border-border bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground backdrop-blur">
          N.{String(index + 1).padStart(2, '0')}
        </span>
        <Image
          src={mediaUrl(project.image) || '/placeholder.svg'}
          alt={project.title}
          fill
          draggable={false}
          sizes="(max-width: 640px) 78vw, 360px"
          className="object-cover grayscale contrast-[1.15] brightness-95 transition-[filter,transform] duration-500 group-hover:scale-105 group-hover:grayscale-0 group-focus-within:grayscale-0"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="truncate font-display text-lg font-extrabold uppercase tracking-tight">
          {project.title}
        </h3>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">35mm</span>
      </div>
      <p className="sr-only">{project.description[locale]}</p>
    </div>
  )
}

function ClosingFrame({ count, t }: { count: number; t: Dictionary }) {
  return (
    <Link
      href="/portfolio"
      className="group flex w-[78vw] shrink-0 snap-start flex-col sm:w-[360px]"
    >
      <div className="relative flex aspect-[16/11] flex-col items-center justify-center gap-2 overflow-hidden border border-border bg-foreground text-center text-background transition-colors group-hover:bg-background group-hover:text-foreground group-hover:ring-1 group-hover:ring-foreground">
        <span className="font-display text-5xl uppercase leading-none tracking-tight">{count}</span>
        <span className="max-w-[70%] font-mono text-xs uppercase tracking-wide">{t.portfolio.viewAll}</span>
        <ArrowRight
          className="mt-1 size-5 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
      <div className="mt-3 h-7" aria-hidden="true" />
    </Link>
  )
}

export function PortfolioSectionClient({ projects }: { projects: ProjectDoc[] }) {
  const { t, locale } = useI18n()
  const reelRef = useRef<HTMLDivElement>(null)
  const sprocketTopRef = useRef<HTMLDivElement>(null)
  const sprocketBottomRef = useRef<HTMLDivElement>(null)
  const sprocketRefs = useMemo(() => [sprocketTopRef, sprocketBottomRef], [sprocketTopRef, sprocketBottomRef])
  const progressRef = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  useFilmReelDrag({ reelRef, sprocketRefs, progressRef, mounted })

  return (
    <section id="projects" className="border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal>
          <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
            {t.portfolio.title}
          </h2>
          <span className="mt-4 block h-px w-24 bg-primary" aria-hidden="true" />
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {t.portfolio.subtitle}
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div ref={sprocketTopRef} aria-hidden="true" className={SPROCKET_CLASS} />

        <div
          ref={reelRef}
          className="flex cursor-grab snap-x snap-proximity touch-pan-y select-none gap-4 overflow-x-auto px-4 py-6 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => (
            <FilmFrame key={project.id} project={project} index={index} locale={locale} />
          ))}
          <ClosingFrame count={projects.length} t={t} />
        </div>

        <div ref={sprocketBottomRef} aria-hidden="true" className={SPROCKET_CLASS} />

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mt-4 h-0.5 w-full overflow-hidden border border-border">
            <div ref={progressRef} className="h-full bg-foreground" style={{ width: '0%' }} />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>
              {projects.length} {t.portfolio.framesLabel}
            </span>
            <span>{t.portfolio.dragHint}</span>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
