import { getCollection } from 'astro:content';
// Posts are Markdown files in src/content/blog/. Copy stays within what each app's own listing and website already say.
// Newest first; posts from the same day follow their `order`.
export const posts = (await getCollection('blog'))
  .map(entry => ({ ...entry.data, slug: entry.id, date: entry.data.date.toISOString().slice(0, 10), entry }))
  .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order);

export type Post = (typeof posts)[number];
export const postDate = (post: Post) => new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const latestPostDate = posts.map(post => post.date).sort().at(-1)!;
export const readMinutes = (post: Post) => Math.max(1, Math.ceil((post.entry.body ?? '').replace(/^#+ /gm, '').split(/\s+/).length / 200));
