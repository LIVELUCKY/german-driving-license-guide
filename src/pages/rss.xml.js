import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { withBase } from '../lib/i18n.js';

export async function GET(context) {
  const tips = await getCollection('tips');
  const sorted = tips.sort((a, b) => (a.data.priority ?? 99) - (b.data.priority ?? 99));

  return rss({
    title: 'Führerschein Guide — Study Tips',
    description: 'Bite-sized tips for the German driving licence exam. Updated as new tips are added.',
    // `context.site` is the origin only, so add BASE_URL for project-page deploys.
    site: new URL(import.meta.env.BASE_URL, context.site ?? 'https://example.com').href,
    items: sorted.map(tip => ({
      title: `${tip.data.emoji} ${tip.data.title}`,
      description: tip.data.titleDe,
      // Tips have no page of their own; link to the section that carries them.
      // The id fragment keeps <link> and <guid> unique — two tips share a category.
      link: withBase(`${tip.data.category}/#${tip.id}`),
      pubDate: new Date('2026-01-01'),
      categories: [tip.data.category],
    })),
    customData: '<language>en-de</language>',
    // Our links already carry their own slash before the #fragment; let the
    // feed builder leave them alone instead of appending one after it.
    trailingSlash: false,
  });
}
