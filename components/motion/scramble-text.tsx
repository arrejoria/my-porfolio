'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '@/components/motion/reveal'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
const SCRAMBLE_DURATION = 0.6

/**
 * Renders `text` and scrambles it through random glyphs on hover before
 * settling back to the real characters — decorative only, gated by
 * prefers-reduced-motion (falls back to plain static text).
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  function handleMouseEnter() {
    if (prefersReducedMotion() || !ref.current) return
    const el = ref.current
    const chars = text.split('')
    const state = { progress: 0 }

    gsap.to(state, {
      progress: chars.length,
      duration: SCRAMBLE_DURATION,
      ease: 'none',
      onUpdate: () => {
        const revealCount = Math.floor(state.progress)
        el.textContent = chars
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < revealCount) return char
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join('')
      },
      onComplete: () => {
        el.textContent = text
      },
    })
  }

  return (
    <span ref={ref} className={className} onMouseEnter={handleMouseEnter}>
      {text}
    </span>
  )
}
