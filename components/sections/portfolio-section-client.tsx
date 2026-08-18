'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/provider'
import { mediaUrl, type ProjectDoc } from '@/lib/payload/types'
import { Reveal, prefersReducedMotion } from '@/components/motion/reveal'

export function PortfolioSectionClient({ project }: { project: ProjectDoc }) {
  const { t, locale } = useI18n()
  const imageRef = useRef<HTMLImageElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !imageRef.current) return

      gsap.from(imageRef.current, {
        scale: 1.05,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: imageRef },
  )

  return (
    <section id="work" className="border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal>
          <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
            {t.portfolio.title}
          </h2>
          <span className="mt-4 block h-px w-24 bg-primary" aria-hidden="true" />
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {t.portfolio.subtitle}
          </p>
        </Reveal>

        <Reveal
          delay={0.15}
          className="mt-12 overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-primary/50 md:grid md:grid-cols-2"
        >
          <div className="relative aspect-[16/10] overflow-hidden border-b border-border md:border-b-0 md:border-r">
            <Image
              ref={imageRef}
              src={mediaUrl(project.image) || '/placeholder.svg'}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-10">
            <h3 className="font-display text-2xl uppercase tracking-tight sm:text-3xl">
              {project.title}
            </h3>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {project.description[locale]}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {(project.tags ?? []).map(({ tag }) => (
                <Badge key={tag} variant="secondary" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25} className="mt-10 flex justify-center">
          <Button
            render={
              <Link href="/portfolio">
                {t.portfolio.viewAll}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            }
            nativeButton={false}
            variant="outline"
            className="group rounded-full px-7"
          />
        </Reveal>
      </div>
    </section>
  )
}
