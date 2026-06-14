import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const tips = await getCollection('tips');
  const sorted = tips.sort((a, b) => (a.data.priority ?? 99) - (b.data.priority ?? 99));

  return rss({
    title: 'Führerschein Guide — Study Tips',
    description: 'Bite-sized tips for the German driving licence exam. Updated as new tips are added.',
    site: context.site ?? 'https://example.com',
    items: sorted.map(tip => ({
      title: `${tip.data.emoji} ${tip.data.title}`,
      description: tip.data.titleDe,
      link: `/`,      // tips live on the site, no individual pages
      pubDate: new Date('2026-01-01'),
      categories: [tip.data.category],
    })),
    customData: '<language>en-de</language>',
  });
}
