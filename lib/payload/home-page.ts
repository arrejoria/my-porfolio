import { cache } from 'react'
import { getPayload } from './get-payload'
import type { PageDoc, SiteSettingsDoc } from './types'

// Resolves the home page doc via SiteSettings.homePage, the same
// relationship app/(payload)/admin/components/ViewSiteDropdown.tsx already
// reads. `depth: 1` is enough: it only affects *relationships*, and
// `homePage` is the only relationship here — the resolved Page doc's
// `layout` blocks always arrive with it regardless of depth. Wrapped in
// React's `cache()` so `generateMetadata` and the page component (which
// both need this in the same request) only trigger one query.
//
// Returns `null` when the global was never saved, `homePage` is unset, or
// the relationship can't be resolved — callers (via
// lib/homepage/sections.ts's resolveHomeSections) treat `null` identically
// to "home doc exists but has an empty layout".
export const getHomePage = cache(async (): Promise<PageDoc | null> => {
  const payload = await getPayload()

  let settings: SiteSettingsDoc | null = null
  try {
    settings = (await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })) as SiteSettingsDoc
  } catch {
    return null
  }

  const homePage = settings?.homePage
  if (homePage && typeof homePage === 'object') {
    return homePage as PageDoc
  }

  return null
})
