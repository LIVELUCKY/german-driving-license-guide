import type { APIContext } from 'astro';

export function GET({ site }: APIContext) {
  // `site` is the origin only; the sitemap lives under BASE_URL on project-page deploys.
  const sitemap = site ? new URL(import.meta.env.BASE_URL + 'sitemap-index.xml', site).href : '';
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
}
