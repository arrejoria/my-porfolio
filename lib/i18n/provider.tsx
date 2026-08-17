'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react'
import { dictionary, type Dictionary, type Locale } from './dictionary'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: Dictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = 'la-locale'

type Listener = () => void
const listeners = new Set<Listener>()

function getSnapshot(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'es' || stored === 'en' ? stored : 'es'
}

function getServerSnapshot(): Locale {
  return 'es'
}

// `storage` events only fire in OTHER tabs, never the one that wrote the
// value, so setLocale calls notify() itself to trigger a re-render here too.
function subscribe(listener: Listener) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next)
    notify()
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'es' ? 'en' : 'es')
  }, [locale, setLocale])

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, toggleLocale, t: dictionary[locale] }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
