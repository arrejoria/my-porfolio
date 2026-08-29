export type Locale = 'es' | 'en'

export const dictionary = {
  es: {
    nav: {
      home: 'Inicio',
      portfolio: 'Proyectos',
      caseStudies: 'Automatización',
      blog: 'Blog',
      admin: 'Panel',
      mainLabel: 'Principal',
      mobileLabel: 'Móvil',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      menu: 'Menú',
      theme: 'Tema',
      language: 'Idioma',
      light: 'Claro',
      dark: 'Oscuro',
    },
    hero: {
      role: 'Full Stack Developer',
      subtitle:
        'WordPress, PHP y automatización con n8n — más de 6 años construyendo sitios, integraciones y flujos con IA aplicada.',
      discover: 'Ver proyectos',
      contact: 'Hablemos',
    },
    about: {
      title: 'Sobre mí',
      body: 'Full Stack Developer en Buenos Aires. Más de 6 años trabajando con WordPress, PHP y JavaScript, hoy orientando el perfil hacia automatización e integraciones: n8n, TypeScript, Supabase y APIs externas. Soluciones mantenibles, escalables, sin vueltas.',
    },
    skills: {
      title: 'Lo que sé',
      body: 'Sin porcentajes. Una cinta que corre sola, agrupada por función — lo que cruza el centro se invierte a negativo.',
      columns: {
        core: 'Core Stack',
        backend: 'Backend & CMS',
        ai: 'AI & Automatización',
        infra: 'Infraestructura',
      },
    },
    portfolio: {
      title: 'Proyectos',
      subtitle: 'Un rollo de película, no una grilla. Arrastrá para recorrerlo.',
      visit: 'Visitar',
      code: 'Código',
      viewAll: 'Ver todos los trabajos',
      framesLabel: 'CUADROS',
      dragHint: 'ARRASTRÁ PARA VER MÁS →',
    },
    caseStudies: {
      title: 'Casos de IA & Automatización',
      subtitle:
        'Flujos y sistemas donde la IA ejecuta y yo dirijo — n8n, integraciones y automatización aplicada.',
      readMore: 'Ver caso completo',
      empty: 'Todavía no hay casos publicados. Vuelve pronto.',
      back: 'Volver a casos',
      publishedOn: 'Publicado el',
      viewAll: 'Ver todos los casos',
      toolsLabel: 'Herramientas',
      demo: 'Ver demo',
      code: 'Código',
    },
    blog: {
      title: 'Blog',
      subtitle:
        'Notas sobre desarrollo web, aprendizajes y experimentos con nuevas tecnologías.',
      readMore: 'Leer más',
      empty: 'Todavía no hay publicaciones. Vuelve pronto.',
      back: 'Volver al blog',
      publishedOn: 'Publicado el',
      minRead: 'min de lectura',
      viewAll: 'Ver todo el blog',
      comingSoon: 'Próximamente',
    },
    contact: {
      title: 'Hablemos',
      subtitle:
        '¿Tienes un proyecto en mente o quieres colaborar? Escríbeme y te responderé pronto.',
      or: 'O encuéntrame en',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      builtWith: 'Diseñado y desarrollado por Lucas Arrejoria.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      portfolio: 'Projects',
      caseStudies: 'Automation',
      blog: 'Blog',
      admin: 'Admin',
      mainLabel: 'Main',
      mobileLabel: 'Mobile',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      menu: 'Menu',
      theme: 'Theme',
      language: 'Language',
      light: 'Light',
      dark: 'Dark',
    },
    hero: {
      role: 'Full Stack Developer',
      subtitle:
        'WordPress, PHP, and automation with n8n — 6+ years building sites, integrations, and AI-powered workflows.',
      discover: 'View projects',
      contact: "Let's talk",
    },
    about: {
      title: 'About me',
      body: 'Full Stack Developer based in Buenos Aires. 6+ years working with WordPress, PHP, and JavaScript, now steering toward automation and integrations: n8n, TypeScript, Supabase, and external APIs. Maintainable, scalable solutions — no fuss.',
    },
    skills: {
      title: 'What I know',
      body: 'No percentages. A ribbon that runs on its own, grouped by function — whatever crosses the center inverts to negative.',
      columns: {
        core: 'Core Stack',
        backend: 'Backend & CMS',
        ai: 'AI & Automation',
        infra: 'Infrastructure',
      },
    },
    portfolio: {
      title: 'Projects',
      subtitle: 'A film reel, not a grid. Drag to scroll through it.',
      visit: 'Visit',
      code: 'Code',
      viewAll: 'View all work',
      framesLabel: 'FRAMES',
      dragHint: 'DRAG TO SEE MORE →',
    },
    caseStudies: {
      title: 'AI & Automation Case Studies',
      subtitle:
        'Flows and systems where AI executes and I direct — n8n, integrations, and applied automation.',
      readMore: 'Read full case',
      empty: 'No case studies yet. Check back soon.',
      back: 'Back to case studies',
      publishedOn: 'Published on',
      viewAll: 'View all case studies',
      toolsLabel: 'Tools',
      demo: 'View demo',
      code: 'Code',
    },
    blog: {
      title: 'Blog',
      subtitle:
        'Notes on web development, learnings and experiments with new technologies.',
      readMore: 'Read more',
      empty: 'No posts yet. Check back soon.',
      back: 'Back to blog',
      publishedOn: 'Published on',
      minRead: 'min read',
      viewAll: 'View all posts',
      comingSoon: 'Coming soon',
    },
    contact: {
      title: "Let's talk",
      subtitle:
        'Have a project in mind or want to collaborate? Send me a message and I will get back to you soon.',
      or: 'Or find me on',
    },
    footer: {
      rights: 'All rights reserved.',
      builtWith: 'Designed and developed by Lucas Arrejoria.',
    },
  },
} as const

type Widen<T> = { readonly [K in keyof T]: T[K] extends string ? string : Widen<T[K]> }

export type Dictionary = Widen<(typeof dictionary)['es']>
