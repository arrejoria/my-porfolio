'use client'

import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { SocialLinks } from '@/components/social-links'
import { useI18n } from '@/lib/i18n/provider'
import { whatsappHref, type ContactSettingsDoc } from '@/lib/payload/types'

export function ContactPageContent({ settings }: { settings: ContactSettingsDoc }) {
  const { t } = useI18n()

  return (
    <>
      <PageHeader title={t.contact.title} subtitle={t.contact.subtitle} />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 md:py-20">
        <Button
          render={
            <a href={whatsappHref(settings)} target="_blank" rel="noreferrer">
              {settings.buttonLabel}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          }
          size="lg"
          className="group rounded-full px-7"
        />

        <p className="mt-10 text-sm text-muted-foreground">{t.contact.or}</p>
        <SocialLinks className="mt-3" />
      </div>
    </>
  )
}
