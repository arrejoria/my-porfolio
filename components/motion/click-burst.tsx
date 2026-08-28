'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/components/motion/reveal'

const CLICK_BURST_EVENT = 'click-burst'
const PARTICLE_COUNT = 12
const PARTICLE_SIZE = 6
const PARTICLE_DISTANCE = 60

interface ClickBurstDetail {
  x: number
  y: number
}

/**
 * Fires the global click-burst effect at the given viewport coordinates:
 * a brief full-screen inversion flash plus a small radial burst of
 * particles. No-ops entirely under `prefers-reduced-motion`.
 *
 * Requires `<ClickBurstOverlay />` to be mounted once somewhere in the tree
 * (see `app/(site)/layout.tsx`) — this function only dispatches an event,
 * the overlay does the rendering.
 */
export function triggerClickBurst(x: number, y: number) {
  if (typeof window === 'undefined' || prefersReducedMotion()) return
  window.dispatchEvent(new CustomEvent<ClickBurstDetail>(CLICK_BURST_EVENT, { detail: { x, y } }))
}

/**
 * Global overlay for the click-burst effect. Renders a fixed, full-viewport
 * layer (`mix-blend-mode: difference`) that flashes on `triggerClickBurst`,
 * plus a particle layer that spawns small squares radiating outward from
 * the click point using the Web Animations API. Mount exactly once — a
 * sibling of the app content is ideal (see root layout).
 */
export function ClickBurstOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleBurst(event: Event) {
      const { x, y } = (event as CustomEvent<ClickBurstDetail>).detail

      overlayRef.current?.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], {
        duration: 320,
        easing: 'ease-out',
      })

      const container = particlesRef.current
      if (!container) return

      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2
        const dx = Math.cos(angle) * PARTICLE_DISTANCE
        const dy = Math.sin(angle) * PARTICLE_DISTANCE

        const particle = document.createElement('div')
        particle.style.position = 'absolute'
        particle.style.left = `${x - PARTICLE_SIZE / 2}px`
        particle.style.top = `${y - PARTICLE_SIZE / 2}px`
        particle.style.width = `${PARTICLE_SIZE}px`
        particle.style.height = `${PARTICLE_SIZE}px`
        particle.style.background = 'var(--foreground)'
        container.appendChild(particle)

        const animation = particle.animate(
          [
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 },
          ],
          { duration: 480, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        )
        animation.onfinish = () => particle.remove()
      }
    }

    window.addEventListener(CLICK_BURST_EVENT, handleBurst)
    return () => window.removeEventListener(CLICK_BURST_EVENT, handleBurst)
  }, [])

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[999] bg-white opacity-0 [mix-blend-mode:difference]"
      />
      <div ref={particlesRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[999]" />
    </>
  )
}
