import type { Locale } from '@/lib/i18n/dictionary'
import type {
  BlogBlockDoc,
  CaseStudiesBlockDoc,
  ContactBlockDoc,
  Localized,
} from '@/lib/payload/types'

// Hero, Profile and Portfolio always render first, hardcoded, ahead of the
// blocks region. Only Profile (/ 01) and Portfolio (/ 02) carry a numbered
// eyebrow — Hero has none. This constant is the single source of truth for
// that offset; profile-section.tsx and portfolio-section-client.tsx each
// carry a comment cross-referencing it so the "2 hardcoded numbered
// sections" invariant isn't silently broken by a future edit.
export const HARDCODED_NUMBERED_COUNT = 2

const DEFAULT_LIMIT = 3

// Payload-i18n-migration design D3: `Bilingual` is kept (name unchanged —
// zero churn at existing client call sites) but now derives from the
// shared `Localized<T>` type bridge instead of duplicating its shape.
export type Bilingual = Localized<string> | null | undefined

export type HomeSection =
  | {
      kind: 'caseStudies'
      key: string
      number: number
      eyebrow: Bilingual
      title: Bilingual
      subtitle: Bilingual
      limit: number
    }
  | {
      kind: 'blog'
      key: string
      number: number
      eyebrow: Bilingual
      title: Bilingual
      subtitle: Bilingual
      limit: number
    }
  | {
      kind: 'contact'
      key: string
      title: Bilingual
      subtitle: Bilingual
    }

// The synthetic default: identical render order/copy/ordinals to today
// (Case Studies / 03, Blog / 04, Contact unnumbered), with every copy field
// absent so `pick()` falls through to the dictionary for all of them. This
// is what a missing `site-settings` global, an unset `homePage`, a home
// `pages` doc with no `layout`, or an empty `layout` array all normalize
// to — resolveHomeSections is the ONLY place that normalizes absence, so
// no component ever needs to branch on "does the page/block exist".
function defaultSections(): HomeSection[] {
  return [
    {
      kind: 'caseStudies',
      key: 'caseStudies-default',
      number: HARDCODED_NUMBERED_COUNT + 1,
      eyebrow: undefined,
      title: undefined,
      subtitle: undefined,
      limit: DEFAULT_LIMIT,
    },
    {
      kind: 'blog',
      key: 'blog-default',
      number: HARDCODED_NUMBERED_COUNT + 2,
      eyebrow: undefined,
      title: undefined,
      subtitle: undefined,
      limit: DEFAULT_LIMIT,
    },
    {
      kind: 'contact',
      key: 'contact-default',
      title: undefined,
      subtitle: undefined,
    },
  ]
}

// payload-i18n-migration A4: the `layout` blocks field itself is not
// localized (only 8 of its sub-fields are) — `PageDoc['layout']` (the raw
// generated type) declares those 8 sub-fields as single-locale scalars,
// because `generate:types` doesn't know a `locale: 'all'` read will make
// them arrive as `{ es, en }`. `HomeLayout` is the `locale: 'all'` runtime
// shape (design D3's `AllLocales<T, K>` bridge, applied per-block-type), so
// this function's signature reflects what callers actually receive rather
// than what `payload-types.ts` alone would suggest.
export type HomeLayout = (CaseStudiesBlockDoc | BlogBlockDoc | ContactBlockDoc)[] | null | undefined

/**
 * Single normalizer for the home page's `layout` blocks array. Always
 * returns a fully-populated `HomeSection[]` — never null/undefined/empty —
 * regardless of whether the home `pages` doc, the `site-settings` global,
 * or the `layout` array itself is missing.
 *
 * Ordinal numbers are derived from render position, never stored: each
 * numbered block (Case Studies, Blog) gets `HARDCODED_NUMBERED_COUNT + n`,
 * where `n` is its 1-based position among numbered blocks only — Contact is
 * skipped entirely and never consumes a number slot, so the sequence stays
 * gapless under any reorder or omission. Unknown block types (e.g. a stale
 * row after a future block removal) are skipped defensively.
 */
export function resolveHomeSections(layout: HomeLayout): HomeSection[] {
  if (!layout || layout.length === 0) {
    return defaultSections()
  }

  let numberedIndex = 0
  const sections: HomeSection[] = []

  layout.forEach((block, index) => {
    const key = block.id ?? `${block.blockType}-${index}`

    if (block.blockType === 'caseStudies' || block.blockType === 'blog') {
      numberedIndex += 1
      sections.push({
        kind: block.blockType,
        key,
        number: HARDCODED_NUMBERED_COUNT + numberedIndex,
        eyebrow: block.eyebrow,
        title: block.title,
        subtitle: block.subtitle,
        limit: block.limit && block.limit >= 1 ? block.limit : DEFAULT_LIMIT,
      })
      return
    }

    if (block.blockType === 'contact') {
      sections.push({
        kind: 'contact',
        key,
        title: block.title,
        subtitle: block.subtitle,
      })
    }
  })

  return sections
}

// Single per-field, per-locale fallback: `||` (not `??`) so an admin-saved
// empty string also falls back to the dictionary, matching the "optionality
// is the fallback mechanism" convention the homepage blocks (case-studies-
// block.ts / blog-block.ts / contact-block.ts) use for every localized field.
export function pick(value: Bilingual, locale: Locale, fallback: string): string {
  return value?.[locale] || fallback
}

// payload-i18n-migration design D4: a scoped exception to `fallback: false`
// for collection body content (blog posts, case-studies body/summary/
// result) that has no `lib/i18n/dictionary.ts` entry — the alternative
// there is a blank page, not a wrong-language string. Unlike `pick()`, the
// fallback target is always `es` (the `defaultLocale`), never the requested
// locale's opposite in general, and there's no dictionary fallback string.
export function pickContent(value: Bilingual, locale: Locale): string {
  return value?.[locale] || value?.es || ''
}
