import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import {
  Archivo,
  Bricolage_Grotesque,
  Fraunces,
  Hanken_Grotesk,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  JetBrains_Mono,
} from 'next/font/google'
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

// Scoped to the case-studies section only — every other section keeps the
// three fonts above (see design.md's typography exception note).
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-sans',
  display: 'swap',
})

// Scoped to the profile section only (stat number + marquee words) — see
// design.md's typography exception note.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lucas Arrejoria — Full Stack Developer',
  description:
    'Portafolio personal, proyectos y blog de Lucas Arrejoria, Full Stack Developer especializado en WordPress, PHP, automatización con n8n e integraciones con IA.',
  generator: 'v0.app',
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
  })
  const latestPost = (docs[0] as PostDoc | undefined) ?? null

  return (
    <html lang="es" suppressHydrationWarning className="bg-background">
      <body
        className={`${bricolage.variable} ${hanken.variable} ${jbmono.variable} ${fraunces.variable} ${plexMono.variable} ${plexSans.variable} ${archivo.variable} font-sans antialiased`}
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
