import type { CaseStudy, Media, Page, Post, Project, SiteSetting } from './payload-types'

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

export function mediaUrl(media: MediaDoc | number | null | undefined): string | undefined {
  if (!media || typeof media === 'number') return undefined
  return media.url ?? undefined
}
