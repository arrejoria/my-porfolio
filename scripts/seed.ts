if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env.local and set DATABASE_URL before running `pnpm db:seed`.',
  )
}

import { getPayload } from 'payload'
import config from '../payload.config'

const seedProjects = [
  {
    slug: 'portfolio-v2',
    title: 'Portfolio v2',
    description: {
      es: 'Rediseño de mi portafolio personal con un enfoque oscuro, tipografía condensada y micro-interacciones.',
      en: 'Redesign of my personal portfolio with a dark aesthetic, condensed type and micro-interactions.',
    },
    tags: [{ tag: 'Next.js' }, { tag: 'React' }, { tag: 'Tailwind CSS' }],
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
    tags: [{ tag: 'WordPress' }, { tag: 'PHP' }, { tag: 'WooCommerce' }],
  },
]

const richText = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          {
            type: 'text',
            format: 0,
            detail: 0,
            mode: 'normal' as const,
            style: '',
            text,
            version: 1,
          },
        ],
      },
    ],
  },
})

const seedPosts = [
  {
    slug: 'hello-world',
    title: { es: 'Hola mundo', en: 'Hello World' },
    excerpt: {
      es: 'La primera publicación de este blog.',
      en: 'The first post on this blog.',
    },
    content: {
      es: richText('Este es el contenido de la primera publicación seedeada.'),
      en: richText('This is the content of the first seeded post.'),
    },
    published: true,
  },
  {
    slug: 'building-with-payload',
    title: { es: 'Construyendo con Payload', en: 'Building with Payload' },
    excerpt: {
      es: 'Notas sobre cómo integré Payload CMS con Next.js App Router.',
      en: 'Notes on wiring up Payload CMS with the Next.js App Router.',
    },
    content: {
      es: richText('Este es el contenido de la segunda publicación seedeada.'),
      en: richText('This is the content of the second seeded post.'),
    },
    published: true,
  },
  {
    slug: 'draft-post',
    title: { es: 'Borrador', en: 'Draft Post' },
    excerpt: {
      es: 'Una publicación que todavía está en progreso.',
      en: 'A post still being worked on.',
    },
    content: {
      es: richText('Este es un borrador sin publicar.'),
      en: richText('This is an unpublished draft post.'),
    },
    published: false,
  },
]

async function seed() {
  const payload = await getPayload({ config })

  let createdProjects = 0
  for (const project of seedProjects) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) continue
    await payload.create({ collection: 'projects', data: project })
    createdProjects += 1
  }

  let createdPosts = 0
  for (const post of seedPosts) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) continue
    await payload.create({ collection: 'posts', data: post })
    createdPosts += 1
  }

  console.log(
    `Inserted ${createdProjects} project(s) and ${createdPosts} post(s). Existing slugs were skipped.`,
  )
}

seed()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
