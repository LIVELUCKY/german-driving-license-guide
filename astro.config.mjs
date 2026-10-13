import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import astroBrokenLinksChecker from 'astro-broken-links-checker';

// SITE_URL / BASE_PATH are injected by GitHub Actions so the same source
// deploys to user.github.io (base "/") AND user.github.io/repo (base "/repo").
const SITE = process.env.SITE_URL || 'https://example.com';
const BASE = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',

  integrations: [
    icon({ include: { lucide: ['moon','sun','menu','x','search'] } }),
    sitemap({
      filter: (page) => !page.includes('/search-index'),
    }),

    astroBrokenLinksChecker({
      checkExternalLinks: true,
      throwError: false,
    }),
  ],

  build: {
    format: 'directory',
    inlineStylesheets: 'never',
  },
  compressHTML: true,

  vite: {
    plugins: [tailwindcss()],
    build: { chunkSizeWarningLimit: 750 },
  },
});
