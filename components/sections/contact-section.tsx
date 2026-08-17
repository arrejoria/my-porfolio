'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SocialLinks } from '@/components/social-links'
import { useI18n } from '@/lib/i18n/provider'

export function ContactSection() {
  const { t } = useI18n()

  return (
    <section id="contact" className="border-t border-border/60 bg-vignette">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 md:py-28">
        <h2 className="font-display text-4xl uppercase tracking-tight sm:text-5xl md:text-6xl">
          {t.contact.title}
        </h2>
        <span className="mt-4 block h-px w-24 bg-primary" />
        <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {t.contact.subtitle}
        </p>

        <Button
          render={
            <Link href="/contact">
              {t.hero.contact}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          }
          size="lg"
          className="group mt-9 rounded-full px-7"
        />

        <p className="mt-10 text-sm text-muted-foreground">{t.contact.or}</p>
        <SocialLinks className="mt-3" />
      </div>
    </section>
  )
}
