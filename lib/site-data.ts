export const profile = {
  name: 'Lucas Arrejoria',
  initials: 'LA',
  roleLabel: 'WEB DEVELOPER',
  email: 'arrejoria.dev@gmail.com',
  location: 'Buenos Aires, Argentina',
  socials: {
    github: 'https://github.com/arr-dev',
    linkedin: 'https://www.linkedin.com/in/arr-dev/',
    whatsapp: 'https://wa.me/',
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

export type Project = {
  slug: string
  title: string
  description: { es: string; en: string }
  tags: string[]
  image: string
  liveUrl?: string
  repoUrl?: string
}

export const projects: Project[] = [
  {
    slug: 'portfolio-v2',
    title: 'Portfolio v2',
    description: {
      es: 'Rediseño de mi portafolio personal con un enfoque oscuro, tipografía condensada y micro-interacciones.',
      en: 'Redesign of my personal portfolio with a dark aesthetic, condensed type and micro-interactions.',
    },
    tags: ['Next.js', 'React', 'Tailwind CSS'],
    image: '/projects/portfolio.png',
    liveUrl: 'https://portfolio-v2-cp51gtxsx-arrejoria.vercel.app',
    repoUrl: 'https://github.com/arr-dev',
  },
  {
    slug: 'ecommerce-wp',
    title: 'E-commerce WordPress',
    description: {
      es: 'Tienda online a medida sobre WordPress + WooCommerce con pasarela de pago y panel de gestión.',
      en: 'Custom online store on WordPress + WooCommerce with payment gateway and management panel.',
    },
    tags: ['WordPress', 'PHP', 'WooCommerce'],
    image: '/projects/ecommerce.png',
    liveUrl: '#',
  },
  {
    slug: 'saas-dashboard',
    title: 'SaaS Dashboard',
    description: {
      es: 'Panel de analíticas en React con gráficos en tiempo real, autenticación y control de roles.',
      en: 'React analytics dashboard with real-time charts, authentication and role control.',
    },
    tags: ['React', 'TypeScript', 'Charts'],
    image: '/projects/dashboard.png',
    repoUrl: 'https://github.com/arr-dev',
  },
  {
    slug: 'automation-n8n',
    title: 'Automatizaciones n8n',
    description: {
      es: 'Flujos de automatización que conectan CRMs, formularios y notificaciones para clientes.',
      en: 'Automation flows connecting CRMs, forms and notifications for clients.',
    },
    tags: ['n8n', 'Node.js', 'APIs'],
    image: '/projects/automation.png',
    liveUrl: '#',
  },
]

export type BlogPreviewPost = {
  slug: string
  title: { es: string; en: string }
  excerpt: { es: string; en: string }
  date: string
  minutes: number
}

// Placeholder homepage teaser content, pending the real DB-backed blog.
export const blogPreviewPosts: BlogPreviewPost[] = [
  {
    slug: 'optimizando-rendimiento-react',
    title: {
      es: 'Optimizando el rendimiento en React',
      en: 'Optimizing performance in React',
    },
    excerpt: {
      es: 'Técnicas prácticas para reducir renders innecesarios y mejorar la percepción de velocidad en apps React.',
      en: 'Practical techniques to cut unnecessary renders and improve perceived speed in React apps.',
    },
    date: '2026-07-02',
    minutes: 6,
  },
  {
    slug: 'wordpress-headless-nextjs',
    title: {
      es: 'WordPress headless con Next.js',
      en: 'Headless WordPress with Next.js',
    },
    excerpt: {
      es: 'Cómo desacoplar WordPress como CMS y servir el frontend con Next.js sin perder lo mejor de ambos mundos.',
      en: 'How to decouple WordPress as a CMS and serve the frontend with Next.js without losing the best of both worlds.',
    },
    date: '2026-06-18',
    minutes: 7,
  },
  {
    slug: 'automatizaciones-n8n-clientes',
    title: {
      es: 'Automatizando tareas de clientes con n8n',
      en: 'Automating client workflows with n8n',
    },
    excerpt: {
      es: 'Un vistazo a los flujos que uso para conectar formularios, CRMs y notificaciones sin escribir un backend a medida.',
      en: 'A look at the flows I use to connect forms, CRMs and notifications without writing a custom backend.',
    },
    date: '2026-05-27',
    minutes: 4,
  },
]
