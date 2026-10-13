# Führerschein Spickzettel: Developer Guide

A German-only cheat sheet for the Klasse B theory and practical exams. Visual first: charts, diagrams and short memory hooks instead of long text.

## Stack

- **Framework**: Astro (static, no SSR)
- **Styling**: Tailwind CSS v4 + hand-written components in `src/styles/global.css`
- **Language**: TypeScript / plain JS, no client framework
- **Deployment**: GitHub Pages; `SITE_URL` / `BASE_PATH` are injected by the workflow

## Pages

| Route | File | Content |
|---|---|---|
| `/` | `src/pages/index.astro` | Start page |
| `/theory/` | `src/pages/theory.astro` | Formulas, numbers, mnemonics from the official question catalogue |
| `/priority/` | `src/pages/priority.astro` | Right of way, with SVG diagrams |
| `/signs/`, `/signs/[cat]/` | `src/pages/signs/` | Sign catalogue |
| `/practical/` | `src/pages/practical.astro` | Basic maneuvers, exam format, common fail reasons |
| `/legal/` | `src/pages/legal.astro` + `src/content/legal/de.mdx` | Sources, licences, privacy |

Content lives directly in the page files as markup. Navigation is the `NAV` array in `src/lib/nav.js`.

## Content rules

- **Every number must be sourced** (StVO, StVG, FeV, StVZO, Bußgeldkatalog, or the official question catalogue). If it cannot be verified, leave it out.
- Prefer a visual (bar, scale, ruler, flow, SVG diagram) over a bullet list. CSS classes for these are at the end of `global.css` (`.stats`, `.formula`, `.bars`, `.ruler`, `.scale`, `.points`, `.flow`, `.steps`, `.chips`, `.qa`).
- Inline SVG colours that must flip with the theme use `var(--ink)` etc.

## Key files

| File | Purpose |
|---|---|
| `src/lib/nav.js` | `NAV`, `urlFor()`, `withBase()`, `prevNext()` |
| `src/lib/signs.js` | `CATS`, `SIGNS`, `byCat()`, `catOf()` |
| `src/data/signs/*.json` | Signs per category (`nameDe`, `de`, `tipDe`, `stvo`, `kw`) |
| `src/data/official.json` | Sign ids that have an SVG in `public/signs/`; the rest use an inline `drawn` SVG |
