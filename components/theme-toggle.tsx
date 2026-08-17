'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // Verified via live SSR/client logging that useSyncExternalStore's
  // getServerSnapshot is NOT honored for this component's hydration render
  // in this Next 16/Turbopack setup — the client's first observed render
  // already reports the client snapshot, causing a real aria-label hydration
  // mismatch. useState+useEffect is the only pattern that reliably renders
  // `false` on both the server and the client's first paint here; the
  // eslint-disable is the documented exception for mount-detection effects.
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'
  // Gate on `mounted` like the icon below: the server (and first client
  // paint, before hydration) can't know the resolved theme, so both must
  // render the same deterministic state or React flags a hydration mismatch.
  const showDark = mounted && isDark

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-9 rounded-full"
      aria-label={showDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {showDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  )
}
