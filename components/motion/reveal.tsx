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
  /**
   * When set, animates each direct child of the wrapper independently
   * (via GSAP's `stagger`) instead of animating the wrapper as one block.
   * Value is the delay in seconds between each child's animation start.
   */
  stagger?: number
  /** Delay (seconds) before the animation starts. */
  delay?: number
}

/**
 * Fades and translates its children up into place the first time they enter
 * the viewport. Skips the animation entirely under `prefers-reduced-motion`,
 * rendering children at their final, static position immediately.
 *
 * By default the wrapper animates as a single block. Pass `stagger` to
 * instead animate the wrapper's direct children individually, staggered by
 * that many seconds — useful for lists/grids entering the viewport.
 */
export function Reveal({ children, className, y = 28, duration = 0.7, stagger, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return

      const target = stagger !== undefined ? Array.from(ref.current.children) : ref.current

      gsap.from(target, {
        opacity: 0,
        y,
        duration,
        delay,
        stagger,
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
