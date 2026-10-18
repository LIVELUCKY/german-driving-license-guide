# Führerschein Spickzettel: Developer Guide

A German-only cheat sheet for the Klasse B theory and practical exams. Visual first: charts, diagrams, chunked lists with a memory hook each, and a self-test.

## Stack

- **Framework**: Astro 7, fully static. Static HTML by default.
- **Interactivity**: SolidJS islands only where something reacts to the user (`src/components/solid/`), hydrated with `client:idle` or `client:visible`.
- **Styling**: Tailwind CSS v4. Semantic tokens in `@theme inline` (`bg-surface`, `text-ink`, `border-line`, `text-accent-text`, `bg-tip`, `shadow-hard`, `rounded-box` …) follow light/dark automatically. Section-specific visuals keep a scoped `<style>` in their component. `src/styles/global.css` holds tokens, base styles, header/footer and the sign flip cards only.
- **Language**: TypeScript 6 (TypeScript 7 waits for `@astrojs/check` support).
- **Deployment**: GitHub Pages; `SITE_URL` / `BASE_PATH` are injected by the workflow.

## Structure

| Path | What |
|---|---|
| `src/pages/index.astro` | The cheat sheet: only lists the section components in reading order |
| `src/components/sections/*.astro` | One component per section, renders from typed data |
| `src/components/ui/*.astro` | Primitives: `Card`, `Kv`, `Tip`, `Note`, `Steps`, `Bullets`, `Flow`, `Grid`, `Fold` (+ `fold.ts` classes shared with Solid) |
| `src/components/solid/*.tsx` | Islands: `JumpNav`, `Quiz`, `ZahlenFolds`, `ThemeToggle`, `CookieBar`, `SignSearch` |
| `src/data/cheatsheet.ts` | Formulas, ruler, number map, jump-bar links, sign pairs |
| `src/data/zahlenfragen.json` | Numeric catalogue questions (feeds the list and the quiz) |
| `src/data/oftgefragt.ts` | Non-numeric rules in 4 groups / 20 topics, one hook each |
| `src/data/strassen.ts` | Road-type comparison |
| `src/data/glossar.ts` | Glossary |
| `src/data/signs/*.json`, `src/lib/signs.js` | Sign catalogue (`/signs/`) |
| `src/pages/legal.astro` | Sources, licences, privacy |

## Content rules

- **Every fact must be sourced**: StVO, StVG, FeV, StVZO, Bußgeldkatalog, or the official question catalogue (cite the question number). If it cannot be verified, leave it out. Driving technique is allowed when it is standard Fahrschule advice and clearly not law.
- Prefer a visual or a chunk with a memory hook over a flat list. Add a `<Tip label="Merksatz">` next to the fact it encodes; never let a mnemonic simplify a fact into something wrong.
- Explain jargon where it appears, and add it to the glossary.
- Inline SVG colours that must flip with the theme use `var(--ink)` etc.

## Checks before committing

- `npx astro check` (0 errors) and `npm run build`.
- Visual checks run headless (see memory); test interactive islands with real clicks, not only screenshots.
