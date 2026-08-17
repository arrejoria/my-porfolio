import Link from 'next/link'
import { profile } from '@/lib/site-data'

export function BrandLogo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2"
      aria-label={`${profile.name} — inicio`}
    >
      <span className="font-display text-3xl leading-none tracking-tight text-foreground transition-colors group-hover:text-primary">
        {profile.initials}
      </span>
      <span className="h-8 w-px bg-border" aria-hidden />
      <span className="flex flex-col font-display leading-[0.85] tracking-wide text-foreground">
        <span className="text-sm">WEB</span>
        <span className="text-sm">DEVELOPER</span>
      </span>
    </Link>
  )
}
