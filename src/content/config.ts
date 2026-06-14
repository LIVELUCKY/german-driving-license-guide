import { defineCollection } from 'astro:content';
import { z } from 'zod';

export const collections = {
  legal: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      kicker: z.string(),
      desc: z.string(),
    }),
  }),
  tips: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      titleDe: z.string(),
      emoji: z.string().default('💡'),
      category: z.enum(['theory', 'practical', 'signs', 'cheatsheet']),
      priority: z.number(),
    }),
  }),
};
