# Sazen

The Sazen studio and app collection website, built with Astro and deployed to Cloudflare Pages and published only at **https://teamsazen.com**.

Full-bleed, minimal and animated: light ivory with black type in light mode, pure black with white type in dark mode, tall condensed Anton headings with Google Sans body text (both self-hosted), a floating glass pill header, a 3D app showcase in the hero, smooth scrolling, scroll reveals and a giant SAZEN wordmark footer.

Production canonical domain: **https://teamsazen.com**. Connect this custom domain to the existing Sazen Cloudflare Pages project; domain registration stays at Namecheap. The project's `sazen.pages.dev` address cannot be removed, so it sends `X-Robots-Tag: noindex` (see `public/_headers`) and a Cloudflare Bulk Redirect sends it to teamsazen.com.

## App collection

| App | Sazen page | App website | Android package |
| --- | --- | --- | --- |
| Quran Khatam Tracker | `/apps/quran-khatam-tracker` | https://qkt.teamsazen.com | `com.quran.khatam.tracker` |
| Exit Rush | `/apps/exit-rush` | https://exitrush.teamsazen.com | `com.sazen.exit.rush` |
| Rafeeq | `/apps/rafeeq` | https://rafeeq.teamsazen.com | `com.satechdev.rafeeqapp` |
| Budget AI | `/apps/budget-ai` | https://budgetai.teamsazen.com | `com.budgetai.android` |
| 99 Names – Asmaul Husna | `/apps/99-names` | https://99.teamsazen.com | `com.muzamil.asmaulhusna` |
| FM Crafts | `/apps/fm-crafts` | https://fmcrafts.teamsazen.com | `com.fmcrafts.fmcrafts` |
| SalahLog | `/apps/salahlog` | The Sazen page serves as its landing page | `com.track_prayer` |

99 Names and Asmaul Husna are one app. Budget AI is included even though the developer page fetched on 23 October 2026 listed only the other six apps; its package URL comes from Budget AI's own website source.

## Pages

- `/`: headline and coverflow showcase of all seven apps, marquee, studio manifesto, Apps and Games panels with app rows, pinned horizontal "How we build" cards, collection of three looping studio reels that play together, three blog cards, Google Play CTA.
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

`check` verifies generated page metadata (clean canonicals matching `og:url`, existing `og:image` files, `noindex` only on 404), local asset references, page links, anchors, structured data, and deployment support files. Browser QA should cover 390px, 768px and desktop widths; light and dark mode; the hero showcase (auto-advance, arrows, swipe, keyboard); the pinned "How we build" section; the screenshot dialog (Escape, close, backdrop, arrow keys); the blog "View all" button; reduced motion; and no-JavaScript content.

## Adding a blog post

Create `src/content/blog/<url-slug>.md`; the file name becomes `/blog/<url-slug>`:

```md
---
title: "Post title"
excerpt: "One or two sentences, used as the card text and meta description."
app: budget-ai          # slug from src/data/apps.ts
date: 2026-11-15        # publish date; newest posts show first
order: 1                # optional: order among posts with the same date
---

Intro paragraph (shown larger).

## A section heading

Section text. Use `##` for each section.
```

Then run `node brand/og/render.mjs` for its share image, `npm run build` and `npm run check`. The sitemap, blog index, structured data and reading time update on their own.

## Publishing

Production branch: `master`. The Cloudflare Pages project is `sazen`.

```sh
npx wrangler@4 login
npm run deploy
```

The deploy script builds and checks the site before uploading `dist/`. The existing `sazen` Pages project is already created. For a new Pages project, use `npx wrangler@4 pages project create NAME --production-branch master --force`: current Wrangler otherwise delegates new project creation to Workers and returns a `workers.dev` address. No API tokens or environment secrets belong in this repository.

For a different Pages project, change the deploy script's `--project-name` and set `SITE_URL` at build time (or change the default in `astro.config.mjs`). Canonical links, social links, sitemap and robots all derive from that origin.

## Maintenance

- `src/data/apps.ts`: app copy, search titles, package IDs, website links, screenshot captions, and categories.
- `src/content/blog/`: blog posts as Markdown (one per app, written only from each app's existing copy); `src/data/blog.ts` loads and sorts them.
- `public/og/`: per-app and per-post share images; regenerate with `node brand/og/render.mjs` after adding or renaming an app or post.
- `src/data/studio.ts`: studio GitHub profile, analytics ID, and app/post URL helpers.
- `src/layouts/Studio.astro`: SEO, glass pill header, footer, smooth scroll, reveals, tilt.
- `src/pages/`: home, app pages, blog, privacy, 404, robots and sitemap.
- `src/components/PhonePreview.astro`: shared device frame; `src/components/PostCard.astro`: blog card.
- `src/styles/studio.css`: visual system, responsive layout, light/dark themes.
- `public/images/`: locally served, optimized real app assets.
- `docs/asset-sources.json`: asset provenance.

Google Analytics 4 (`G-1R2782BC02`) loads in production builds only and is disclosed on `/privacy`. There are no accounts, forms, remote fonts, or backend services. Keep Budget AI pricing accurate: free manual tracking; paid AI with 5 free messages monthly. See [AGENTS.md](AGENTS.md) and [the site guide](docs/agents/site.md).

The shared header includes an accessible GitHub icon linking to `https://github.com/teamsazen`, visible on desktop and mobile. The Google Play header button includes a monochrome inline SVG Play icon before its label.
