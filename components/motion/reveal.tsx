'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Registered once at module scope (not per render/instance) — ScrollTrigger only
// needs to be told about itself once for the whole app.
gsap.registerPlugin(ScrollTrigger)

/** True when the user has requested reduced motion at the OS/browser level. */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface RevealProps {
  children: ReactNode
  className?: string
  /** Distance (px) the element travels in from below. */
  y?: number
  /** Animation duration in seconds. */
  duration?: number
}

/**
 * Fades and translates its children up into place the first time they enter
 * the viewport. Skips the animation entirely under `prefers-reduced-motion`,
 * rendering children at their final, static position immediately.
 */
export function Reveal({ children, className, y = 28, duration = 0.7 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return

      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
