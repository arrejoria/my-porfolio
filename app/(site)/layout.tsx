import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Albert_Sans, Pathway_Gothic_One } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { I18nProvider } from '@/lib/i18n/provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const albert = Albert_Sans({
  subsets: ['latin'],
  variable: '--font-albert',
  display: 'swap',
})

const pathway = Pathway_Gothic_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pathway',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lucas Arrejoria — Frontend Developer',
  description:
    'Portafolio personal, proyectos y blog de Lucas Arrejoria, desarrollador frontend especializado en JavaScript, React, WordPress y PHP.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#141416' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="bg-background">
      <body className={`${albert.variable} ${pathway.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          value={{ light: 'light', dark: 'dark' }}
        >
          <I18nProvider>
            <div className="flex min-h-svh flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
