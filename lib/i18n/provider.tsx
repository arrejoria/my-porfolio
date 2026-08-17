'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
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

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored === 'es' || stored === 'en') {
      setLocaleState(stored)
      document.documentElement.lang = stored
    }
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = next
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
