import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { PortfolioSection } from '@/components/sections/portfolio-section'
import { CaseStudiesSection } from '@/components/sections/case-studies-section'
import { BlogSection } from '@/components/sections/blog-section'
import { ContactSection } from '@/components/sections/contact-section'

// Homepage content (Portfolio/Blog sections) reads from Payload's Local API,
// which needs a live Postgres connection — force dynamic rendering so the
// page doesn't require DB access at `next build` time and always serves
// fresh CMS content per request.
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <PortfolioSection />
      <CaseStudiesSection />
      <BlogSection />
      <ContactSection />
    </>
  )
}
