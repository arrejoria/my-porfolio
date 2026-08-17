import { Mail, MessageCircle } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/icons'
import { profile } from '@/lib/site-data'
import { cn } from '@/lib/utils'

const links = [
  { href: profile.socials.github, label: 'GitHub', Icon: GithubIcon },
  { href: profile.socials.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
  { href: `mailto:${profile.email}`, label: 'Email', Icon: Mail },
  { href: profile.socials.whatsapp, label: 'WhatsApp', Icon: MessageCircle },
]

export function SocialLinks({
  className,
  subset,
}: {
  className?: string
  subset?: number
}) {
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
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Icon className="size-[18px]" />
        </a>
      ))}
    </div>
  )
}
