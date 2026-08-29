'use client'

import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SocialLinks } from '@/components/social-links'
import { useI18n } from '@/lib/i18n/provider'
import { profile } from '@/lib/site-data'
import { Reveal } from '@/components/motion/reveal'
import { useMagnetic } from '@/components/motion/magnetic'
import { triggerClickBurst } from '@/components/motion/click-burst'
import { useRepelText } from '@/components/motion/use-repel-text'
import { ScrambleText } from '@/components/motion/scramble-text'

export function ContactSection() {
  const { t } = useI18n()
  const ctaRef = useMagnetic<HTMLAnchorElement>()
  const repelRef = useRepelText<HTMLHeadingElement>()

  const words = t.contact.title.split(' ')

  return (
    <section id="contact" className="border-t border-border/60 bg-vignette">
      <Reveal className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 md:py-28">
        <h2
          ref={repelRef}
          className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          {words.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className={`inline-block${wordIndex < words.length - 1 ? ' mr-[0.25em]' : ''}`}
            >
              {word.split('').map((char, charIndex) => (
                <span
                  key={charIndex}
                  data-repel-char
                  className="inline-block transition-transform duration-200 ease-out"
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <span className="mt-4 block h-px w-24 bg-primary" aria-hidden="true" />
        <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {t.contact.subtitle}
        </p>

        <Button
          render={
            <a
              ref={ctaRef}
              href={`mailto:${profile.email}`}
              onClick={(event) => triggerClickBurst(event.clientX, event.clientY)}
            >
              <ScrambleText text={profile.email} />
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          }
          nativeButton={false}
          size="lg"
          className="group mt-9 rounded-full px-7"
        />

        <p className="mt-10 text-sm text-muted-foreground">{t.contact.or}</p>
        <SocialLinks className="mt-3" subset={2} />
      </Reveal>
    </section>
  )
}
