'use client'

import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/icons'
import { useI18n } from '@/lib/i18n/provider'
import { profile } from '@/lib/site-data'
import { cn } from '@/lib/utils'
import { ScrambleText } from '@/components/motion/scramble-text'

export function SocialLinks({
  className,
  subset,
}: {
  className?: string
  subset?: number
}) {
  const { t } = useI18n()

  const links = [
    { href: profile.socials.github, label: 'GitHub', Icon: GithubIcon },
    { href: profile.socials.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
    { href: `mailto:${profile.email}`, label: t.social.email, Icon: Mail },
  ]

  const shown = subset ? links.slice(0, subset) : links
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {shown.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={cn(
            'flex h-[30px] items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/60 hover:text-foreground',
            Icon === Mail ? 'px-2.5' : 'w-[30px]',
          )}
        >
          <Icon className="size-[18px]" />
          {Icon === Mail && (
            <ScrambleText text={profile.email} className="ml-1.5 font-mono text-xs" />
          )}
        </a>
      ))}
    </div>
  )
}
