# Führerschein Site — Developer Guide

## Stack

- **Framework**: Astro (static, no SSR)
- **Styling**: Tailwind CSS v4
- **Interactivity**: React islands
- **Content**: MDX
- **Language**: TypeScript
- **Deployment**: GitHub Pages; `BASE_URL` env var for non-root deployments

## i18n Architecture

Three supported locales: **en** (default, at `/`), **de** (at `/de/`), **ar** (at `/ar/`, RTL)

### String Categories and Where They Live

1. **Short UI strings** (nav, buttons, labels) → `src/i18n/{en,de,ar}.json`
   - Use `makeT(lang)` from `src/lib/dict.js`
   - Usage: `const T = makeT(lang); T('key')`
   - Every key must exist in all three JSON files

2. **Inline bilingual strings** → `t(lang, en, de, ar)` from `src/lib/i18n.js`
   - Always provide all 4 args — never skip Arabic
   - Fallback: `ar→en`, missing locale→`en`

3. **Long prose content** (legal, disclaimers) → `src/content/{collection}/{lang}.mdx`
   - Astro Content Collections
   - Fetch with `getEntry('collection', lang)`

4. **Signs data** → `src/data/signs.json`
   - Each sign has: `en`, `de`, `ar` (descriptions) + `tipEn`, `tipDe`, `tipAr` (tips)

5. **Sign categories (CATS)** → `src/lib/signs.js`
   - Each category has: `en`, `de`, `ar`, `d_en`, `d_de`, `d_ar`

6. **Navigation** → `src/lib/i18n.js` NAV array
   - Each item has: `en`, `de`, `ar`, `d_en`, `d_de`, `d_ar`

### Rules

- **NEVER** use `t(lang, 'English', 'German')` — always provide Arabic as 4th arg
- **NEVER** add keys to only one or two JSON files — update all three simultaneously
- **NEVER** hardcode display text in components; always use `t()` or `T()`

## Routing

- `src/pages/slug.astro` → English at `/slug/`
- `src/pages/[lang]/slug.astro` → de/ar at `/de/slug/` and `/ar/slug/`

Dynamic pages use `getStaticPaths()` returning `[{params:{lang:'de'}}, {params:{lang:'ar'}}]`.

Nested routes: `src/pages/[lang]/signs/[cat].astro` uses `flatMap` over locales × CATS.

**Component placement**: Components live in `src/components/` and accept a `lang` prop. Pages are thin wrappers.

## RTL Support

`Base.astro` sets `dir="rtl"` when `isRTL(lang)` is true (currently only 'ar').

RTL overrides in `src/styles/global.css` under `[dir="rtl"]` selectors.

## Common Tasks

### Adding a New Page

1. Create `src/pages/new-page.astro` (English)
2. Create `src/components/NewPage.astro` (accepts `lang` prop)
3. Create `src/pages/[lang]/new-page.astro` (de+ar dynamic route)
4. Add entry to NAV in `src/lib/i18n.js` with all 6 label fields
5. Add i18n keys to all 3 JSON files if using `T()`

### Adding a New Locale

1. Add to LOCALES in `src/lib/i18n.js`
2. Create `src/i18n/{locale}.json` with all keys from en.json
3. Import in `src/lib/dict.js`
4. Add MDX translations in `src/content/*/{locale}.mdx`
5. Update `astro.config.mjs` i18n.locales array and sitemap.i18n.locales
6. Add `isRTL()` check if needed

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/i18n.js` | `t()`, `isRTL()`, `urlFor()`, NAV, LOCALES, BASE |
| `src/lib/dict.js` | `makeT()`, DICT (loads all JSON files) |
| `src/lib/signs.js` | CATS, SIGNS, `byCat()`, `catOf()` |
| `src/lib/content.js` | Structured content for theory/practical/etc. |
| `src/data/signs.json` | 109 signs with multilingual fields |
| `src/content/legal/{en,de,ar}.mdx` | Legal page content (Astro collection) |
| `src/content/tips/*.mdx` | Individual sign tip pages |
| `src/i18n/{en,de,ar}.json` | UI string dictionaries |
| `src/styles/global.css` | RTL overrides |
