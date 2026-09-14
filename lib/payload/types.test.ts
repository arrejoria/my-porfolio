import { describe, expect, expectTypeOf, it } from 'vitest'
import type { AllLocales, Localized } from './types'

// Pure mapped types have no runtime behavior, so `tsc --noEmit` is what
// actually enforces the `expectTypeOf` assertions below (they no-op at
// runtime under vitest's esbuild/swc transform). The `expect(...)` calls
// exercise real object literals typed against the utilities so a
// structural regression still fails a plain `vitest run`, not only tsc.
// `AllLocales<T, K>` resolves to an intersection type (`Omit<T,K> & {...}`)
// — asserting `expectTypeOf(doc).toEqualTypeOf<...>()` directly against an
// intersection trips a TS/expect-type overload-resolution bug in this repo's
// installed versions (reproduced in isolation, unrelated to this file's
// types). Asserting per-property instead (`doc.title`, `doc.summary`, ...)
// sidesteps it because each property access resolves to a plain object
// type, and still exercises exactly what this bridge promises: wrapped keys
// become `Localized<T[K]>`, untouched keys keep T's original type.

describe('Localized<T>', () => {
  it('wraps a value type in optional, nullable es/en fields', () => {
    const empty: Localized<string> = {}
    const bothSet: Localized<string> = { es: 'Hola', en: 'Hello' }
    const nulled: Localized<string> = { es: null, en: null }

    expectTypeOf(bothSet).toEqualTypeOf<{ es?: string | null; en?: string | null }>()

    expect(empty).toEqual({})
    expect(bothSet).toEqual({ es: 'Hola', en: 'Hello' })
    expect(nulled).toEqual({ es: null, en: null })
  })
})

describe('AllLocales<T, K>', () => {
  type Sample = { id: number; title: string; summary: string; result: string }

  it('wraps a single key in Localized<>, leaving the rest of T untouched', () => {
    const doc: AllLocales<Sample, 'summary'> = {
      id: 1,
      title: 'Plain title',
      result: 'Plain result',
      summary: { es: 'Resumen', en: 'Summary' },
    }

    expectTypeOf(doc.id).toEqualTypeOf<number>()
    expectTypeOf(doc.title).toEqualTypeOf<string>()
    expectTypeOf(doc.result).toEqualTypeOf<string>()
    expectTypeOf(doc.summary).toEqualTypeOf<Localized<string>>()

    expect(doc.title).toBe('Plain title')
    expect(doc.summary).toEqual({ es: 'Resumen', en: 'Summary' })
  })

  it('wraps every key in a union of K, leaving the rest of T untouched', () => {
    const doc: AllLocales<Sample, 'summary' | 'result'> = {
      id: 2,
      title: 'Untouched',
      summary: { es: 'Resumen' },
      result: { en: 'Result' },
    }

    expectTypeOf(doc.title).toEqualTypeOf<string>()
    expectTypeOf(doc.summary).toEqualTypeOf<Localized<string>>()
    expectTypeOf(doc.result).toEqualTypeOf<Localized<string>>()

    expect(doc.summary).toEqual({ es: 'Resumen' })
    expect(doc.result).toEqual({ en: 'Result' })
  })
})
