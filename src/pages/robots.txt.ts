import type { APIContext } from 'astro';

export function GET({ site }: APIContext) {
  const base = site ? site.href.replace(/\/$/, '') : '';
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
}
