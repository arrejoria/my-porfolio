import { cache } from 'react'
import { getPayload } from './get-payload'
import type { PageDoc, SiteSettingsDoc } from './types'

// Resolves the home page doc via SiteSettings.homePage, the same
// relationship app/(payload)/admin/components/ViewSiteDropdown.tsx already
// reads. `depth: 2` is required: it only affects *relationships*, and there
// are two hops here — `homePage` itself (hop 1) resolves the Page doc, but
// that doc's `meta.image` (added by @payloadcms/plugin-seo) is a nested
// relationship one level deeper (hop 2). At `depth: 1` `meta.image` stays an
// unresolved numeric ID and `mediaUrl()` treats that as "no image", so SEO
// og:image never gets set. The `layout` blocks themselves always arrive
// regardless of depth. Wrapped in React's `cache()` so `generateMetadata`
// and the page component (which both need this in the same request) only
// trigger one query.
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
      depth: 2,
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
