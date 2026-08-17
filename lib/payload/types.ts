import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

// Hand-written shapes for the Payload collections defined in
// lib/payload/collections/*.ts. Payload can generate a fully typed
// payload-types.ts from a live database (`payload generate:types`), but no
// live DB is available in this environment — these mirror the field configs
// closely enough for the app to consume the Local API safely.

export type MediaDoc = {
  id: string
  url?: string | null
  alt?: string | null
}

export type ProjectDoc = {
  id: string
  title: string
  slug: string
  description: { es: string; en: string }
  tags?: { tag: string }[] | null
  image?: MediaDoc | string | null
  liveUrl?: string | null
  repoUrl?: string | null
}

export type PostDoc = {
  id: string
  title: { es: string; en: string }
  slug: string
  excerpt: { es: string; en: string }
  content: { es: SerializedEditorState; en: SerializedEditorState }
  coverImage?: MediaDoc | string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export function mediaUrl(media: MediaDoc | string | null | undefined): string | undefined {
  if (!media || typeof media === 'string') return undefined
  return media.url ?? undefined
}
