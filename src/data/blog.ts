import { getCollection } from 'astro:content';
// Posts are Markdown files in src/content/blog/. General guidance is fine; what a post says about an app
// stays within that app's own listing and website. Drafts appear only in builds with SHOW_DRAFTS=1.
// Newest first; posts from the same day follow their `order`.
const showDrafts = process.env.SHOW_DRAFTS === '1';
export const posts = (await getCollection('blog', ({ data }) => showDrafts || !data.draft))
  .map(entry => ({ ...entry.data, slug: entry.id, date: entry.data.date.toISOString().slice(0, 10), entry }))
  .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order);

export type Post = (typeof posts)[number];
export const postDate = (post: Post) => new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const latestPostDate = posts.map(post => post.date).sort().at(-1)!;
export const readMinutes = (post: Post) => Math.max(1, Math.ceil((post.entry.body ?? '').replace(/^#+ /gm, '').split(/\s+/).length / 200));
