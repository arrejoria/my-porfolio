export const profile = {
  name: 'Lucas Arrejoria',
  initials: 'LA',
  roleLabel: 'WEB DEVELOPER',
  email: 'arrejoria.dev@gmail.com',
  location: 'Buenos Aires, Argentina',
  socials: {
    github: 'https://github.com/arr-dev',
    linkedin: 'https://www.linkedin.com/in/arr-dev/',
  },
}

export type SkillGroup = {
  key: 'core' | 'backend' | 'ai' | 'infra'
  /**
   * Most items are proper nouns/tech terms (locale-invariant), rendered
   * verbatim. The `'applied-ai'` sentinel marks the one item that IS a
   * translatable phrase rather than a brand/technology name — the skills
   * marquee (see `SkillsSection`) resolves it through `t.skills.appliedAi`
   * instead of rendering it as-is.
   */
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  { key: 'core', items: ['JavaScript', 'TypeScript', 'Next.js', 'React', 'HTML & CSS', 'Tailwind CSS'] },
  { key: 'backend', items: ['PHP', 'WordPress', 'WooCommerce', 'Gutenberg', 'Elementor', 'ACF', 'Gravity Forms'] },
  { key: 'ai', items: ['n8n', 'applied-ai', 'Twilio', 'APIs REST'] },
  { key: 'infra', items: ['Supabase', 'Redis', 'GNU/Linux', 'NocoDB'] },
]

// Projects and blog posts are now managed by Payload CMS — see
// payload.config.ts (Projects/Posts collections) and lib/payload.ts.
