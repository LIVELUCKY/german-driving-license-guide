import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

// "tips" — standalone study tip cards written in MDX
// Astro v6 loader API: each MDX file becomes an entry
export const collections = {
  tips: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/tips' }),
    schema: z.object({
      title: z.string(),
      titleDe: z.string(),
      emoji: z.string().default('💡'),
      category: z.enum(['theory', 'practical', 'signs', 'cheatsheet']),
      priority: z.number().default(50),
    }),
  }),
};
