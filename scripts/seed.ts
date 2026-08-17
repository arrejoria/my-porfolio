if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env.local and set DATABASE_URL before running `pnpm db:seed`.',
  )
}

import path from 'node:path'
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
  {
    slug: 'agimed',
    title: 'Agimed',
    description: {
      es: 'Sitio institucional para Agimed, equipamiento médico y soluciones de salud para instituciones y profesionales.',
      en: 'Institutional site for Agimed, medical equipment and health solutions for institutions and professionals.',
    },
    tags: [{ tag: 'WordPress' }, { tag: 'PHP' }],
    liveUrl: 'https://agimed.com.ar',
    imageFile: 'agimed.jpg',
  },
  {
    slug: 'tienda-agimed',
    title: 'Tienda Agimed',
    description: {
      es: 'E-commerce especializado en CPAP, BiPAP y equipamiento de ventilación no invasiva para pacientes.',
      en: 'E-commerce specialized in CPAP, BiPAP and non-invasive ventilation equipment for patients.',
    },
    tags: [{ tag: 'WordPress' }, { tag: 'WooCommerce' }, { tag: 'PHP' }],
    liveUrl: 'https://tienda.agimed.com.ar',
    imageFile: 'tienda-agimed.jpg',
  },
  {
    slug: 'aguamat',
    title: 'Aguamat',
    description: {
      es: 'Sitio institucional para Aguamat, accesorios para redes de agua potable, sanitarias y de riego.',
      en: 'Institutional site for Aguamat, accessories for potable water, sanitary and irrigation networks.',
    },
    tags: [{ tag: 'WordPress' }, { tag: 'PHP' }],
    liveUrl: 'https://aguamat.com',
    imageFile: 'aguamat.jpg',
  },
  {
    slug: 'malegraf',
    title: 'Malegraf',
    description: {
      es: 'Sitio institucional para Malegraf, fabricante de etiquetas colgantes (hang tags) para la industria textil.',
      en: 'Institutional site for Malegraf, a hang tags manufacturer for the textile industry.',
    },
    tags: [{ tag: 'WordPress' }, { tag: 'PHP' }],
    liveUrl: 'https://malegraf.com',
    imageFile: 'malegraf.jpg',
  },
  {
    slug: 'sal-de-los-andes',
    title: 'Sal de los Andes',
    description: {
      es: 'Sitio institucional para Sal de los Andes, exportador de sales gourmet ricas en minerales y oligoelementos.',
      en: 'Institutional site for Sal de los Andes, an exporter of gourmet salts rich in minerals and trace elements.',
    },
    tags: [{ tag: 'WordPress' }, { tag: 'PHP' }],
    liveUrl: 'https://saldelosandes.com',
    imageFile: 'saldelosandes.jpg',
  },
  {
    slug: 'estudio-dalinger',
    title: 'Estudio Dalinger',
    description: {
      es: 'Sitio institucional para Estudio Dalinger, especialistas en arquitectura legal y derecho de la construcción.',
      en: 'Institutional site for Estudio Dalinger, specialists in legal architecture and construction law.',
    },
    tags: [{ tag: 'WordPress' }, { tag: 'PHP' }],
    liveUrl: 'https://estudiodalinger.com',
    imageFile: 'estudiodalinger.jpg',
  },
  {
    slug: 'starpay',
    title: 'Starpay',
    description: {
      es: 'Landing page para Starpay, una tarjeta prepaga con una nueva forma de comprar.',
      en: 'Landing page for Starpay, a prepaid card offering a new way to shop.',
    },
    tags: [{ tag: 'WordPress' }, { tag: 'PHP' }],
    liveUrl: 'https://starpaycard.com',
    imageFile: 'starpaycard.jpg',
  },
  {
    slug: 'drewolf',
    title: 'DreWolf',
    description: {
      es: 'Sitio institucional para DreWolf, servicio de desarrollo de software y contratación de desarrolladores.',
      en: 'Institutional site for DreWolf, a software development service and developer hiring platform.',
    },
    tags: [{ tag: 'React' }, { tag: 'Next.js' }],
    liveUrl: 'https://drewolf.com',
    imageFile: 'drewolf.jpg',
  },
  {
    slug: 'broder',
    title: 'Broder',
    description: {
      es: 'Sitio institucional para Broder, estudio de diseño gráfico y web con foco en branding y packaging.',
      en: 'Institutional site for Broder, a graphic and web design studio focused on branding and packaging.',
    },
    tags: [{ tag: 'WordPress' }, { tag: 'PHP' }],
    liveUrl: 'https://broder.com.ar',
    imageFile: 'broder.jpg',
  },
  {
    slug: 'hello-mushrooms',
    title: 'Hello Mushrooms',
    description: {
      es: 'E-commerce para Hello Mushrooms, snacks crocantes de shiitake, saludables y sabrosos.',
      en: 'E-commerce for Hello Mushrooms, crunchy and healthy shiitake snacks.',
    },
    tags: [{ tag: 'WordPress' }, { tag: 'WooCommerce' }, { tag: 'PHP' }],
    liveUrl: 'https://hellomushrooms.com',
    imageFile: 'hellomushrooms.jpg',
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
  for (const { imageFile, ...project } of seedProjects) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) continue

    let image: number | undefined
    if (imageFile) {
      const media = await payload.create({
        collection: 'media',
        data: { alt: project.title },
        filePath: path.resolve(process.cwd(), 'scripts', 'seed-assets', imageFile),
      })
      image = media.id
    }

    await payload.create({ collection: 'projects', data: { ...project, image } })
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
