import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Fraunces, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { I18nProvider } from '@/lib/i18n/provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Toaster } from '@/components/ui/sonner'
import { ClickBurstOverlay } from '@/components/motion/click-burst'
import { getPayload } from '@/lib/payload/get-payload'
import type { PostDoc } from '@/lib/payload/types'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-hanken',
  display: 'swap',
})

const jbmono = JetBrains_Mono({
  subsets: ['latin'],
  weight: '500',
  variable: '--font-jbmono',
  display: 'swap',
})

// The one deliberate accent typeface — a warmer serif italic used sparingly
// for a handful of "editorial" moments (see design.md's typography
// exception note). Every other role uses the three fonts above.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

// Falls back to localhost on any invalid value (blank, whitespace, missing
// scheme) rather than throwing — `metadata` below is a module-scope object,
// evaluated at boot, so an unguarded `new URL()` here would take the entire
// (site) layout down on a bad NEXT_PUBLIC_SITE_URL, not just SEO metadata.
function safeSiteUrl(value: string | undefined): URL {
  try {
    if (!value?.trim()) throw new Error('empty')
    return new URL(value)
  } catch {
    return new URL('http://localhost:3000')
  }
}

export const metadata: Metadata = {
  // Required for og:image/twitter:image to resolve to an absolute URL in
  // production — Media docs (lib/payload/types.ts's mediaUrl()) return
  // relative paths, and without metadataBase Next falls back to
  // http://localhost:3000 on a self-hosted (non-Vercel) deploy like this one.
  metadataBase: safeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Lucas Arrejoria — Full Stack Developer',
  description:
    'Portafolio personal, proyectos y blog de Lucas Arrejoria, Full Stack Developer especializado en WordPress, PHP, automatización con n8n e integraciones con IA.',
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0b' },
    { media: '(prefers-color-scheme: light)', color: '#f7f6f4' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { published: { equals: true } },
    limit: 1,
    sort: '-createdAt',
    locale: 'all',
  })
  const latestPost = (docs[0] as PostDoc | undefined) ?? null

  return (
    <html lang="es" suppressHydrationWarning className="bg-background">
      <body
        className={`${bricolage.variable} ${hanken.variable} ${jbmono.variable} ${fraunces.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          value={{ light: 'light', dark: 'dark' }}
        >
          <I18nProvider>
            <div className="flex min-h-svh flex-col">
              <SiteHeader latestPost={latestPost} />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <Toaster />
            <ClickBurstOverlay />
          </I18nProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
