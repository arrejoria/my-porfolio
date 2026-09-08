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

**`contact-section.tsx` exception:** unlike every other section, Contact
drops the eyebrow/counter header pattern entirely. Instead of an eyebrow
line + numbered heading, it opens with a status pill (`.status-dot` +
`t.hero.status`) — a deliberate bookend with the Hero section's own status
line, which opens the page with the exact same message this section closes
it with — followed by a plain italic `font-serif-display` heading (no
per-character effects). It's also the one section whose motion language is
deliberately minimal: only the status dot animates (the `breathe` keyframe
behind `.status-dot`, in `globals.css`'s `@layer utilities`); there's no
scroll-triggered character stagger, no magnetic cursor-follow CTA, and no
scramble-text email — a calmer, "closing" tone versus the rest of the
homepage's motion-heavy sections.

**Typography — one shared accent, not a font per section:** the site has
exactly four typefaces, full stop: `font-display` (Bricolage), `font-sans`
(Hanken Grotesk), `font-mono` (JetBrains Mono) everywhere by default, plus
one deliberate accent, `font-serif-display` (Fraunces, `--font-fraunces`,
loaded in `app/(site)/layout.tsx`) — a warmer serif italic used for a
handful of "editorial" moments: `case-studies-section-client.tsx`'s `h2` and
row titles, `profile-section.tsx`'s statement paragraph, and
`contact-section.tsx`'s `h2`. That's the only exception, and it's
consistent everywhere it appears — the same face, the same purpose. Earlier
drafts of these three sections each brought their own extra typeface for
mono labels and display numerals (IBM Plex Mono, IBM Plex Sans, Archivo) —
those were removed as pure redundancy: same visual role as the sitewide
fonts, different face, no design reason for the split. Don't reintroduce a
per-section typeface without a role the existing four genuinely can't cover.

`profile-section.tsx` has no visible `h2` (a `sr-only` heading keeps the
landmark for assistive tech); its "statement" intro paragraph uses
`font-serif-display` at reading size rather than as an uppercase heading.
Its stat number and marquee words use `font-display` (same extrabold
uppercase treatment as Hero's `h1`), and its row labels use the sitewide
`font-mono`.

**`site-footer.tsx` note:** the sitewide footer (rendered once in
`app/(site)/layout.tsx`, outside `<main>`, so it persists across every page)
now carries the back-to-top link (`href="#top"`, matching the `id="top"` on
`hero-section.tsx`'s root `<section>`) and a trimmed 2-icon social row
(`<SocialLinks subset={2} />` — GitHub/LinkedIn only). Email is dropped from
the footer's icon row since it's now the prominent Contact section CTA
instead.

## Background treatments

Most sections have no background beyond the page's flat `bg-background` —
that's the default, not a gap to fill in. `app/(site)/globals.css` has
`.bg-vignette` / `.bg-vignette-soft` (soft top-anchored glow, eased in from
zero so a section's top seam against a flat-black neighbor reads as
continuous rather than a hard brightness jump — `color-mix`-based, no
hardcoded color, adapts across themes). Only `profile-section.tsx` uses one
today (`bg-vignette-soft`, blending against Hero).

Don't reach for a new background mechanism without discussing it first —
three things have already been tried and reverted here: a full-page static
dot-grid texture, reusing the Hero's canvas sitewide, and applying
`bg-vignette-soft` (with shifted glow anchors) to Portfolio/Case
Studies/Blog too — that last one read as the same background repeated on
every section rather than adding distinct life to each one.

## Content gaps

- `mt-12` from the subtitle to the section's main content (grid, list,
  ticker, carousel track).
- `mt-10` from the main content to a secondary CTA/footer row ("view all"
  link, stat/counter row).

## Reference implementations

`blog-section-client.tsx` is the cleanest example of the full pattern (one
outer container, eyebrow header block, `mt-12` content, `mt-10` CTA) with
the site's default typography. For the full-bleed-content exception (padded
header container + separate unpadded marquee block), see
`profile-section.tsx`. For the no-eyebrow "closing" exception, see
`contact-section.tsx`.
