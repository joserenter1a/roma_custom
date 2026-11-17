# Roma Custom Specialties — Style Guide

Roman classical architecture × modern UI. All tokens live in `:root` in `css/styles.css`.

## Color tokens

| Token | Hex | Use |
|---|---|---|
| `--burgundy` | `#5C0F1E` | Primary brand, headings on light, scrolled header |
| `--wine` | `#3A0A13` | Dark sections, footer |
| `--wine-deep` | `#2A0710` | Trust bar, deepest surfaces |
| `--claret` | `#7D1A2C` | Hover, accent lede text |
| `--gold` | `#C9A24B` | Primary accent, icons, focus rings |
| `--gold-antique` | `#A8823A` | Borders, dividers |
| `--gold-champagne` | `#E8CF8A` | Gradient highlight, text accents on dark |
| `--gold-ink` | `#7A5A1F` | Gold-toned **small text on light** backgrounds (AA-safe) |
| `--parchment` | `#F7F1E6` | Light background |
| `--travertine` | `#E9E1D3` | Alternate light sections |
| `--ink` | `#1F1A17` | Body text on light |
| `--on-dark` / `--on-dark-soft` | `#F3EADB` / `#CDBFA9` | Text on burgundy/wine |

`--gold-gradient` (135°, antique → champagne → gold → shadow) is the metallic gold, used for CTAs, numerals, monogram and display accents. Use it sparingly.

## Typography

| Role | Family | Treatment |
|---|---|---|
| Display / headings | Cinzel | Uppercase, letter-spacing 0.06–0.12em |
| Labels / eyebrows | Cinzel | `--fs-xs`, letter-spacing 0.24em, e.g. `— OPUS FABRILE —` |
| Accent / quotes | Cormorant Garamond Italic | Ledes, testimonials, hero subline |
| Body / UI | Manrope | 1.7 line-height |

Fluid scale (`clamp()`): `--fs-xs` → `--fs-sm` → `--fs-base` → `--fs-lg` → `--fs-xl` → `--fs-2xl` → `--fs-hero` (up to 6rem).

## Spacing & layout
- 8pt scale: `--s-1` (8px) … `--s-12` (96px). Section padding: `--section-y`.
- Container max 1280px, fluid gutter (16px min on mobile).
- Breakpoints: 1100px (2-col cards), 960px (mobile nav, stacked splits), 640px (single column).

## Motifs
- **Greek key**: `.greek-key` (+ `--top` to pin to section top), an SVG tile in `--greek-key`.
- **Laurel wreath**: `<svg><use href="#laurel"/></svg>`, colored via `color`.
- **Roman arch**: `border-radius: 999px 999px 4px 4px` (`.arch-frame`, `.service-card`, `.map-frame`), with an inset gold hairline.
- **Fluted columns**: `.hero-column` (hero frame), `.pillar` (values), and the fluted shaft background.
- **Marble**: `.marble` / `.marble--dark` add a low-opacity veining overlay.
- **Roman numerals**: steps, pillars, quote points, footer year (auto-generated in JS).

## Components
- `.btn` + `.btn-gold` (primary, with shimmer sweep) / `.btn-outline` (secondary on dark) / `.btn-lg` / `.btn-block`
- `.text-link` (uppercase link with sliding arrow)
- `.section` + `--parchment` / `--stone` / `--wine` / `--burgundy`
- `.section-head` (`--center` / `--split`), `.section-label`, `.section-title`, `.section-intro`
- `.service-card`, `.pillar`, `.step`, `.review-card`, `.gallery-item` + lightbox
- `.insta-grid` / `.insta-tile` (square Instagram tiles with gold hairline + icon overlay on hover)
- `.field` floating-label inputs with inline validation (`.is-invalid`, `.field-error`)
- `.reveal` scroll-in animation (staggered automatically; disabled under `prefers-reduced-motion`)

## Before launch (TODOs in code)
1. Replace placeholder phone, email, hours, domain, social URLs, and CSLB license number.
2. Replace the **sample testimonials and 5.0 rating** with real, verifiable reviews.
3. Swap Unsplash placeholder photos for Roma's own project photography.
4. Connect the quote form to a real endpoint (Formspree, Netlify Forms, or a backend). See `js/main.js`.
5. Instagram section: set `INSTAGRAM_FEED_URL` in `js/main.js` (e.g. a Behold.so feed) to show the latest posts; until then it shows placeholder tiles linking to @roma_customspecialties.
