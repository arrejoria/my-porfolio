'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import Link from 'next/link'
import { Code2, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import { prefersReducedMotion } from '@/components/motion/reveal'
import { useMagnetic } from '@/components/motion/magnetic'
import { triggerClickBurst } from '@/components/motion/click-burst'

const BLOB_LERP = 0.06
const BLOB_RADIUS_RATIO = 0.34

/**
 * Cursor-reactive "ink blob": a soft radial-gradient circle that eases
 * toward the pointer and is composited with `mix-blend-mode: difference`,
 * inverting whatever it overlaps. This is the hero's entire background
 * visual — no photo/video asset involved.
 *
 * Under `prefers-reduced-motion`, skips the animation loop entirely and
 * draws a single static, centered blob instead.
 */
function InkCursorBlob({
  sectionRef,
  mounted,
  reducedMotion,
}: {
  sectionRef: RefObject<HTMLElement | null>
  mounted: boolean
  reducedMotion: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let width = 0
    let height = 0

    function resize() {
      const rect = section!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function drawBlob(x: number, y: number) {
      ctx!.clearRect(0, 0, width, height)
      const radius = Math.min(width, height) * BLOB_RADIUS_RATIO
      const gradient = ctx!.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      ctx!.fillStyle = gradient
      ctx!.beginPath()
      ctx!.arc(x, y, radius, 0, Math.PI * 2)
      ctx!.fill()
    }

    resize()
    window.addEventListener('resize', resize)

    if (reducedMotion) {
      drawBlob(width / 2, height / 2)
      return () => window.removeEventListener('resize', resize)
    }

    let pointerX = width / 2
    let pointerY = height / 2
    let blobX = pointerX
    let blobY = pointerY
    let rafId = 0

    function handleMouseMove(event: MouseEvent) {
      const rect = section!.getBoundingClientRect()
      pointerX = event.clientX - rect.left
      pointerY = event.clientY - rect.top
    }

    function tick() {
      blobX += (pointerX - blobX) * BLOB_LERP
      blobY += (pointerY - blobY) * BLOB_LERP
      drawBlob(blobX, blobY)
      rafId = requestAnimationFrame(tick)
    }

    section.addEventListener('mousemove', handleMouseMove)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      section.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [mounted, reducedMotion, sectionRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full [mix-blend-mode:difference]"
    />
  )
}

export function HeroSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const discoverRef = useMagnetic<HTMLAnchorElement>()
  const contactRef = useMagnetic<HTMLAnchorElement>()

  // Same mount-gated pattern as ThemeToggle: `window.matchMedia` isn't
  // available during SSR, and calling it unconditionally on the first client
  // render (before hydration) would render a different media element than
  // the server did. Gating on `mounted` keeps both renders deterministic.
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  const reducedMotion = mounted && prefersReducedMotion()

  const words = t.hero.role.split(' ')

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // Above-the-fold entrance: no ScrollTrigger, just a mount-time timeline.
      gsap
        .timeline({ defaults: { opacity: 0, y: 24, duration: 0.7, ease: 'power2.out' } })
        .from(
          '[data-hero-char]',
          { opacity: 0, y: '0.6em', rotate: 6, duration: 0.7, stagger: 0.028, ease: 'power2.out' },
          0,
        )
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
      <InkCursorBlob sectionRef={sectionRef} mounted={mounted} reducedMotion={reducedMotion} />
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:32px_32px] opacity-40" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 md:py-36">
        <span className="flex size-16 items-center justify-center rounded-xl border border-border bg-background/40 backdrop-blur">
          <Code2 className="size-7 text-primary" aria-hidden="true" />
        </span>

        <h1 className="mt-8 font-display text-6xl uppercase leading-[0.95] tracking-tight text-balance sm:text-7xl md:text-8xl lg:text-9xl">
          {words.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className={`inline-block${wordIndex < words.length - 1 ? ' mr-[0.25em]' : ''}`}
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
          data-reveal="subtitle"
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground"
        >
          {t.hero.subtitle}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            data-reveal="cta"
            render={
              <Link ref={discoverRef} href="#projects">
                {t.hero.discover}
              </Link>
            }
            nativeButton={false}
            size="lg"
            variant="outline"
            className="rounded-full px-7"
          />
          <Button
            data-reveal="cta"
            render={
              <Link
                ref={contactRef}
                href="#contact"
                onClick={(event) => triggerClickBurst(event.clientX, event.clientY)}
              >
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
