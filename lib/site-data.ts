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
  key: 'skills' | 'frameworks' | 'learning'
  items: { name: string; level: number }[]
}

export const skillGroups: SkillGroup[] = [
  {
    key: 'skills',
    items: [
      { name: 'JavaScript', level: 92 },
      { name: 'HTML & CSS', level: 95 },
      { name: 'PHP', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'MySQL', level: 78 },
    ],
  },
  {
    key: 'frameworks',
    items: [
      { name: 'React', level: 90 },
      { name: 'WordPress', level: 92 },
      { name: 'Laravel', level: 82 },
      { name: 'Next.js', level: 80 },
      { name: 'Tailwind CSS', level: 88 },
    ],
  },
  {
    key: 'learning',
    items: [
      { name: 'n8n / Automation', level: 70 },
      { name: 'Node.js', level: 72 },
      { name: 'AI Integrations', level: 65 },
      { name: 'Docker', level: 55 },
    ],
  },
]

export type Experience = {
  role: { es: string; en: string }
  company: string
  period: string
  description: { es: string; en: string }
}

export const experience: Experience[] = [
  {
    role: { es: 'Desarrollador Frontend', en: 'Frontend Developer' },
    company: 'Freelance',
    period: '2019 — Presente',
    description: {
      es: 'Desarrollo de sitios y aplicaciones web a medida para clientes internacionales, con foco en React, WordPress y automatizaciones.',
      en: 'Custom websites and web apps for international clients, focused on React, WordPress and automations.',
    },
  },
  {
    role: { es: 'Desarrollador Web', en: 'Web Developer' },
    company: 'Agencia',
    period: '2017 — 2019',
    description: {
      es: 'Construcción y mantenimiento de sitios corporativos y e-commerce con WordPress, PHP y JavaScript.',
      en: 'Built and maintained corporate and e-commerce sites with WordPress, PHP and JavaScript.',
    },
  },
]

// Projects and blog posts are now managed by Payload CMS — see
// payload.config.ts (Projects/Posts collections) and lib/payload.ts.
