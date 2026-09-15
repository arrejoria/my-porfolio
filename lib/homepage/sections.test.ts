import { describe, expect, it } from 'vitest'
import { HARDCODED_NUMBERED_COUNT, pick, pickContent, resolveHomeSections } from './sections'
import type { HomeLayout } from './sections'

// payload-i18n-migration A4: `eyebrow`/`title`/`subtitle` are now
// `localized: true` scalars on the block configs, so `HomeLayout` (the
// `locale: 'all'` runtime shape, design D3) is what these fixtures must
// match — not the raw generated `PageDoc['layout']`, whose block field types
// are single-locale scalars.
type Layout = NonNullable<HomeLayout>

function caseStudiesBlock(overrides: Partial<Layout[number]> = {}): Layout[number] {
  return {
    blockType: 'caseStudies',
    id: undefined,
    eyebrow: { es: 'Eyebrow ES', en: 'Eyebrow EN' },
    title: { es: 'Title ES', en: 'Title EN' },
    subtitle: { es: 'Subtitle ES', en: 'Subtitle EN' },
    limit: 5,
    ...overrides,
  } as Layout[number]
}

function blogBlock(overrides: Partial<Layout[number]> = {}): Layout[number] {
  return {
    blockType: 'blog',
    id: undefined,
    eyebrow: { es: 'Blog Eyebrow ES', en: 'Blog Eyebrow EN' },
    title: { es: 'Blog Title ES', en: 'Blog Title EN' },
    subtitle: { es: 'Blog Subtitle ES', en: 'Blog Subtitle EN' },
    limit: 4,
    ...overrides,
  } as Layout[number]
}

function contactBlock(overrides: Partial<Layout[number]> = {}): Layout[number] {
  return {
    blockType: 'contact',
    id: undefined,
    title: { es: 'Contact Title ES', en: 'Contact Title EN' },
    subtitle: { es: 'Contact Subtitle ES', en: 'Contact Subtitle EN' },
    ...overrides,
  } as Layout[number]
}

describe('resolveHomeSections', () => {
  it('returns the default 3-section layout (numbered 03/04) when layout is undefined', () => {
    const sections = resolveHomeSections(undefined)

    expect(sections.map((s) => s.kind)).toEqual(['caseStudies', 'blog', 'contact'])
    expect(sections[0]).toMatchObject({ kind: 'caseStudies', number: HARDCODED_NUMBERED_COUNT + 1 })
    expect(sections[1]).toMatchObject({ kind: 'blog', number: HARDCODED_NUMBERED_COUNT + 2 })
    expect(sections[2]).not.toHaveProperty('number')
    // every copy field is absent so pick() falls through to the dictionary
    expect(sections[0]).toMatchObject({ eyebrow: undefined, title: undefined, subtitle: undefined })
  })

  it('returns the default 3-section layout when layout is null', () => {
    const sections = resolveHomeSections(null)
    expect(sections.map((s) => s.kind)).toEqual(['caseStudies', 'blog', 'contact'])
  })

  it('returns the default 3-section layout when layout is an empty array', () => {
    const sections = resolveHomeSections([])
    expect(sections.map((s) => s.kind)).toEqual(['caseStudies', 'blog', 'contact'])
    expect(sections[0]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 1 })
    expect(sections[1]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 2 })
  })

  it('resolves all 3 real blocks in their given order, numbering only caseStudies/blog', () => {
    const sections = resolveHomeSections([caseStudiesBlock(), contactBlock(), blogBlock()])

    expect(sections.map((s) => s.kind)).toEqual(['caseStudies', 'contact', 'blog'])
    expect(sections[0]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 1 })
    expect(sections[2]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 2 })
    expect(sections[1]).not.toHaveProperty('number')
  })

  it('renumbers correctly when blog precedes case studies', () => {
    const sections = resolveHomeSections([blogBlock(), caseStudiesBlock()])

    expect(sections[0]).toMatchObject({ kind: 'blog', number: HARDCODED_NUMBERED_COUNT + 1 })
    expect(sections[1]).toMatchObject({ kind: 'caseStudies', number: HARDCODED_NUMBERED_COUNT + 2 })
  })

  it('never assigns contact a number regardless of position', () => {
    const first = resolveHomeSections([contactBlock(), caseStudiesBlock(), blogBlock()])
    expect(first[0]).not.toHaveProperty('number')
    expect(first[1]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 1 })
    expect(first[2]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 2 })

    const middle = resolveHomeSections([caseStudiesBlock(), contactBlock(), blogBlock()])
    expect(middle[1]).not.toHaveProperty('number')
    expect(middle[0]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 1 })
    expect(middle[2]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 2 })
  })

  it('renders only the present block types when layout has some blocks missing', () => {
    const onlyCaseStudies = resolveHomeSections([caseStudiesBlock()])
    expect(onlyCaseStudies.map((s) => s.kind)).toEqual(['caseStudies'])
    expect(onlyCaseStudies[0]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 1 })

    const caseStudiesAndContact = resolveHomeSections([caseStudiesBlock(), contactBlock()])
    expect(caseStudiesAndContact.map((s) => s.kind)).toEqual(['caseStudies', 'contact'])
    expect(caseStudiesAndContact[0]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 1 })

    const blogOnly = resolveHomeSections([blogBlock()])
    expect(blogOnly[0]).toMatchObject({ kind: 'blog', number: HARDCODED_NUMBERED_COUNT + 1 })
  })

  it('closes the gap when case studies is removed — blog becomes the first numbered slot', () => {
    const sections = resolveHomeSections([contactBlock(), blogBlock()])
    expect(sections.find((s) => s.kind === 'blog')).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 1 })
  })

  it('skips unknown block types defensively without breaking numbering', () => {
    const stale = { blockType: 'unknownFutureBlock', id: 'x' } as unknown as Layout[number]
    const sections = resolveHomeSections([stale, caseStudiesBlock(), blogBlock()])

    expect(sections.map((s) => s.kind)).toEqual(['caseStudies', 'blog'])
    expect(sections[0]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 1 })
    expect(sections[1]).toMatchObject({ number: HARDCODED_NUMBERED_COUNT + 2 })
  })

  it('falls back to the default limit (3) when limit is absent or below 1', () => {
    const noLimit = resolveHomeSections([caseStudiesBlock({ limit: undefined })])
    expect(noLimit[0]).toMatchObject({ limit: 3 })

    const zeroLimit = resolveHomeSections([caseStudiesBlock({ limit: 0 })])
    expect(zeroLimit[0]).toMatchObject({ limit: 3 })
  })

  it('preserves a valid limit from the block', () => {
    const sections = resolveHomeSections([caseStudiesBlock({ limit: 7 })])
    expect(sections[0]).toMatchObject({ limit: 7 })
  })

  it('uses block.id as the react key when present, otherwise a stable positional fallback', () => {
    const withId = resolveHomeSections([caseStudiesBlock({ id: 'abc123' })])
    expect(withId[0].key).toBe('abc123')

    const withoutId = resolveHomeSections([caseStudiesBlock({ id: undefined })])
    expect(withoutId[0].key).toBe('caseStudies-0')
  })
})

describe('pick', () => {
  it('returns the value for the given locale when present', () => {
    expect(pick({ es: 'Hola', en: 'Hello' }, 'es', 'fallback')).toBe('Hola')
    expect(pick({ es: 'Hola', en: 'Hello' }, 'en', 'fallback')).toBe('Hello')
  })

  it('falls back when the value is undefined', () => {
    expect(pick(undefined, 'es', 'fallback')).toBe('fallback')
  })

  it('falls back when the value is null', () => {
    expect(pick(null, 'es', 'fallback')).toBe('fallback')
  })

  it('falls back per-locale when only one side of the bilingual group is empty', () => {
    expect(pick({ es: 'Hola', en: '' }, 'en', 'fallback')).toBe('fallback')
    expect(pick({ es: '', en: 'Hello' }, 'es', 'fallback')).toBe('fallback')
  })

  it('falls back when the field itself is null on the group', () => {
    expect(pick({ es: null, en: 'Hello' }, 'es', 'fallback')).toBe('fallback')
  })
})

// payload-i18n-migration design D4: `pickContent` is a scoped exception to
// `fallback: false` for collection body content (blog posts, case-studies
// body/summary/result) that has no `lib/i18n/dictionary.ts` entry to fall
// back to — the alternative there is a blank page, not a wrong-language
// string. Unlike `pick()`, the fallback target is always `es` (the
// `defaultLocale`), not "whichever locale has content" bidirectionally.
describe('pickContent', () => {
  it('returns the value for the given locale when both es/en are present', () => {
    expect(pickContent({ es: 'Resumen', en: 'Summary' }, 'es')).toBe('Resumen')
    expect(pickContent({ es: 'Resumen', en: 'Summary' }, 'en')).toBe('Summary')
  })

  it('falls back to es when the requested locale (en) is empty', () => {
    expect(pickContent({ es: 'Resumen' }, 'en')).toBe('Resumen')
    expect(pickContent({ es: 'Resumen', en: null }, 'en')).toBe('Resumen')
  })

  it('does NOT fall back to en when the requested locale (es) is empty — fallback target is always es', () => {
    expect(pickContent({ en: 'Summary' }, 'es')).toBe('')
    expect(pickContent({ es: null, en: 'Summary' }, 'es')).toBe('')
  })

  it('returns an empty string when neither locale has a value', () => {
    expect(pickContent({}, 'es')).toBe('')
    expect(pickContent({}, 'en')).toBe('')
  })

  it('returns an empty string when the value itself is null/undefined', () => {
    expect(pickContent(null, 'es')).toBe('')
    expect(pickContent(undefined, 'en')).toBe('')
  })
})
