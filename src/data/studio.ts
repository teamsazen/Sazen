import { developerUrl } from './apps';
// Google Analytics 4 measurement ID for teamsazen.com; loaded only in production builds.
export const gaId = 'G-1R2782BC02';
export const githubUrl = 'https://github.com/teamsazen';
export const instagramUrl = 'https://www.instagram.com/teamsazen';
export const appPath = (slug: string) => `/apps/${slug}`;
export const postPath = (slug: string) => `/blog/${slug}`;
// Structured data shared across pages; `site` is Astro.site.
export const organization = (site: URL) => ({ '@type': 'Organization', name: 'Sazen', url: site.toString(), logo: new URL('/images/sazen-logo.png', site).toString(), sameAs: [developerUrl, githubUrl, instagramUrl] });
export const breadcrumbs = (site: URL, trail: [name: string, path: string][]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: new URL(path, site).toString() })),
});
