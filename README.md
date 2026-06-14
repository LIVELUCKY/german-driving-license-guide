# German Driving License Guide

A trilingual study site for the German driving licence (Führerschein) — **German · English · Arabic (RTL)**.

**Live → [livelucky.github.io/german-driving-license-guide](https://livelucky.github.io/german-driving-license-guide/)**

## What's inside

- **109 road signs** with official StVO artwork and descriptions in all three languages
- **Theory & practical rules** — right-of-way, priority chains, road markings, streets
- **Interactive sign quiz** — tracks seen/wrong signs in localStorage, supports redo-wrong mode
- **German grammar** for driving vocabulary (articles, cases)
- **Full RTL support** for Arabic
- Static HTML — no server, no database, sub-second page loads

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 6 (static, no SSR) |
| Styling | Tailwind CSS v4 |
| Interactivity | React islands |
| Content | MDX + typed JSON |
| Language | TypeScript |
| Deployment | GitHub Pages via Actions |

## Project structure

```
src/
  pages/          # / = German (default), /en/ = English, /ar/ = Arabic
  components/     # One component per page, all accept lang prop
  data/signs/     # Sign catalogue split by category (warn, prio, prohibit, ...)
  lib/            # i18n helpers, sign utils, content data
  i18n/           # UI string dictionaries (en.json, de.json, ar.json)
  content/        # Long-form MDX (legal pages)
public/signs/     # Official StVO SVG artwork (89 files, public domain)
```

## Develop

```bash
npm install
npm run dev       # dev server at localhost:4321
npm run build     # production build → dist/
npm run check     # TypeScript + Astro type check
```

## Deploy

Pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which builds the site and deploys it to GitHub Pages. The `SITE_URL` and `BASE_PATH` env vars are injected automatically by `actions/configure-pages` so all asset paths resolve correctly under the repo sub-path.

## Sign artwork & licences

Official German traffic sign graphics are **public domain** in Germany (§ 5 UrhG, official works). Most SVGs are from [osmberlin/osm-traffic-sign-tool](https://github.com/osmberlin/osm-traffic-sign-tool) and Wikimedia Commons.

Content is a **study aid** — simplified for learning. The official StVO and your Fahrschule are authoritative.
