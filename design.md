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

**Full-bleed exception:** sections with full-bleed content below the
header — currently `profile-section.tsx`'s tech-stack marquee rows — split
into a padded header container (`mx-auto w-full max-w-6xl px-4 py-20
sm:px-6 md:py-28`, holding the eyebrow/heading/intro block) plus a separate,
unpadded full-bleed block directly below it, outside that container. This is
intentional, not a violation: full-bleed content structurally can't live
inside a padded max-width wrapper. The section still ends flush at the last
full-bleed element's own border, with no added bottom padding — matching
every other section's symmetric top/bottom rhythm in spirit, just expressed
at the level of "no wasted space at either end" rather than identical
top/bottom container padding.

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
  eyebrow/number — see the hero exception above): Profile=01, Portfolio=02,
  Case Studies=03, Blog=04, Contact=05. The number is a static string per
  section — there's no shared numbering component/logic.

`contact-section.tsx` centers this block (`text-center`, `mx-auto`) instead
of left-aligning it — that's a layout choice, not a rhythm exception; add
`justify-center` to the eyebrow row (so its `before:` tick centers too) and
keep the `mb-5`/`mt-6` values as-is.

**Typography exceptions:**

- `case-studies-section-client.tsx` swaps its `h2` from the site's default
  `font-display` (Bricolage) to `font-serif-display` (Fraunces), and its row
  content uses two more section-scoped typefaces — `font-plex-mono` (IBM
  Plex Mono) and `font-plex-sans` (IBM Plex Sans).
- `profile-section.tsx` has no visible `h2` (a `sr-only` heading keeps the
  landmark for assistive tech); its "statement" intro paragraph uses
  `font-serif-display` (Fraunces) at reading size rather than as an
  uppercase heading, its stat number and marquee words use `font-tick`
  (Archivo, weights 700/800), and its row labels use `font-plex-mono` (IBM
  Plex Mono) like case-studies' rows.

All of these — `--font-fraunces`, `--font-plex-mono`, `--font-plex-sans`,
`--font-archivo` — are loaded via `next/font/google` in
`app/(site)/layout.tsx` and scoped only to the sections that use them. Every
other section's `h2` stays on `font-display`;
`--font-display`/`--font-sans`/`--font-mono` are unchanged sitewide.

## Content gaps

- `mt-12` from the subtitle to the section's main content (grid, list,
  ticker, carousel track).
- `mt-10` from the main content to a secondary CTA/footer row ("view all"
  link, stat/counter row).

## Reference implementations

`blog-section-client.tsx` is the cleanest example of the full pattern (one
outer container, eyebrow header block, `mt-12` content, `mt-10` CTA) with
the site's default typography. For the eyebrow header block's centered
variant, see `contact-section.tsx`. For the full-bleed-content exception
(padded header container + separate unpadded marquee block), see
`profile-section.tsx`.
