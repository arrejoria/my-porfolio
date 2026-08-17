import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { PortfolioSection } from '@/components/sections/portfolio-section'
import { BlogSection } from '@/components/sections/blog-section'
import { ContactSection } from '@/components/sections/contact-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <PortfolioSection />
      <BlogSection />
      <ContactSection />
    </>
  )
}
