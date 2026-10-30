# Sazen

The Sazen studio and app collection website, built with Astro and deployed to Cloudflare Pages at **https://sazen.pages.dev**.

Full-bleed, minimal and animated: light ivory with black type in light mode, pure black with white type in dark mode, tall condensed Anton headings with Google Sans body text (both self-hosted), a floating glass pill header, a 3D app showcase in the hero, smooth scrolling, scroll reveals and a giant SAZEN wordmark footer.

Production canonical domain: **https://teamsazen.com**. Connect this custom domain to the existing Sazen Cloudflare Pages project; domain registration stays at Namecheap.

## App collection

| App | Sazen page | App website | Android package |
| --- | --- | --- | --- |
| Quran Khatam Tracker | `/apps/quran-khatam-tracker` | https://qurankhatamtracker.pages.dev | `com.quran.khatam.tracker` |
| Exit Rush | `/apps/exit-rush` | https://exit-rush.pages.dev | `com.sazen.exit.rush` |
| Rafeeq | `/apps/rafeeq` | https://rafeeq.teamsazen.com | `com.satechdev.rafeeqapp` |
| Budget AI | `/apps/budget-ai` | https://budgetai-app.pages.dev | `com.budgetai.android` |
| 99 Names – Asmaul Husna | `/apps/99-names` | https://99asmaulhusna.pages.dev | `com.muzamil.asmaulhusna` |
| FM Crafts | `/apps/fm-crafts` | https://fmcrafts.web.app | `com.fmcrafts.fmcrafts` |
| SalahLog | `/apps/salahlog` | The Sazen page serves as its landing page | `com.track_prayer` |

99 Names and Asmaul Husna are one app. Budget AI is included even though the developer page fetched on 23 October 2026 listed only the other six apps; its package URL comes from Budget AI's own website source.

## Pages

- `/`: headline and coverflow showcase of all seven apps, marquee, studio manifesto, Apps and Games panels with app rows, pinned horizontal "How we build" cards, collection placeholders for upcoming product videos, three blog cards, Google Play CTA.
- `/apps/<slug>`: app hero with three phones, feature rows, screenshot gallery with an enlargement dialog, support links, other apps.
- `/blog` and `/blog/<slug>`: one short post per app.
- `/privacy`: website-only privacy; each app's store listing remains the source for its own policies.
- `404`: not-found page.

Content and navigation work without JavaScript; motion respects reduced-motion settings.

## Development

Use Node 22.12 or newer.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run check
npm run preview
```

`check` verifies generated page metadata, local asset references, page links, anchors, structured data, and deployment support files. Browser QA should cover 390px, 768px and desktop widths; light and dark mode; the hero showcase (auto-advance, arrows, swipe, keyboard); the pinned "How we build" section; the screenshot dialog (Escape, close, backdrop, arrow keys); the blog "View all" button; reduced motion; and no-JavaScript content.

## Publishing

Production branch: `master`. The Cloudflare Pages project is `sazen`.

```sh
npx wrangler@4 login
npm run deploy
```

The deploy script builds and checks the site before uploading `dist/`. The existing `sazen` Pages project is already created. For a new Pages project, use `npx wrangler@4 pages project create NAME --production-branch master --force`: current Wrangler otherwise delegates new project creation to Workers and returns a `workers.dev` address. No API tokens or environment secrets belong in this repository.

For a different Pages project, change the deploy script's `--project-name` and set `SITE_URL` at build time (or change the default in `astro.config.mjs`). Canonical links, social links, sitemap and robots all derive from that origin.

## Maintenance

- `src/data/apps.ts`: app copy, package IDs, website links, screenshot captions, and categories.
- `src/data/blog.ts`: blog posts (one per app, written only from each app's existing copy).
- `src/data/studio.ts`: app and post URL helpers.
- `src/layouts/Studio.astro`: SEO, glass pill header, footer, smooth scroll, reveals, tilt.
- `src/pages/`: home, app pages, blog, privacy, 404, robots and sitemap.
- `src/components/PhonePreview.astro`: shared device frame; `src/components/PostCard.astro`: blog card.
- `src/styles/studio.css`: visual system, responsive layout, light/dark themes.
- `public/images/`: locally served, optimized real app assets.
- `docs/asset-sources.json`: asset provenance.

There are no accounts, forms, cookies, analytics scripts, remote fonts, or backend services. Keep Budget AI pricing accurate: free manual tracking; paid AI with 5 free messages monthly. See [AGENTS.md](AGENTS.md) and [the site guide](docs/agents/site.md).
