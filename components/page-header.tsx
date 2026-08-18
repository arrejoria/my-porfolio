export function PageHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="relative overflow-hidden border-b border-border/60 bg-vignette">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <h1 className="font-display text-5xl uppercase tracking-tight text-balance sm:text-6xl">
          {title}
        </h1>
        <span className="mt-4 block h-px w-24 bg-primary" aria-hidden="true" />
        {subtitle && (
          <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
