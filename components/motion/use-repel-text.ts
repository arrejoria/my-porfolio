'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/components/motion/reveal'

const REPEL_RADIUS = 130
const REPEL_STRENGTH = 0.6

/**
 * Attaches a mousemove-based "repel from cursor" transform to every
 * `[data-repel-char]` descendant of the returned ref's element: letters
 * within `REPEL_RADIUS` px of the pointer translate away from it,
 * proportional to how close the pointer is, and spring back to rest on
 * mouseleave.
 *
 * Only active on fine-pointer devices (mouse/trackpad) and skipped entirely
 * under `prefers-reduced-motion`, same gating convention as `useMagnetic`.
 */
export function useRepelText<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return

    const chars = Array.from(node.querySelectorAll<HTMLElement>('[data-repel-char]'))

    const handleMouseMove = (event: MouseEvent) => {
      for (const char of chars) {
        const rect = char.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const dx = centerX - event.clientX
        const dy = centerY - event.clientY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < REPEL_RADIUS) {
          const factor = ((REPEL_RADIUS - distance) / REPEL_RADIUS) * REPEL_STRENGTH
          char.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`
        } else {
          char.style.transform = ''
        }
      }
    }

    const handleMouseLeave = () => {
      for (const char of chars) char.style.transform = ''
    }

    node.addEventListener('mousemove', handleMouseMove)
    node.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      node.removeEventListener('mousemove', handleMouseMove)
      node.removeEventListener('mouseleave', handleMouseLeave)
      for (const char of chars) char.style.transform = ''
    }
  }, [])

  return ref
}
