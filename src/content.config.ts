import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
const source = z.object({ title: z.string(), url: z.url() });
const posts = defineCollection({ loader: glob({ pattern: '**/*.mdx', base: './src/content/posts', generateId: ({ entry }) => entry.replace(/\.mdx$/, '') }), schema: z.object({
  slug: z.string(), lang: z.enum(['en','zh','fr']), title: z.string(), description: z.string(), date: z.coerce.date(),
  narrator: z.enum(['operator','evil','duet']), category: z.string(), format: z.enum(['essay','fiction','dialogue']),
  order: z.number(), minutes: z.number(), relatedAtlas: z.array(z.string()).default([]), sources: z.array(source).default([]),
  lensEnabled: z.boolean().default(false), kicker: z.string(), note: z.string(),
}) });
const atlas = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/atlas' }), schema: z.object({
  slug: z.string(), category: z.enum(['progress','futures','safety','governance','openness','work','culture','agency','planet','discourse']), kind: z.enum(['movement','research','policy','concept','label','editorial']), related: z.array(z.string()), sources: z.array(source), updated: z.string(),
  en: z.object({ title:z.string(), summary:z.string(), case:z.string(), criticism:z.string(), evil:z.string() }),
  zh: z.object({ title:z.string(), summary:z.string(), case:z.string(), criticism:z.string(), evil:z.string() }),
  fr: z.object({ title:z.string(), summary:z.string(), case:z.string(), criticism:z.string(), evil:z.string() }),
}) });
export const collections = { posts, atlas };
