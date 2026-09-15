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

const textNode = (text: string) => ({
  type: 'text',
  format: 0,
  detail: 0,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

const heading = (text: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading',
  tag,
  format: '' as const,
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: [textNode(text)],
})

const paragraph = (text: string) => ({
  type: 'paragraph',
  format: '' as const,
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: [textNode(text)],
})

const richTextDoc = (blocks: ReturnType<typeof heading | typeof paragraph>[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: blocks,
  },
})

const seedCaseStudies = [
  {
    slug: 'chatbot-ia-woocommerce',
    title: 'Chatbot IA — WooCommerce',
    summary: {
      es: 'Diseñé el chatbot de IA para un e-commerce WordPress/WooCommerce de ~300 productos: system prompt, modelo, RAG y cache con Redis para bajar costo y latencia.',
      en: 'Designed the AI chatbot for a ~300-product WordPress/WooCommerce store: system prompt, model choice, RAG, and Redis caching to cut cost and latency.',
    },
    content: {
      es: richTextDoc([
        paragraph(
          'Chatbot conversacional con IA para un e-commerce en WordPress/WooCommerce de aproximadamente 300 productos, pensado para que los usuarios descubran productos, promociones y recomendaciones por lenguaje natural en lugar de depender solo del buscador tradicional.',
        ),
        heading('El problema'),
        paragraph(
          'Enviar el catálogo completo al modelo en cada interacción disparaba el costo, agregaba ruido y aumentaba la latencia de respuesta. Había que resolver cómo darle al LLM solo la información relevante para cada consulta, sin perder precisión ni agregar demoras perceptibles en la conversación.',
        ),
        heading('Lo que hice'),
        paragraph(
          'Diseñé el system prompt y elegí el modelo, ajustando parámetros como la temperature para equilibrar precisión y naturalidad en las respuestas. Sobre el flujo conversacional armado en Typebot, integré un agente con acceso a herramientas y al catálogo mediante un enfoque RAG, recuperando solo la información relevante para cada consulta en lugar de enviar los 300 productos en cada turno.',
        ),
        paragraph(
          'Hice pruebas exhaustivas contra el catálogo real para afinar el comportamiento del modelo y encontrar los requerimientos óptimos de contexto y formato de respuesta. También implementé cache con Redis para el historial conversacional — deliberadamente sin cachear productos, precios ni stock, para que esa información saliera siempre fresca desde el catálogo.',
        ),
        heading('Resultado'),
        paragraph(
          'Medí consumo de tokens y latencia en cada iteración para mantener el costo bajo control. El resultado fue un chatbot capaz de responder consultas de descubrimiento de productos con contexto acotado y relevante, con tiempos de respuesta estables gracias al cache de conversación, sin depender de enviar el catálogo completo en cada turno.',
        ),
      ]),
      en: richTextDoc([
        paragraph(
          'Conversational AI chatbot for a WordPress/WooCommerce store with around 300 products, built so users could discover products, promotions, and recommendations through natural language instead of relying solely on the traditional search.',
        ),
        heading('The problem'),
        paragraph(
          'Sending the full catalog to the model on every interaction drove up cost, added noise, and increased response latency. The challenge was feeding the LLM only the information relevant to each query, without losing accuracy or adding noticeable delays to the conversation.',
        ),
        heading('What I built'),
        paragraph(
          'I designed the system prompt and chose the model, tuning parameters like temperature to balance accuracy and natural phrasing in responses. On top of a conversational flow built in Typebot, I integrated an agent with access to tools and the product catalog using a RAG approach, retrieving only the information relevant to each query instead of sending all 300 products on every turn.',
        ),
        paragraph(
          'I ran exhaustive testing against the real catalog to fine-tune model behavior and find the optimal context and response requirements. I also implemented Redis caching for conversation history — deliberately excluding products, prices, and stock from the cache, so that data always came back fresh from the catalog.',
        ),
        heading('Result'),
        paragraph(
          'I measured token consumption and latency on every iteration to keep cost under control. The result was a chatbot able to answer product-discovery queries with focused, relevant context, with stable response times thanks to conversation caching, without needing to send the full catalog on every turn.',
        ),
      ]),
    },
    tools: [
      { tool: 'Typebot' },
      { tool: 'LLM Agents' },
      { tool: 'RAG' },
      { tool: 'Redis' },
      { tool: 'WooCommerce' },
      { tool: 'NocoDB' },
    ],
    status: 'live' as const,
    result: {
      es: 'Costo y latencia de respuesta reducidos',
      en: 'Reduced response cost and latency',
    },
    published: true,
  },
]

const seedPosts = [
  {
    slug: 'hello-world',
    title: { es: 'Hola mundo', en: 'Hello World' },
    excerpt: {
      es: 'La primera publicación de este blog.',
      en: 'The first post on this blog.',
    },
    category: 'Blog',
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
    category: 'Payload · Next.js',
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

// Homepage `pages` doc content — deliberately identical to
// lib/i18n/dictionary.ts's t.caseStudies/t.blog/t.contact copy, so the
// seeded block content is byte-for-byte the "day one" state before an
// admin customizes anything (matches what the dictionary fallback would
// already render if this doc didn't exist at all).
const homePageLayout = [
  {
    blockType: 'caseStudies' as const,
    eyebrow: { es: 'Registro de casos', en: 'Case log' },
    title: { es: 'Casos de IA & Automatización', en: 'AI & Automation Case Studies' },
    subtitle: {
      es: 'Flujos y sistemas donde la IA ejecuta y yo dirijo — n8n, integraciones y automatización aplicada.',
      en: 'Flows and systems where AI executes and I direct — n8n, integrations, and applied automation.',
    },
    limit: 3,
  },
  {
    blockType: 'blog' as const,
    eyebrow: { es: 'Notas y escritura', en: 'Notes & writing' },
    title: { es: 'Blog', en: 'Blog' },
    subtitle: {
      es: 'Notas sobre desarrollo web, aprendizajes y experimentos con nuevas tecnologías.',
      en: 'Notes on web development, learnings and experiments with new technologies.',
    },
    limit: 3,
  },
  {
    blockType: 'contact' as const,
    title: { es: 'Hablemos', en: "Let's talk" },
    subtitle: {
      es: '¿Tienes un proyecto en mente o quieres colaborar? Escríbeme y te responderé pronto.',
      en: 'Have a project in mind or want to collaborate? Send me a message and I will get back to you soon.',
    },
  },
]

async function seed() {
  const payload = await getPayload({ config })

  // payload-i18n-migration A3: `description` is now `localized: true`, not a
  // `{es,en}` group — same two-step create(es)+update(en) pattern
  // established by A1 (case-studies)/A2 (posts): the Local API has no
  // `locale: 'all'` write mode (that's read-only).
  let createdProjects = 0
  for (const { imageFile, description, ...project } of seedProjects) {
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

    const created = await payload.create({
      collection: 'projects',
      locale: 'es',
      data: { ...project, description: description.es, image },
    })
    await payload.update({
      collection: 'projects',
      id: created.id,
      locale: 'en',
      data: { description: description.en },
    })
    createdProjects += 1
  }

  // payload-i18n-migration A1: summary/content/result are now
  // `localized: true` scalars, not a `{es,en}` group — the Local API has no
  // `locale: 'all'` write mode (that's read-only), so a localized doc is
  // seeded in two calls: `create` with `locale: 'es'` (the defaultLocale)
  // for every field, then `update` with `locale: 'en'` for just the three
  // localized ones. Reused verbatim by A2 (posts)/A3 (projects) — see
  // apply-progress for the pilot-slice playbook this establishes.
  let createdCaseStudies = 0
  for (const { summary, content, result, ...caseStudy } of seedCaseStudies) {
    const existing = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: caseStudy.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) continue

    const created = await payload.create({
      collection: 'case-studies',
      locale: 'es',
      data: { ...caseStudy, summary: summary.es, content: content.es, result: result?.es },
    })
    await payload.update({
      collection: 'case-studies',
      id: created.id,
      locale: 'en',
      data: { summary: summary.en, content: content.en, result: result?.en },
    })
    createdCaseStudies += 1
  }

  // payload-i18n-migration A2: title/excerpt/content are now `localized:
  // true` scalars, not `{es,en}` groups — same two-step create(es)+update(en)
  // pattern established by A1's case-studies loop (Local API has no
  // `locale: 'all'` write mode).
  let createdPosts = 0
  for (const { title, excerpt, content, ...post } of seedPosts) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) continue

    const created = await payload.create({
      collection: 'posts',
      locale: 'es',
      data: { ...post, title: title.es, excerpt: excerpt.es, content: content.es },
    })
    await payload.update({
      collection: 'posts',
      id: created.id,
      locale: 'en',
      data: { title: title.en, excerpt: excerpt.en, content: content.en },
    })
    createdPosts += 1
  }

  const existingHomePage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: '/' } },
    limit: 1,
  })
  const homePage =
    existingHomePage.docs[0] ??
    (await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: '/',
        layout: homePageLayout,
      },
    }))
  const createdHomePage = existingHomePage.docs.length === 0

  let updatedSiteSettings = false
  // Mirrors app/(payload)/admin/components/ViewSiteDropdown.tsx: findGlobal
  // throws if `site-settings` was never saved before (e.g. brand-new DB).
  let currentHomePageId: number | undefined
  try {
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    const currentHomePage = siteSettings.homePage
    currentHomePageId =
      currentHomePage && typeof currentHomePage === 'object' ? currentHomePage.id : currentHomePage
  } catch {
    currentHomePageId = undefined
  }
  if (currentHomePageId !== homePage.id) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: { homePage: homePage.id },
    })
    updatedSiteSettings = true
  }

  console.log(
    `Inserted ${createdProjects} project(s), ${createdCaseStudies} case stud${createdCaseStudies === 1 ? 'y' : 'ies'}, and ${createdPosts} post(s). Existing slugs were skipped.`,
  )
  console.log(
    `Home page: ${createdHomePage ? 'created' : 'already existed'}. site-settings.homePage: ${updatedSiteSettings ? 'updated' : 'already pointed at home'}.`,
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
