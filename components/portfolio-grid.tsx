'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/provider'
import { mediaUrl, type ProjectDoc } from '@/lib/payload/types'
import { pickContent } from '@/lib/homepage/sections'
import { Reveal } from '@/components/motion/reveal'

export function PortfolioGrid({ projects }: { projects: ProjectDoc[] }) {
  const { t, locale } = useI18n()

  return (
    <Reveal
      className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20"
      stagger={0.08}
    >
      {projects.map((project, index) => (
        <article
          key={project.slug}
          className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground"
        >
          <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
            <span className="absolute left-2 top-2 z-10 rounded border border-border bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground backdrop-blur">
              N.{String(index + 1).padStart(2, '0')}
            </span>
            <Image
              src={mediaUrl(project.image) || '/placeholder.svg'}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
              className="object-cover grayscale contrast-[1.15] brightness-95 transition-[filter,transform] duration-500 group-hover:scale-105 group-hover:grayscale-0"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h2 className="font-display text-2xl uppercase tracking-tight">
              {project.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {pickContent(project.description, locale)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(project.tags ?? []).map(({ tag }) => (
                <Badge key={tag} variant="secondary" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
                >
                  {t.portfolio.visit}
                  <ArrowUpRight className="size-4" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <GithubIcon className="size-4" />
                  {t.portfolio.code}
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </Reveal>
  )
}
