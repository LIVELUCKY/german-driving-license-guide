import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
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
    react(),
    icon({ iconDir: 'src/icons', include: { lucide: ['moon','sun','menu','x','arrow-left','arrow-right','search','check','rotate-cw'] } }),

    mdx({
      // Auto-add id slugs to headings and handle external links in MDX content
      rehypePlugins: [
        rehypeSlug,
        [rehypeExternalLinks, {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
          content: { type: 'text', value: ' ↗' },
        }],
      ],
    }),

    sitemap({
      i18n: {
        defaultLocale: 'de',
        locales: { de: 'de', en: 'en', ar: 'ar' },
      },
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

  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'ar'],
    routing: { prefixDefaultLocale: false },
  },

  markdown: {
    // rehypeSlug + rehypeExternalLinks wired in mdx() above;
    // Shiki for code blocks in .md files
    shikiConfig: { theme: 'github-dark' },
  },
});
