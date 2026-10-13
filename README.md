# German Driving License Guide

A German cheat sheet for the driving licence Klasse B: the theory exam and the practical exam on a few visual pages.

**Live → [livelucky.github.io/german-driving-license-guide](https://livelucky.github.io/german-driving-license-guide/)**

## What's inside

- **Theorie**: every formula (Reaktionsweg, Bremsweg, Gefahrbremsung, Anhalteweg) and the numbers the question catalogue keeps asking, as charts and with memory hooks
- **Vorfahrt**: right of way as diagrams
- **Zeichen**: 109 road signs with official StVO artwork
- **Praxis**: the basic maneuvers as diagrams, exam format, common fail reasons
- Static HTML, no server, no database

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 6 (static) |
| Styling | Tailwind CSS v4 |
| Deployment | GitHub Pages via Actions |

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
