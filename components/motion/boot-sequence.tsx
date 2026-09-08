'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n/provider'
import { prefersReducedMotion } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'introSeenAt'
// Replay the boot after this even mid-session — long enough not to bother
// someone browsing around the site, short enough to feel fresh on return.
const TTL_MS = 60 * 60 * 1000
const TYPE_DELAY_MS = 40
const LOG_LINE_DELAY_MS = 400
const OUTRO_DELAY_MS = 800
const FADE_OUT_MS = 460

function shouldPlayBoot() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return true
    const ts = Number.parseInt(raw, 10)
    if (!ts) return true
    return Date.now() - ts > TTL_MS
  } catch {
    return true
  }
}

function markBootSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    // sessionStorage unavailable (private mode, etc.) — boot just replays
    // every load instead of persisting; not worth failing over.
  }
}

type LogLine = { text: string; bold?: boolean; blank?: boolean }

export type BootSequenceHandle = { replay: () => void }

/**
 * Full-screen boot terminal that gates the Hero's entrance. Plays once per
 * session (see `shouldPlayBoot`/TTL above), can be skipped via the button,
 * Escape/Enter/Space, or a click anywhere on the overlay, and exposes a
 * `replay()` imperative handle so Hero's topbar button can re-trigger it.
 *
 * The skip-interrupts-sleep pattern below (`skippedRef` checked before and
 * after every `sleep`) is what lets a mid-typewriter or mid-log skip jump
 * straight to the finished state instead of racing with in-flight timeouts.
 */
export const BootSequence = forwardRef<BootSequenceHandle, { onDone: () => void }>(
  function BootSequence({ onDone }, ref) {
    const { t } = useI18n()
    const [mounted, setMounted] = useState(false)
    const [visible, setVisible] = useState(false)
    const [doneFading, setDoneFading] = useState(false)
    const [typed, setTyped] = useState('')
    const [showCursor, setShowCursor] = useState(true)
    const [lines, setLines] = useState<LogLine[]>([])

    const skippedRef = useRef(false)
    const timeoutsRef = useRef<number[]>([])
    const tRef = useRef(t)
    tRef.current = t

    const clearTimers = useCallback(() => {
      for (const id of timeoutsRef.current) window.clearTimeout(id)
      timeoutsRef.current = []
    }, [])

    const sleep = useCallback((ms: number) => {
      return new Promise<void>((resolve) => {
        if (skippedRef.current) {
          resolve()
          return
        }
        const id = window.setTimeout(resolve, ms)
        timeoutsRef.current.push(id)
      })
    }, [])

    const finish = useCallback(() => {
      markBootSeen()
      setDoneFading(true)
      const id = window.setTimeout(() => {
        setVisible(false)
        onDone()
      }, FADE_OUT_MS)
      timeoutsRef.current.push(id)
    }, [onDone])

    const requestSkip = useCallback(() => {
      if (skippedRef.current) return
      skippedRef.current = true
      clearTimers()
      finish()
    }, [clearTimers, finish])

    const runBoot = useCallback(async () => {
      const reduced = prefersReducedMotion()
      skippedRef.current = false
      setDoneFading(false)
      setLines([])
      setTyped('')
      setShowCursor(true)

      const command = './init.sh'
      if (reduced) {
        setTyped(command)
      } else {
        for (let i = 1; i <= command.length; i++) {
          if (skippedRef.current) {
            setTyped(command)
            break
          }
          setTyped(command.slice(0, i))
          await sleep(TYPE_DELAY_MS)
        }
      }
      if (skippedRef.current) return
      setShowCursor(false)
      await sleep(220)
      if (skippedRef.current) return

      for (const line of tRef.current.hero.bootLog) {
        if (skippedRef.current) return
        setLines((prev) => [...prev, { text: line }])
        await sleep(reduced ? 0 : LOG_LINE_DELAY_MS)
      }
      if (skippedRef.current) return

      setLines((prev) => [
        ...prev,
        { text: '', blank: true },
        { text: tRef.current.hero.bootReady, bold: true },
        { text: tRef.current.hero.bootFinished, bold: true },
      ])
      await sleep(reduced ? 0 : OUTRO_DELAY_MS)
      if (skippedRef.current) return
      finish()
    }, [finish, sleep])

    useImperativeHandle(ref, () => ({
      replay: () => {
        clearTimers()
        setVisible(true)
        requestAnimationFrame(() => {
          void runBoot()
        })
      },
    }))

    useEffect(() => {
      setMounted(true)
      if (prefersReducedMotion() || !shouldPlayBoot()) {
        markBootSeen()
        onDone()
        return
      }
      setVisible(true)
      void runBoot()
      return clearTimers
      // Runs once on mount only — replay is handled entirely through the
      // imperative handle above, not by re-running this effect.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (!visible) return
      function onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          requestSkip()
        }
      }
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }, [visible, requestSkip])

    // Lock body scroll while the overlay is up — it's `fixed`, so without
    // this the page underneath can still scroll behind it.
    useEffect(() => {
      if (!visible) return
      const previous = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previous
      }
    }, [visible])

    if (!mounted || !visible) return null

    return (
      <div
        className={cn(
          'fixed inset-0 z-[100] flex items-center justify-center bg-background p-4 font-mono transition-[opacity,filter] duration-[450ms] ease-out sm:p-10',
          doneFading && 'pointer-events-none opacity-0 blur-md',
        )}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('[data-skip-btn]')) return
          requestSkip()
        }}
      >
        <div className="w-full max-w-[640px] overflow-hidden rounded-lg border border-border bg-card shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-[9px] rounded-full bg-muted-foreground/50" />
              <span className="size-[9px] rounded-full bg-muted-foreground/80" />
              <span className="size-[9px] rounded-full bg-foreground" />
            </div>
            <span className="text-[11px] tracking-[0.06em] text-muted-foreground/70">
              lucas@automation — zsh — ./init.sh
            </span>
            <span className="w-10" aria-hidden="true" />
          </div>

          <div className="h-[340px] overflow-hidden px-[22px] pt-5 pb-6 text-xs leading-[1.75] sm:h-[300px] sm:text-[13px]">
            <div className="mb-1 text-foreground">
              <span className="mr-2 text-muted-foreground/70" aria-hidden="true">
                ➜
              </span>
              {typed}
              {showCursor && (
                <span
                  aria-hidden="true"
                  className="ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] animate-[blink_1s_step-end_infinite] bg-foreground"
                />
              )}
            </div>
            {lines.map((line, i) =>
              line.blank ? (
                <div key={i} className="h-[1.75em]" />
              ) : (
                <div
                  key={i}
                  className={cn('text-muted-foreground', line.bold && 'font-semibold text-foreground')}
                >
                  {!line.bold && (
                    <span className="text-muted-foreground/70" aria-hidden="true">
                      ✓
                    </span>
                  )}{' '}
                  {line.text}
                </div>
              ),
            )}
          </div>
        </div>

        <button
          data-skip-btn
          type="button"
          onClick={requestSkip}
          className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-[11.5px] tracking-[0.04em] text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground sm:right-8 sm:bottom-8"
        >
          {tRef.current.hero.skipIntro}
          <kbd className="rounded border border-border px-[5px] py-px text-[10px] text-muted-foreground/70">
            ESC
          </kbd>
        </button>
      </div>
    )
  },
)
