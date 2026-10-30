import type { APIRoute } from 'astro';
import { apps } from '../data/apps';
import { latestPostDate, posts } from '../data/blog';
// lastmod only where a real date exists (blog posts); guessed dates are ignored by search engines.
const entries: [path: string, lastmod?: string][] = [['/'], ...apps.map(app => [`/apps/${app.slug}`] as [string]), ['/blog', latestPostDate], ...posts.map(post => [`/blog/${post.slug}`, post.date] as [string, string]), ['/privacy']];
export const GET: APIRoute = ({site}) => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(([path,lastmod])=>`<url><loc>${new URL(path,site)}</loc>${lastmod?`<lastmod>${lastmod}</lastmod>`:''}</url>`).join('')}</urlset>`, {headers:{'Content-Type':'application/xml'}});
