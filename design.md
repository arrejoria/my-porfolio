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

Every section's heading block, in order — an eyebrow line, the heading, then
the subtitle:

```tsx
<p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground before:h-px before:w-[22px] before:bg-muted-foreground before:content-['']">
  {t.<section>.eyebrow} <b className="font-medium tabular-nums text-foreground/80">/ 0{n}</b>
</p>
<h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
  {title}
</h2>
<p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
  {subtitle}
</p>
```

- The eyebrow is `font-mono`, small caps (`text-xs uppercase
  tracking-[0.16em]`), muted, with a short `before:` tick mark (22px line) in
  front of the label. A bold, tabular-nums section number (`/ 01`, `/ 02`, …)
  follows the label.
- Heading always scales `text-4xl sm:text-5xl md:text-6xl` — don't drop the
  `md:` step.
- The eyebrow sits `mb-5` above the heading (replaces the old `mt-4`
  underline-accent step). Subtitle is always `mt-6` off the heading.
- Numbering runs by homepage order, excluding the hero (which has no
  eyebrow/number — see the hero exception above): About=01, Skills=02,
  Portfolio=03, Case Studies=04, Blog=05, Contact=06. The number is a static
  string per section — there's no shared numbering component/logic.

`skills-section.tsx` and `contact-section.tsx` center this block
(`text-center`, `mx-auto`) instead of left-aligning it — that's a layout
choice, not a rhythm exception; add `justify-center` to the eyebrow row (so
its `before:` tick centers too) and keep the `mb-5`/`mt-6` values as-is.

**Typography exception:** `case-studies-section-client.tsx` swaps its `h2`
from the site's default `font-display` (Bricolage) to `font-serif-display`
(Fraunces), and its row content uses two more section-scoped typefaces —
`font-plex-mono` (IBM Plex Mono) and `font-plex-sans` (IBM Plex Sans) — all
three loaded via `next/font/google` in `app/(site)/layout.tsx` and scoped to
that section only. Every other section's `h2` stays on `font-display`;
`--font-display`/`--font-sans`/`--font-mono` are unchanged sitewide.

## Content gaps

- `mt-12` from the subtitle to the section's main content (grid, list,
  ticker, carousel track).
- `mt-10` from the main content to a secondary CTA/footer row ("view all"
  link, stat/counter row).

## Reference implementations

`about-section.tsx` and `blog-section-client.tsx` are the cleanest examples
of the full pattern (one outer container, eyebrow header block, `mt-12`
content, `mt-10` CTA) with the site's default typography. For the eyebrow
header block's centered variant, see `skills-section.tsx` and
`contact-section.tsx`.
