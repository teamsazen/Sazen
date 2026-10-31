import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { apps } from './data/apps';

// One Markdown file per post in src/content/blog/; the file name is the URL slug.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    app: z.string().refine(slug => apps.some(app => app.slug === slug), 'app must be a slug from src/data/apps.ts'),
    date: z.coerce.date(),
    // Tie-break for posts published on the same day: lower comes first.
    order: z.number().default(0),
    // Unapproved posts: built only with SHOW_DRAFTS=1, for a preview deploy.
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
