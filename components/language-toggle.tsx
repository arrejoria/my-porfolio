'use client'

import { useI18n } from '@/lib/i18n/provider'
import { Button } from '@/components/ui/button'

export function LanguageToggle() {
  const { locale, toggleLocale } = useI18n()

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-9 rounded-full px-3 font-mono text-xs font-semibold tracking-wider"
      onClick={toggleLocale}
      aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a español'}
    >
      {locale === 'es' ? 'ES' : 'EN'}
    </Button>
  )
}
