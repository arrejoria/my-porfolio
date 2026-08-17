'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'

// Client-only mount flag via useSyncExternalStore instead of useState+useEffect:
// the server snapshot (false) and client snapshot (true) differ on purpose, which
// is exactly the mechanism this hook exists for — React re-renders once after
// hydration with no setState-in-effect and no hydration mismatch.
function subscribe() {
  return () => {}
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-9 rounded-full"
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {mounted && isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  )
}
