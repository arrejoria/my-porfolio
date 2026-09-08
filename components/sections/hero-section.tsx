'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/provider'
import { prefersReducedMotion } from '@/components/motion/reveal'
import { useMagnetic } from '@/components/motion/magnetic'
import { triggerClickBurst } from '@/components/motion/click-burst'
import { BootSequence, type BootSequenceHandle } from '@/components/motion/boot-sequence'
import { profile } from '@/lib/site-data'

const HERO_STACK = ['n8n', 'WooCommerce', 'WhatsApp API', 'Supabase', 'NocoDB', 'Docker']

// Fractional (0–1) layout of an abstract workflow graph — echoes an n8n
// canvas without depicting a real one. Edges reference indices into this list.
const GRAPH_NODES = [
  { x: 0.06, y: 0.34 },
  { x: 0.22, y: 0.58 },
  { x: 0.24, y: 0.2 },
  { x: 0.42, y: 0.42 },
  { x: 0.58, y: 0.68 },
  { x: 0.58, y: 0.2 },
  { x: 0.76, y: 0.46 },
  { x: 0.9, y: 0.3 },
  { x: 0.9, y: 0.66 },
] as const
const GRAPH_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 6],
  [6, 7],
  [6, 8],
]

type GraphNode = {
  bx: number
  by: number
  x: number
  y: number
  rx: number
  ry: number
  dx: number
  dy: number
  phase: number
  freq: number
  amp: number
}
type Point = { x: number; y: number }

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function bezierPoint(p0: Point, c1: Point, c2: Point, p1: Point, t: number): Point {
  const mt = 1 - t
  const a = mt * mt * mt
  const b = 3 * mt * mt * t
  const c = 3 * mt * t * t
  const d = t * t * t
  return {
    x: a * p0.x + b * c1.x + c * c2.x + d * p1.x,
    y: a * p0.y + b * c1.y + c * c2.y + d * p1.y,
  }
}

function controlPoints(p0: Point, p1: Point): [Point, Point] {
  const dx = (p1.x - p0.x) * 0.55
  return [
    { x: p0.x + dx, y: p0.y },
    { x: p1.x - dx, y: p1.y },
  ]
}

/**
 * Canvas backdrop: an abstract workflow graph that idles with a gentle
 * per-node drift and pulses that travel along its edges. Near the cursor,
 * nodes get a soft repel and a dot-grid reveals underneath them — same
 * "reacts to the cursor" language as the hero's magnetic CTAs, kept
 * intentional and localized instead of a page-wide effect.
 *
 * Under `prefers-reduced-motion`, draws one static frame at rest (no
 * drift, no pulses, no cursor reactivity) and stops there.
 */
function WorkflowGraph({
  sectionRef,
  mounted,
  reducedMotion,
}: {
  sectionRef: RefObject<HTMLElement | null>
  mounted: boolean
  reducedMotion: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Pure grayscale tokens (oklch(L 0 0)) — close enough as flat sRGB for
    // canvas drawing, which can't resolve CSS custom properties itself.
    const inkRGB = resolvedTheme === 'light' ? '20,20,20' : '247,247,247'

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0

    function resize() {
      const rect = section!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const GRID = 30
    let dots: Point[] = []
    function buildGrid() {
      dots = []
      const cols = Math.ceil(width / GRID) + 1
      const rows = Math.ceil(height / GRID) + 1
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) dots.push({ x: c * GRID, y: r * GRID })
      }
    }

    const nodes: GraphNode[] = GRAPH_NODES.map((n, i) => ({
      bx: n.x,
      by: n.y,
      x: 0,
      y: 0,
      rx: 0,
      ry: 0,
      dx: 0,
      dy: 0,
      phase: i * 1.7 + Math.random() * 2,
      freq: 0.35 + Math.random() * 0.25,
      amp: 5 + Math.random() * 4,
    }))
    const pulses = GRAPH_EDGES.map((e, i) => ({
      a: e[0],
      b: e[1],
      dur: 2.6 + (i % 4) * 0.5,
      phase: (i * 0.37) % 1,
    }))

    resize()

    if (reducedMotion) {
      for (const n of nodes) {
        n.x = n.bx * width
        n.y = n.by * height
      }
      ctx.clearRect(0, 0, width, height)
      for (const [a, b] of GRAPH_EDGES) {
        const na = nodes[a]
        const nb = nodes[b]
        const [c1, c2] = controlPoints(na, nb)
        ctx.beginPath()
        ctx.moveTo(na.x, na.y)
        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, nb.x, nb.y)
        ctx.strokeStyle = `rgba(${inkRGB},0.13)`
        ctx.lineWidth = 1
        ctx.stroke()
      }
      for (const n of nodes) {
        const w = 11
        const h = w * 0.62
        ctx.beginPath()
        ctx.roundRect(n.x - w / 2, n.y - h / 2, w, h, 3)
        ctx.fillStyle = `rgba(${inkRGB},0.6)`
        ctx.fill()
      }
      const onResize = () => {
        resize()
        for (const n of nodes) {
          n.x = n.bx * width
          n.y = n.by * height
        }
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    buildGrid()

    const mouse = { x: -9999, y: -9999, active: false }
    function handleMouseMove(event: MouseEvent) {
      const rect = section!.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
      mouse.active = true
    }
    function handleMouseLeave() {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    const REVEAL_R = 190
    const REPEL_R = 130
    const MAX_PUSH = 22
    let rafId = 0
    const t0 = performance.now()

    function frame(now: number) {
      const t = (now - t0) / 1000
      ctx!.clearRect(0, 0, width, height)

      for (const d of dots) {
        const dist = mouse.active ? Math.hypot(d.x - mouse.x, d.y - mouse.y) : Infinity
        const reveal = dist < REVEAL_R ? 1 - dist / REVEAL_R : 0
        if (reveal <= 0) continue
        ctx!.beginPath()
        ctx!.arc(d.x, d.y, 1 + reveal * 1.1, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${inkRGB},${(0.045 + reveal * 0.4).toFixed(3)})`
        ctx!.fill()
      }

      for (const n of nodes) {
        const baseX = n.bx * width
        const baseY = n.by * height
        n.rx = Math.cos(t * n.freq + n.phase) * n.amp
        n.ry = Math.sin(t * n.freq * 1.3 + n.phase) * n.amp

        let tx = 0
        let ty = 0
        if (mouse.active) {
          const ddx = baseX - mouse.x
          const ddy = baseY - mouse.y
          const dd = Math.hypot(ddx, ddy)
          if (dd < REPEL_R && dd > 0.001) {
            const push = (1 - dd / REPEL_R) * MAX_PUSH
            tx = (ddx / dd) * push
            ty = (ddy / dd) * push
          }
        }
        n.dx = lerp(n.dx, tx, 0.08)
        n.dy = lerp(n.dy, ty, 0.08)
        n.x = baseX + n.rx + n.dx
        n.y = baseY + n.ry + n.dy
      }

      for (const [a, b] of GRAPH_EDGES) {
        const na = nodes[a]
        const nb = nodes[b]
        const [c1, c2] = controlPoints(na, nb)
        const near =
          mouse.active &&
          (Math.hypot(na.x - mouse.x, na.y - mouse.y) < REPEL_R ||
            Math.hypot(nb.x - mouse.x, nb.y - mouse.y) < REPEL_R)
        ctx!.beginPath()
        ctx!.moveTo(na.x, na.y)
        ctx!.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, nb.x, nb.y)
        ctx!.strokeStyle = `rgba(${inkRGB},${near ? 0.4 : 0.13})`
        ctx!.lineWidth = near ? 1.4 : 1
        ctx!.stroke()
      }

      for (const p of pulses) {
        const na = nodes[p.a]
        const nb = nodes[p.b]
        const [c1, c2] = controlPoints(na, nb)
        const pt = (t / p.dur + p.phase) % 1
        const pos = bezierPoint(na, c1, c2, nb, pt)
        const env = Math.sin(pt * Math.PI)
        ctx!.beginPath()
        ctx!.arc(pos.x, pos.y, 2.6, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${inkRGB},${(0.85 * env).toFixed(3)})`
        ctx!.shadowColor = `rgba(${inkRGB},0.9)`
        ctx!.shadowBlur = 8 * env
        ctx!.fill()
        ctx!.shadowBlur = 0
      }

      for (const n of nodes) {
        const active = mouse.active && Math.hypot(n.x - mouse.x, n.y - mouse.y) < REPEL_R
        const w = active ? 15 : 11
        const h = w * 0.62
        ctx!.beginPath()
        ctx!.roundRect(n.x - w / 2, n.y - h / 2, w, h, 3)
        ctx!.fillStyle = `rgba(${inkRGB},${active ? 0.95 : 0.6})`
        ctx!.fill()
      }

      rafId = requestAnimationFrame(frame)
    }

    const onResize = () => {
      resize()
      buildGrid()
    }
    window.addEventListener('resize', onResize)
    section.addEventListener('mousemove', handleMouseMove)
    section.addEventListener('mouseleave', handleMouseLeave)
    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      section.removeEventListener('mousemove', handleMouseMove)
      section.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mounted, reducedMotion, resolvedTheme, sectionRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}

function useLocalClock(locale: 'es' | 'en') {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat(locale === 'es' ? 'es-AR' : 'en-GB', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const tick = () => setTime(formatter.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [locale])

  return time
}

export function HeroSection() {
  const { t, locale } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const bootRef = useRef<BootSequenceHandle>(null)
  const discoverRef = useMagnetic<HTMLAnchorElement>()
  const contactRef = useMagnetic<HTMLAnchorElement>()
  const clock = useLocalClock(locale)

  // Same mount-gated pattern as ThemeToggle: `window.matchMedia` isn't
  // available during SSR, and calling it unconditionally on the first client
  // render (before hydration) would render a different media element than
  // the server did. Gating on `mounted` keeps both renders deterministic.
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  const reducedMotion = mounted && prefersReducedMotion()

  // Gates the entrance timeline below: false while the boot terminal is
  // either playing or hasn't decided yet (avoids a wasted/invisible tween
  // behind the opaque boot overlay), true once BootSequence's onDone fires
  // — whether that's from the full sequence, a skip, or a session-storage
  // fast path where the boot never shows at all.
  const [bootDone, setBootDone] = useState(false)

  const nameWords = [profile.name.split(' ')[0]!]

  useGSAP(
    () => {
      if (!bootDone || prefersReducedMotion()) return

      gsap
        .timeline({ defaults: { opacity: 0, y: 24, duration: 0.7, ease: 'power2.out' } })
        .from('[data-reveal="topbar"]', {}, 0)
        .from(
          '[data-hero-char]',
          { opacity: 0, y: '0.6em', rotate: 6, duration: 0.7, stagger: 0.02, ease: 'power2.out' },
          0.1,
        )
        .from('[data-reveal="role"]', {}, 0.32)
        .from('[data-reveal="subtitle"]', {}, 0.4)
        .from('[data-reveal="cta"]', { stagger: 0.1 }, 0.5)
        .from('[data-reveal="bottombar"]', {}, 0.6)
    },
    { scope: sectionRef, dependencies: [bootDone] },
  )

  return (
    <section
      id="top"
      ref={sectionRef}
      className="hero-noise relative isolate flex min-h-dvh flex-col justify-between overflow-hidden bg-background font-mono"
    >
      <BootSequence ref={bootRef} onDone={() => setBootDone(true)} />

      <WorkflowGraph sectionRef={sectionRef} mounted={mounted} reducedMotion={reducedMotion} />

      <div className="scrim" aria-hidden="true" />

      <div className="relative z-[3] flex min-h-dvh flex-col justify-between gap-8 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
        <div
          data-reveal="topbar"
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div className="inline-flex items-center gap-[9px] text-[11.5px] tracking-[0.14em] text-muted-foreground uppercase">
            <span className="size-[7px] shrink-0 animate-pulse rounded-full bg-foreground" aria-hidden="true" />
            {t.hero.status}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-[11.5px] tracking-[0.1em] text-muted-foreground/70 tabular-nums">
              <span className="text-muted-foreground">{clock ?? '—:—:—'}</span> {t.hero.localTime}
            </div>
            <button
              type="button"
              onClick={() => bootRef.current?.replay()}
              aria-label={t.hero.replayLabel}
              title={t.hero.replayLabel}
              className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground/70 transition-[color,border-color,transform] duration-150 hover:border-muted-foreground hover:text-muted-foreground active:scale-90"
            >
              <svg viewBox="0 0 24 24" className="ml-px size-[9px] fill-current">
                <path d="M6 4l15 8-15 8V4z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-w-2xl">
          <p className="mb-[18px] flex items-center gap-1.5 text-xs tracking-[0.16em] text-muted-foreground/70 uppercase">
            {t.hero.eyebrowRole}
            <span className="text-muted-foreground">/ {t.hero.eyebrowLocation}</span>
          </p>

          <h1 className="mb-5 font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.96] font-extrabold tracking-tight text-balance text-foreground uppercase">
            {nameWords.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className={`inline-block${wordIndex < nameWords.length - 1 ? ' mr-[0.2em]' : ''}`}
              >
                {word.split('').map((char, charIndex) => (
                  <span key={charIndex} data-hero-char className="inline-block">
                {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p
            data-reveal="role"
            className="mb-[26px] max-w-[29rem] border-b border-border pb-[26px] text-[13px] tracking-[0.08em] text-muted-foreground uppercase sm:text-[15px]"
          >
            {t.hero.role}
          </p>

          <p
            data-reveal="subtitle"
            className="mb-[34px] max-w-[46ch] text-[14.5px] leading-relaxed text-muted-foreground sm:text-base"
          >
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-[22px]">
            <Button
              data-reveal="cta"
              render={
                <Link ref={discoverRef} href="#projects">
                  {t.hero.discover}
                </Link>
              }
              nativeButton={false}
              size="lg"
              className="rounded-full px-7 font-mono text-[13.5px] tracking-[0.04em] uppercase"
            />
            <Link
              ref={contactRef}
              data-reveal="cta"
              href="#contact"
              onClick={(event) => triggerClickBurst(event.clientX, event.clientY)}
              className="group inline-flex items-center gap-2 border-b border-transparent pb-[2px] text-[13.5px] tracking-[0.02em] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              {t.hero.contact}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div
          data-reveal="bottombar"
          className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-[18px]"
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="mr-1 text-[10.5px] tracking-[0.14em] text-muted-foreground/70 uppercase">
              {t.hero.stack}
            </span>
            {HERO_STACK.map((item) => (
              <Badge key={item} variant="outline" className="font-mono text-[11.5px] font-normal">
                {item}
              </Badge>
            ))}
          </div>
          <span className="text-[11px] tracking-[0.08em] text-muted-foreground/70 uppercase">
            GMT-3 · America/Argentina/Buenos_Aires
          </span>
        </div>
      </div>
    </section>
  )
}
