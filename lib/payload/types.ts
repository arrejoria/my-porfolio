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
export type Localized<T> = { es?: T | null; en?: T | null }
export type AllLocales<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: Localized<NonNullable<T[P]>>
}

// payload-i18n-migration A1: Case Studies is the pilot conversion —
// `summary`/`content`/`result` are now `localized: true` in
// lib/payload/collections/case-studies.ts, so every server read passes
// `locale: 'all'` and these three fields arrive as `{ es, en }`.
export type CaseStudyDoc = AllLocales<CaseStudy, 'summary' | 'content' | 'result'>

// payload-i18n-migration A2: `title`/`excerpt`/`content` are now
// `localized: true` in lib/payload/collections/posts.ts, replaying the A1
// pilot's playbook verbatim.
export type PostDoc = AllLocales<Post, 'title' | 'excerpt' | 'content'>

// payload-i18n-migration A3: `description` is now `localized: true` in
// lib/payload/collections/projects.ts, replaying the A1/A2 playbook.
export type ProjectDoc = AllLocales<Project, 'description'>

// payload-i18n-migration A4: `eyebrow`/`title`/`subtitle` (case-studies-block
// and blog-block) and `title`/`subtitle` (contact-block) are now
// `localized: true` in lib/payload/blocks/{case-studies,blog,contact}-block.ts,
// replaying the A1/A2/A3 playbook — same `AllLocales<T, K>` bridge (design
// D3), applied here to the `pages` collection's `layout` block union instead
// of a top-level collection. Used by lib/homepage/sections.ts's
// `resolveHomeSections()` (cast at the read-site boundary, same pattern as
// `CaseStudyDoc[]`/`PostDoc[]`/`ProjectDoc[]`) and the homepage section
// components so they don't import payload-types directly.
export type CaseStudiesBlockDoc = AllLocales<CaseStudiesBlock, 'eyebrow' | 'title' | 'subtitle'>
export type BlogBlockDoc = AllLocales<BlogBlock, 'eyebrow' | 'title' | 'subtitle'>
export type ContactBlockDoc = AllLocales<ContactBlock, 'title' | 'subtitle'>

export function mediaUrl(media: MediaDoc | number | null | undefined): string | undefined {
  if (!media || typeof media === 'number') return undefined
  return media.url ?? undefined
}
