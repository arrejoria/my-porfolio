import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { ProfileSection } from '@/components/sections/profile-section'
import { PortfolioSection } from '@/components/sections/portfolio-section'
import { CaseStudiesSection } from '@/components/sections/case-studies-section'
import { BlogSection } from '@/components/sections/blog-section'
import { ContactSection } from '@/components/sections/contact-section'
import { getHomePage } from '@/lib/payload/home-page'
import { resolveHomeSections } from '@/lib/homepage/sections'
import type { HomeLayout } from '@/lib/homepage/sections'
import { mediaUrl } from '@/lib/payload/types'

// Homepage content (Portfolio/Blog sections) reads from Payload's Local API,
// which needs a live Postgres connection — force dynamic rendering so the
// page doesn't require DB access at `next build` time and always serves
// fresh CMS content per request.
export const dynamic = 'force-dynamic'

// Reads the home page doc's SEO meta group (added by @payloadcms/plugin-seo)
// and only assigns keys that actually have a value, so Next's shallow
// layout<->page metadata merge falls through to app/(site)/layout.tsx's
// static `metadata` export when the doc/meta is absent — the same
// cache()-wrapped getHomePage() call the page body uses, so this only
// costs one extra query dedupe hit per request, not a second DB round-trip.
export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage()
  const meta = homePage?.meta
  const imageUrl = mediaUrl(meta?.image)

  return {
    ...(meta?.title ? { title: meta.title } : {}),
    ...(meta?.description ? { description: meta.description } : {}),
    ...(imageUrl ? { openGraph: { images: [{ url: imageUrl }] } } : {}),
  }
}

export default async function HomePage() {
  const homePage = await getHomePage()
  // payload-i18n-migration A4: every server read passes `locale: 'all'`
  // (see getHomePage()), so `homePage.layout`'s 8 localized sub-fields
  // actually arrive as `{ es, en }` at runtime even though `PageDoc['layout']`
  // (generated from the Payload config alone) declares them as scalars —
  // same read-site cast pattern as `CaseStudyDoc[]`/`PostDoc[]`/`ProjectDoc[]`
  // (design D3).
  const sections = resolveHomeSections(homePage?.layout as HomeLayout)

  return (
    <>
      <HeroSection />
      <ProfileSection />
      <PortfolioSection />
      {sections.map((section) => {
        switch (section.kind) {
          case 'caseStudies':
            return <CaseStudiesSection key={section.key} block={section} />
          case 'blog':
            return <BlogSection key={section.key} block={section} />
          case 'contact':
            return <ContactSection key={section.key} block={section} />
          default: {
            const _exhaustive: never = section
            return _exhaustive
          }
        }
      })}
    </>
  )
}
