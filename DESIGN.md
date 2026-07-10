# Design Guidelines

Source of truth for the portfolio's visual system. Read this before adding or editing any page so new work stays cohesive. When something here conflicts with an existing page, this document wins — fix the page.

## Principles

- **Swiss / International Typographic Style.** Neutral neo-grotesque type, strong hierarchy, generous whitespace, hairline rules, a strict grid, one accent color used sparingly.
- **Black, white, and one blue.** Color is structural, not decorative. The blue (`--accent`) marks interaction and emphasis only — never as a background wash beyond the footer and the metrics treatment it was designed for.
- **Type does the work.** Scale and weight carry the design; avoid shadows, gradients, rounded corners (except the tab/status pills), and ornament.
- **Restraint over novelty.** Reuse an existing component or layout before inventing one. Build a new layout only when the content genuinely needs it (e.g. the before/after comparison), and add it to this doc.

## Files

| File | Purpose |
|---|---|
| `index.html` | Home / landing. Hero, work grid with tabs, footer. |
| `css/concept.css` | Design tokens (`:root`), base, header, hero, cards, tabs, footer. Loaded by **every** page. |
| `css/case-study.css` | The canonical case study template — all case study layout, modules & animations. Relies on tokens from `concept.css`. |
| `js/case-study.js` | Case study behavior: scroll-reveal + scroll-driven hero expansion. Loaded by every case study. |
| `<project>.html` | One case study per file (e.g. `pdp-redesign.html`, `checkout-redesign.html`, `navigation-redesign.html`, `mobile-commerce.html`). |
| `case-study-template.html` | Copy-me skeleton for a new case study (every canonical section + optional modules commented). |
| `js/concept.js` | Tab filtering; the Healthcare tab links to the Waystar case study. |

Every page uses `class="concept"` so the shared tokens, header, and footer apply. Case studies add `case-study` plus a per-page modifier `cs-page--<slug>` for scoped, project-specific overrides.

## Design tokens (`concept.css :root`)

```
--ink:        #111111   /* primary text, hairline-on-ink, media blocks via #000 */
--paper:      #ffffff   /* page background */
--muted:      #6b6b6b   /* secondary text, captions, labels */
--line:       #e3e3e3   /* hairlines, borders */
--accent:     #1f4cff   /* the blue — interaction + emphasis only */
--accent-ink: #ffffff   /* text on accent */
--font:       'Inter', -apple-system, …   /* neo-grotesque, Helvetica/Neue Haas Unica feel */
--edge:       clamp(1.25rem, 5vw, 5rem)   /* page gutter */
--maxw:       1680px                       /* content container width */
```

Use the tokens. Image/media placeholders use `--placeholder` (light gray); `#333` is allowed for long-form body copy on white.

## Layout & grid

- Content lives in a centered container: `max-width: var(--maxw); margin: 0 auto; padding: 0 var(--edge);` (`.cs-wrap` on case studies; the header/hero/work/footer inner wrappers on the home page).
- **Header, hero, and content all share the same container** so left/right edges line up at every width. Never let one span full-width while another is capped.
- Full-bleed elements (cover image, footer, metrics band) intentionally break the container and run edge-to-edge.
- Hairline rules are `1px solid var(--line)`; section-defining rules are `2px solid var(--ink)`.

## Typography

- One typeface: **Inter**, weights 400/500/600/700/800.
- Display/hero: weight 800, `letter-spacing: -0.03em`, `line-height` ~1.0–1.05.
- The home hero uses **fixed line breaks** (`<br class="hero-br">`) for a deliberate three-line shape; the breaks are hidden under 620px so it wraps naturally on mobile.
- Eyebrows / labels: ~0.7–0.8rem, weight 700, `text-transform: uppercase`, `letter-spacing: 0.1–0.14em`.
- Body copy: 1–1.2rem, `line-height` ~1.55–1.6, color `#333` on white.
- Prefer `clamp()` for anything large so it scales with viewport.

## Components

- **Header** — sticky, blurred, hairline bottom. Wordmark left, nav right.
- **Nav** — `Work · About · Resume · LinkedIn`. Internal links stay in-tab; **external links (Resume, LinkedIn) open a new tab** (`target="_blank" rel="noopener noreferrer"`). Mirror the same links in the footer.
- **Work cards** — light-gray (`--placeholder`) `4/5` blocks, content overlaid bottom: ink title, muted description, no category tag. Linked cards are `<a class="card">`.
- **Tabs** — pill buttons, left-aligned under the section label. Active pill = `--accent` background, white text. Tab labels are the category vocabulary: **E-commerce**, **Healthcare**.
- **Footer** — full-bleed accent block, oversized statement, link column, hairline meta row.
- **Healthcare tab** — links directly to the Waystar case study (the sole healthcare project). No password gate.

## Case study system

The canonical template lives in `case-study.css` + `js/case-study.js`. To make a new one, copy `case-study-template.html`, set the `cs-page--<slug>` body class, and fill content — all layout and behavior come from the shared files, so refinements propagate to every page at once. There is no build step; "the template" is the shared CSS/JS plus the skeleton file.

**Canonical structure, in order:**

1. **Masthead** (`.cs-masthead`) — breadcrumb trail (`.cs-crumbs`), `.cs-headline`, `.cs-tagline`.
2. **Hero image** (`.cs-hero-track` > `.cs-hero`) — starts at content-container width and **expands to full-bleed on scroll** (driven by `--expand`, set in `case-study.js`).
3. **Sticky two-column intro** (`.cs-intro`) — left `.cs-intro-aside` (sticky: `Overview` eyebrow + `.cs-meta`), right `.cs-intro-body` (the editorial narrative, lead in `.cs-intro-lead`). The body is capped to the same `58ch` measure as `.cs-col-body` so columns balance.
4. **Sections** (`.cs-section` + `.cs-cols`: large sticky label left, copy right). No leading numbers — the left `.cs-label` is enlarged so it holds its own against the right column.
5. **Optional modules** as content needs: `.cs-statement`, `.cs-figure`/`.cs-shot` + `.cs-cap`, `.cs-grid3` + `.cs-figure-pair`, `.cs-compare` (before/after with revenue bars), `.cs-phases` (status pills), `.cs-takeaways`.
6. **Impact / results** — clean ink metrics (`.cs-metrics-grid`), never the accent block. Can appear early (e.g. right after the intro) when results lead the story.
7. **Close** — short two-column statement (give the closing section `.cs-impact` for bottom spacing before the footer).
8. Shared footer + `<script src="js/case-study.js">`.

**Animation** (all in `js/case-study.js`, all gated behind `prefers-reduced-motion`):
- **Reveal** — blocks with `data-reveal` fade up via IntersectionObserver (staggered inside `.cs-grid3`/`.cs-metrics-grid`). No `will-change` — it left a sub-pixel compositing seam; the transform reset handles smoothness. Keep transforms off the sticky intro's ancestors so the pin holds.
- **Hero** — `.cs-hero` width scrubs container-width → full-bleed with scroll (`--expand`).
- **Statement** — `.cs-statement-text` is split into `.cs-word` spans that fill gray → ink word-by-word as the block scrolls through the viewport. Don't put `data-reveal` on a statement; the word fill is its animation.

**Per-page overrides** — scope any project-specific tweak under the body's `cs-page--<slug>` class (e.g. `.cs-page--navigation .cs-compare { … }`). Never edit a shared `.cs-*` rule for a one-off.

### Rules — case studies

- **Breadcrumb** trail is `Work / <Category> / <Title>`; the category is a tab word (`E-commerce` / `Healthcare`).
- **Metadata is exactly: `Company · Role · Focus · Team`,** in that order. All projects are in-house, so it's `Company` (the employer), not a client, and `Focus` (the disciplines you owned), not agency `Services`. **Never include Timeline or a Live-site field.** Drop a field only if truly unknown; don't add new ones.
- One case study per HTML file; filename is the kebab-case project name. Body class is `concept case-study cs-page--<slug>`.
- Cards on the home page link to their case study; the card title matches the case study title.
- Sections carry no leading numbers; the intro is the unnumbered Overview.
- Media is a solid `--placeholder` (light gray) block until real imagery exists; every figure gets a `.cs-cap` caption.
- **Avoid horizontal scroll on desktop.** Use static grids (`.cs-grid3`, `.cs-figure-pair`).
- Keep numeric/tabular figures `font-variant-numeric: tabular-nums`.

## Content & voice

- Confident, plain, specific. Short declarative sentences. Lead with outcome and constraint, not process for its own sake.
- Placeholders are explicit (`[Brand]`, `[category]`) and flagged as illustrative where data is invented.
- Metrics state the change and what it measures (`+21% — Category page visits`).

## When adding something new

1. Check whether a token / component / layout already covers it.
2. If you must add a layout, build it from the tokens, keep it on-grid, and document it here.
3. Verify alignment against the shared container and check mobile (≤620px) doesn't overflow.
