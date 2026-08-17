import { describe, expect, it } from 'vitest'
import { dictionary } from '@/lib/i18n/dictionary'

function collectKeyPaths(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return [prefix]
  }

  return Object.keys(value)
    .sort()
    .flatMap((key) =>
      collectKeyPaths((value as Record<string, unknown>)[key], prefix ? `${prefix}.${key}` : key),
    )
}

describe('dictionary', () => {
  it('has the exact same key structure for every locale', () => {
    const esKeys = collectKeyPaths(dictionary.es)
    const enKeys = collectKeyPaths(dictionary.en)

    expect(enKeys).toEqual(esKeys)
  })
})
