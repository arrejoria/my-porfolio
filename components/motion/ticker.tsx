'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '@/components/motion/reveal'

/**
 * Ambient, decorative marquee of short text items — a continuous
 * single-direction loop (unlike SkillMarqueeRow's alternating drift rows).
 * Purely visual: hidden from assistive tech via `aria-hidden`.
 */
export function Ticker({ items }: { items: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  // Same mount-gated pattern as SkillsSection: `window.matchMedia` isn't
  // available during SSR, so reduced-motion state is resolved only after
  // the client mounts.
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  const reducedMotion = mounted && prefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion || !trackRef.current) return
      gsap.to(trackRef.current, { xPercent: -50, duration: 18, ease: 'none', repeat: -1 })
    },
    { dependencies: [reducedMotion], scope: trackRef },
  )

  const displayItems = reducedMotion ? items : [...items, ...items]

  return (
    <div
      aria-hidden="true"
      className="relative mb-9 overflow-hidden border-t border-b border-border py-3.5"
    >
      <div
        ref={trackRef}
        className={
          reducedMotion
            ? 'flex flex-wrap items-center gap-10'
            : 'flex w-max items-center gap-10 whitespace-nowrap'
        }
      >
        {displayItems.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-base font-extrabold uppercase tracking-wide whitespace-nowrap text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
