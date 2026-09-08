'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/provider'
import type { Dictionary, Locale } from '@/lib/i18n/dictionary'
import { mediaUrl, type ProjectDoc } from '@/lib/payload/types'
import { Reveal, prefersReducedMotion } from '@/components/motion/reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GithubIcon } from '@/components/icons'

const SCROLL_EDGE_TOLERANCE = 8

function ProjectCard({
  project,
  index,
  locale,
  t,
}: {
  project: ProjectDoc
  index: number
  locale: Locale
  t: Dictionary
}) {
  return (
    <article
      data-card
      className="group flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
        <span className="absolute left-2 top-2 z-10 rounded border border-border bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground backdrop-blur">
          N.{String(index + 1).padStart(2, '0')}
        </span>
        <Image
          src={mediaUrl(project.image) || '/placeholder.svg'}
          alt={project.title}
          fill
          draggable={false}
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 46vw, 31vw"
          className="object-cover grayscale contrast-[1.15] brightness-95 transition-[filter,transform] duration-500 group-hover:scale-105 group-hover:grayscale-0 group-focus-within:grayscale-0"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="truncate font-display text-lg uppercase tracking-tight">{project.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description[locale]}
        </p>
        {project.tags && project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map(({ tag }) => (
              <Badge key={tag} variant="secondary" className="font-mono text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-4 flex items-center gap-4 text-sm">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="touch-manipulation inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
              >
                {t.portfolio.visit}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="touch-manipulation inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <GithubIcon className="size-3.5" aria-hidden="true" />
                {t.portfolio.code}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export function PortfolioSectionClient({
  projects,
  totalCount,
}: {
  projects: ProjectDoc[]
  totalCount: number
}) {
  const { t, locale } = useI18n()
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setCanScrollPrev(track.scrollLeft > SCROLL_EDGE_TOLERANCE)
    setCanScrollNext(track.scrollLeft < max - SCROLL_EDGE_TOLERANCE)
  }, [])

  useEffect(() => {
    updateScrollState()
    const track = trackRef.current
    if (!track) return
    track.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState, projects.length])

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('[data-card]')
    const gap = 24
    const amount = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8
    const reducedMotion = prefersReducedMotion()

    // CSS scroll-snap fights a smooth scrollBy() on Chromium — it can yank
    // the scroll back toward the previous snap point mid-animation. Drop
    // snapping for the duration of the programmatic scroll and restore it
    // once the scroll settles (mirrors the drag-to-scroll settle pattern
    // this section used before).
    track.style.scrollSnapType = 'none'
    const reenableSnap = () => {
      track.style.scrollSnapType = ''
    }
    if ('onscrollend' in window) {
      track.addEventListener('scrollend', reenableSnap, { once: true })
    } else {
      setTimeout(reenableSnap, 500)
    }

    track.scrollBy({ left: amount * direction, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <section id="projects" className="border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground before:h-px before:w-[22px] before:bg-muted-foreground before:content-['']">
              {t.portfolio.eyebrow} <b className="font-medium tabular-nums text-foreground/80">/ 02</b>
            </p>
            <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
              {t.portfolio.title}
            </h2>
            <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              {t.portfolio.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scrollByCard(-1)}
              disabled={!canScrollPrev}
              aria-label={t.portfolio.prev}
              className="touch-manipulation"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scrollByCard(1)}
              disabled={!canScrollNext}
              aria-label={t.portfolio.next}
              className="touch-manipulation"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <div
            ref={trackRef}
            className="flex snap-x snap-proximity gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} locale={locale} t={t} />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
            <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {t.portfolio.showing} {projects.length} {t.portfolio.of} {totalCount}
            </span>
            <Button
              render={
                <Link href="/portfolio">
                  {t.portfolio.viewAll}
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              }
              nativeButton={false}
              variant="outline"
              className="touch-manipulation group rounded-full px-5"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
