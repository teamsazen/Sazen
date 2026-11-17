# Sazen site architecture and features

## Structure

```text
astro.config.mjs               Static build, production origin, clean URL output, Markdown section wrapper for posts
src/data/apps.ts               Eight apps, copy, features, captions, search titles, store/website URLs
src/content/blog/              Markdown posts (frontmatter: title, excerpt, app, date, order, draft); general guidance is fine, app claims restate existing copy; drafts build only with SHOW_DRAFTS=1
src/content.config.ts          Blog collection schema; the build fails on a missing field or unknown app slug
src/data/blog.ts               Loads the blog collection, sorted newest first (same-day posts by order), plus date and reading-time helpers
src/data/studio.ts             Studio GitHub profile, analytics ID, app and post URL helpers, Organization and breadcrumb structured data
src/layouts/Studio.astro       SEO, glass pill header with current-section state, footer (app and studio links, faint wordmark), reveals
src/components/AppIndex.astro  Catalogue rows (number, icon, name, line, category, hover screenshot) for the home page and app pages
src/components/PhonePreview.astro  Shared device frame for every screenshot and the Exit Rush video
src/components/PostCard.astro  Blog card with app icon and a real screenshot cover
src/pages/index.astro          Hero showcase, marquee, catalogue, belief frame, How we build, reels, blog, closing panel
src/pages/apps/[slug].astro    Eight app pages: phone hero, features, gallery + dialog, support, other apps
src/pages/blog/                Blog index (4 + View all) and one page per post
src/pages/privacy.astro        Website privacy and individual app policy pointers
src/pages/404.astro            Not-found page
src/pages/robots.txt.ts        Crawl rules derived from configured origin
src/pages/sitemap.xml.ts       Home, app pages, blog, posts, privacy; lastmod only for dated blog URLs
src/styles/studio.css          Tokens, type, layout, motion, light/dark, reduced motion
public/fonts/                  Self-hosted Bricolage Grotesque (headings), Google Sans (body) and Anton (OG renderer only)
public/images/                 Sazen logo, 8 icons, 24 screenshots, device bezel and status bars, Exit Rush poster, reels/ posters
public/videos/                 exit-rush.mp4 gameplay; sazen-reel-{ivory,dark,colour}.mp4 collection reels (960px web encodes of brand/promo)
public/favicon.svg             Theme-aware Sazen S favicon (black on light, white on dark)
public/{favicon,apple-touch-icon,og}.png  Brand and social assets (og.png is the default share image)
public/favicon-{96,192}.png, favicon.ico  Search-result favicons (Google needs a multiple of 48 px), from brand/png/sazen-icon-512.png
public/og/                     Generated 1200×630 share images: apps/<slug>.png and blog/<slug>.png
public/_headers                Cloudflare cache and security response headers
brand/                         Sazen brand kit sources (S mark, logo, feature graphics, og/og.html = social banner source, og/render.mjs = per-app and per-post share image renderer, promo/ = 30 s 1:1 social promo videos: promo.html (ivory), promo-dark.html and promo-colour.html timelines, render.cjs renderer, sazen-promo*.mp4); not served
scripts/check-site.mjs         Build-output route, asset, anchor, metadata, canonical, og:image and sitemap checks
docs/asset-sources.json        Asset provenance
docs/seo-tasks.md              SEO plan for teamsazen.com and the app sites, with open and done tasks
```

The site is a static Astro build without framework hydration or server APIs. The only third-party runtime service is Google Analytics 4 (`G-1R2782BC02`), injected by `Studio.astro` in production builds only and disclosed on `/privacy`. Plain browser scripts handle the showcase, reveals, the header's current-section state, the reels, the screenshot dialog and the blog "View all" button. `dist/` is the Cloudflare upload directory; it is not committed.

## Design

A quiet catalogue. Content sits in one capped column (`--max` 1240px, `.wrap` or `.band`) with growing gutters on wide screens. Light mode is ivory `#f4f2ec` with near-black type; dark mode is pure black with white type, following the OS setting. Headings use Bricolage Grotesque (`public/fonts/bricolage.woff2`, variable 200–800, OFL) in sentence case, usually a bold line followed by a thin italic `.ghost` line; body text uses Google Sans. One red `--accent` appears only on the belief frame and on hover numbers. Labels and meta are sentence case in the body face, never tracked capitals or dot-joined strings. The header is a compact floating glass pill (links hidden on narrow screens) that turns the current page's link, or on the home page the section in view, to full contrast. Same-origin navigations cross-fade briefly where supported. Anton (`public/fonts/anton.woff2`) is now used only by the OG image renderer in `brand/og`.

Motion is calm: a single soft fade-up for `.reveal`/`.lines` elements, the angled marquee, the hero coverflow, and hover responses (the catalogue and process lists dim the other rows, nudge the hovered one and reveal a screenshot or description). Scrolling is native; there is no scroll pinning, tilt or smooth-scroll library. Reveal hidden states only apply after JavaScript adds the `js` class, so content is visible without scripts. `prefers-reduced-motion` disables animation, auto-advance and video autoplay.

## Experience

**Home.** Hero headline, one sentence and two actions over a coverflow of all eight apps in `PhonePreview` frames, fully visible on the page background. It auto-advances every 4.2 s with a progress line, pauses on hover and focus, and responds to arrow buttons, the keyboard, swipe and clicking a side phone; the bar below links the active app's icon, name and headline to its page. Exit Rush plays its gameplay video only while it is the active slide and on screen. Then: the angled marquee; the catalogue (`#worlds`, `AppIndex.astro`): numbered rows for Apps and Games, where hovering dims the other rows and slides in a real screenshot; the belief frame (`#studio`), a tilted accent-cornered quote built from the studio's own copy; How we build (`#build`), five numbered steps that open their description on hover or focus (always open on touch); the three studio reels, without a heading, each looping muted while on screen (swipeable on phones; clicking pauses or resumes, reduced motion shows posters until clicked); four blog cards; and a closing panel linking to Google Play.

**App pages.** Three-phone hero (the centre phone plays the Exit Rush video on its page), the angled feature marquee, the features as numbered rows beside the app's description, three real screenshots with a native `<dialog>` enlargement (Escape, close button, backdrop, arrow keys), a closing panel pointing to that app's own Google Play listing and website, related posts, and the catalogue rows for the other seven apps. Budget AI and BG Remover state their pricing in their notes.

**Blog.** Markdown posts (BG Remover has none yet), each with its own `date` (all seven were published 30 October 2026). A rehype plugin in `astro.config.mjs` wraps the intro and each `##` heading with its content in `<section class="reveal">`, which the `.prose` layout and scroll reveals rely on, so posts should use `##` for sections. The index shows four posts (a four-column grid on wide screens, `.post-grid.four`) and reveals the rest with a button; all posts render without JavaScript. Post pages show the app's screens as a banner, the article, a sticky app card and four more posts.

**Privacy and 404.** Same visual system. No app policies are consolidated into a studio-wide claim.

## SEO

`Studio.astro` writes the title, description, canonical, Open Graph/Twitter tags and any JSON-LD a page passes in `schema`. Canonicals strip the `.html` that `build.format: 'file'` adds, because Cloudflare serves (and the sitemap lists) clean URLs; `npm run check` fails on `.html` canonicals, a canonical that differs from `og:url`, a missing `og:image` file, or `.html` sitemap entries. The 404 page is `noindex` and has no canonical.

- Home: default site title and description from `src/data/apps.ts`, `Organization` + `WebSite` JSON-LD (both with `alternateName` "Team Sazen" and "teamsazen" so Google ties the brand search to the site), `og.png`.
- App pages: `seoTitle` from `apps.ts`, `detail` as the description, `MobileApplication` + `BreadcrumbList` JSON-LD, `og/apps/<slug>.png`. No offers or ratings are published, since that would need real store data.
- Blog index: `Blog` + `BreadcrumbList`. Posts: `og:type` article, `article:published_time`, `BlogPosting` + `BreadcrumbList`, `og/blog/<slug>.png`.

After adding or renaming an app or post (or changing an app name/headline or post title), run `node brand/og/render.mjs` (Node 23.6+ and local Google Chrome) to regenerate `public/og/`, then build and check.

## Content provenance

The local Budget AI, image-background-remover (BG Remover), Rafeeq, 99-Names, FM-CRAFTS, Quran-Khatam-Tracker and Exit Rush projects supply app content, icons and screenshots; exact paths are in `docs/asset-sources.json`. SalahLog images come from its public Google Play listing for `com.track_prayer`. Sazen branding comes from developer ID `5262989636703605828`. The FM Crafts icon is its current green app icon (FM-CRAFTS commit `bc2fd0d`).

`99-Names` and `asmaul_husna` identify the same Android package and must not be duplicated. SalahLog has no separate website, so its Sazen page is the landing destination.

## Screenshot presentation

`PhonePreview.astro` owns the complete device presentation with the original Rafeeq metallic bezel. Sources with embedded status bars (Rafeeq, FM Crafts and Budget AI) keep their own bar. Quran Khatam Tracker, 99 Names and BG Remover reserve space for one status bar. Exit Rush and SalahLog mask only the existing status region. App content is not regenerated.

## Deployment and verification

Run `npm run build` then `npm run check`, and verify real browser behaviour after UI changes. Production publication uses Cloudflare Pages project `sazen`, branch `master`, `dist/` output, served publicly only at `https://teamsazen.com`. The `sazen.pages.dev` address cannot be deleted: `public/_headers` sends `X-Robots-Tag: noindex` on every `*.pages.dev` host (preview deploys included), and a Cloudflare Bulk Redirect (dashboard, not in this repo) sends `sazen.pages.dev` to `https://teamsazen.com`, keeping path and query. `SITE_URL` can override the origin, with metadata, robots and sitemap following it.

Do not store Cloudflare/GitHub tokens in files. No changes to Budget AI's Flutter app or other sibling projects are needed for site updates.

Store-link verification on 23 October 2026: the four existing app websites returned HTTP 200. Budget AI’s configured Google Play package URL returned HTTP 404, so its CTA says “Check Google Play”; the intended package link is retained alongside its working website.

Cloudflare CLI note: Wrangler 4.152 delegates new Pages projects to Workers. The Sazen Pages project was created with `pages project create sazen --production-branch master --force` to keep the `pages.dev` domain. Routine deployments use the existing project without that flag.

The shared header includes an accessible GitHub icon linking to `https://github.com/teamsazen`, visible on desktop and mobile. The Google Play header button includes a monochrome inline SVG Play icon before its label.
