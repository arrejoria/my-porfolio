import type {
  BlogBlock,
  CaseStudiesBlock,
  CaseStudy,
  ContactBlock,
  Media,
  Page,
  Post,
  Project,
  SiteSetting,
} from './payload-types'

// Payload's own generated types (lib/payload/payload-types.ts) are the
// source of truth for every collection/global shape — these are just
// app-facing aliases so the rest of the codebase doesn't import the
// generated file (marked "DO NOT MODIFY BY HAND") directly.

export type MediaDoc = Media
export type ProjectDoc = Project
export type PostDoc = Post
export type CaseStudyDoc = CaseStudy
export type PageDoc = Page
export type SiteSettingsDoc = SiteSetting

// Type bridge for `locale: 'all'` reads (payload-i18n-migration design D3).
//
// `payload-types.ts` declares every field as its single-locale scalar (e.g.
// `summary: string`) because it's generated from the Payload config, which
// doesn't know a given collection read will request `locale: 'all'`. At
// runtime, a `locale: 'all'` read on a `localized: true` field actually
// returns `{ es, en }`, not a scalar. `Localized<T>`/`AllLocales<T, K>` let
// read-site code (`doc.summary[locale]`, `pick()`) type-check against that
// real runtime shape without renaming the field or hand-writing a parallel
// type per collection.
//
// NOT yet wired into `CaseStudyDoc`/`PostDoc`/`ProjectDoc` above: no field
// is `localized: true` yet (that starts in the A1/A2/A3 slices), so those
// generated types are still plain scalars today. Rewiring
// `CaseStudyDoc = AllLocales<CaseStudy, 'summary' | 'content' | 'result'>`
// (and the Post/Project equivalents) happens in the same slice that
// actually converts each collection's fields — wiring it here now would
// make every current (pre-conversion) read-site consumer of these aliases
// fail to compile, which contradicts this slice's own "no schema drift"
// verification step.
export type Localized<T> = { es?: T | null; en?: T | null }
export type AllLocales<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: Localized<NonNullable<T[P]>>
}

// Homepage `layout` block aliases — used by lib/homepage/sections.ts and the
// homepage section components so they don't import payload-types directly.
export type CaseStudiesBlockDoc = CaseStudiesBlock
export type BlogBlockDoc = BlogBlock
export type ContactBlockDoc = ContactBlock

export function mediaUrl(media: MediaDoc | number | null | undefined): string | undefined {
  if (!media || typeof media === 'number') return undefined
  return media.url ?? undefined
}
