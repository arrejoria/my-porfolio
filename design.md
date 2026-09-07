# Spacing System

Homepage sections share one spacing rhythm so the page reads as one
continuous system instead of independently-tuned blocks. This file is the
source of truth for that rhythm — new sections, and edits to existing ones,
must match it.

## Section rhythm (external spacing)

Every homepage section except the hero:

- `border-t border-border/60` — the only separator between sections. No
  section adds its own `margin-top`/`margin-bottom`; the divider plus the
  section's own padding is the entire gap.
- One outer container: `mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28`.
  `py-20` / `md:py-28` is symmetric, so the space above a section's title
  equals the space below its last element.

A section must not split its content across two separately-padded top-level
containers (e.g. a `py-20` div for the header and a second, differently
padded block for the content below it) — that breaks the symmetric
top/bottom padding and under-spaces the bottom of the section against the
next section's divider. Keep one outer padded container; use the `mt-*`
values below for internal rhythm instead.

The hero (`hero-section.tsx`) is the one intentional exception: taller
`py-24 md:py-36`, no `border-t` since it's first in the page.

## Header block (internal spacing)

Every section's heading block, in order:

```tsx
<h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
  {title}
</h2>
<span className="mt-4 block h-px w-24 bg-primary" aria-hidden="true" />
<p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
  {subtitle}
</p>
```

- Heading always scales `text-4xl sm:text-5xl md:text-6xl` — don't drop the
  `md:` step.
- Underline accent is always `mt-4` off the heading.
- Subtitle is always `mt-6` off the underline.

`skills-section.tsx` and `contact-section.tsx` center this block
(`text-center`, `mx-auto`) instead of left-aligning it — that's a layout
choice, not a rhythm exception; the `mt-4`/`mt-6` values still apply.

## Content gaps

- `mt-12` from the subtitle to the section's main content (grid, list,
  ticker, carousel track).
- `mt-10` from the main content to a secondary CTA/footer row ("view all"
  link, stat/counter row).

## Reference implementations

`case-studies-section-client.tsx` and `blog-section-client.tsx` are the
cleanest examples of the full pattern (one outer container, header block,
`mt-12` content, `mt-10` CTA).
