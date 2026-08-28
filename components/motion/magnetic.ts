'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/components/motion/reveal'

const PULL_X = 0.28
const PULL_Y = 0.32

/**
 * Attaches a mousemove-based "follow the cursor" transform to an element.
 * While the pointer is over the element, it translates toward the cursor
 * (magnetic effect); on mouseleave it snaps back to rest.
 *
 * Only active on fine-pointer devices (mouse/trackpad) and skipped entirely
 * under `prefers-reduced-motion`, same gating convention as the rest of
 * `components/motion/*`.
 */
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return

    const handleMouseMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      node.style.transform = `translate(${dx * PULL_X}px, ${dy * PULL_Y}px)`
    }

    const handleMouseLeave = () => {
      node.style.transform = ''
    }

    node.addEventListener('mousemove', handleMouseMove)
    node.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      node.removeEventListener('mousemove', handleMouseMove)
      node.removeEventListener('mouseleave', handleMouseLeave)
      node.style.transform = ''
    }
  }, [])

  return ref
}
