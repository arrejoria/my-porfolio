import { getPayload } from '@/lib/payload/get-payload'
import type { PageDoc, SiteSettingsDoc } from '@/lib/payload/types'

// Rendered via admin.components.beforeNavLinks in payload.config.ts. Pure
// Server Component (no client JS) — reads SiteSettings so the admin nav can
// show a "View Site" link to whichever Pages doc is marked as home, without
// hardcoding a URL.
export async function ViewSiteDropdown() {
  const payload = await getPayload()

  let settings: SiteSettingsDoc | null = null
  try {
    settings = (await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })) as SiteSettingsDoc
  } catch {
    settings = null
  }

  const siteName = settings?.siteName ?? 'Portfolio'
  const homePage = settings?.homePage
  const homeSlug =
    homePage && typeof homePage === 'object' ? (homePage as PageDoc).slug : undefined
  const homeHref = homeSlug ? (homeSlug.startsWith('/') ? homeSlug : `/${homeSlug}`) : '/'

  return (
    <details className="view-site-dropdown">
      <summary>{siteName}</summary>
      <a href={homeHref} target="_blank" rel="noopener noreferrer">
        Ver sitio ↗
      </a>
    </details>
  )
}
