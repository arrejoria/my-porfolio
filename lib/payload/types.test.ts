import { describe, expect, expectTypeOf, it } from 'vitest'
import type { AllLocales, Localized } from './types'

// Pure mapped types have no runtime behavior, so `tsc --noEmit` is what
// actually enforces the `expectTypeOf` assertions below. Under `vitest run`,
// this file is transpiled with esbuild before execution: the `import type`
// statement above is erased and every `expectTypeOf(x).toEqualTypeOf<...>()`
// loses its generic type argument, so those calls assert nothing at runtime.
// The only thing that survives into the runtime `vitest run` pass is the
// `expect(x).toEqual(literal)` calls, which compare hand-written JS object
// literals against each other and are independent of how `Localized<T>` /
// `AllLocales<T, K>` are actually defined in `types.ts` — they would still
// pass even if those utility types were redefined incorrectly or deleted.
// This file is therefore a documentation/smoke-test aid only; the real
// type-safety guarantee for `Localized<T>` and `AllLocales<T, K>` comes from
// the separate `tsc --noEmit` step in CI (.github/workflows/ci.yml), not
// from this file's behavior under `vitest run`.
// `AllLocales<T, K>` resolves to an intersection type (`Omit<T,K> & {...}`)
// — asserting `expectTypeOf(doc).toEqualTypeOf<...>()` directly against an
// intersection trips a TS/expect-type overload-resolution bug in this repo's
// installed versions (reproduced in isolation, unrelated to this file's
// types). Asserting per-property instead (`doc.title`, `doc.summary`, ...)
// sidesteps it because each property access resolves to a plain object
// type, and still exercises exactly what this bridge promises under `tsc
// --noEmit`: wrapped keys become `Localized<T[K]>`, untouched keys keep T's
// original type.

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
