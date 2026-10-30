# Sazen site architecture and features

## Structure

```text
astro.config.mjs               Static build, production origin, clean URL output
src/data/apps.ts               Seven apps, copy, features, captions, store/website URLs
src/data/blog.ts               One short blog post per app, written only from each app's existing copy
src/data/studio.ts             Studio GitHub profile, analytics ID, app and post URL helpers
src/layouts/Studio.astro       SEO, glass pill header, giant-wordmark footer, Lenis, reveals, tilt
src/components/PhonePreview.astro  Shared device frame for every screenshot and the Exit Rush video
src/components/PostCard.astro  Blog card with app icon and a real screenshot cover
src/pages/index.astro          Hero showcase, marquee, manifesto, Apps & Games, How we build, collection, blog, CTA
src/pages/apps/[slug].astro    Seven app pages: phone hero, features, gallery + dialog, support, other apps
src/pages/blog/                Blog index (3 + View all) and one page per post
src/pages/privacy.astro        Website privacy and individual app policy pointers
src/pages/404.astro            Not-found page
src/pages/robots.txt.ts        Crawl rules derived from configured origin
src/pages/sitemap.xml.ts       Home, app pages, blog, posts, privacy
src/styles/studio.css          Tokens, type, layout, motion, light/dark, reduced motion
public/fonts/                  Self-hosted Anton (display) and Google Sans (body)
public/images/                 Sazen logo, 7 icons, 21 screenshots, device bezel and status bars, Exit Rush poster, reels/ posters
public/videos/                 exit-rush.mp4 gameplay; sazen-reel-{ivory,dark,colour}.mp4 collection reels (960px web encodes of brand/promo)
public/favicon.svg             Theme-aware Sazen S favicon (black on light, white on dark)
public/{favicon,apple-touch-icon,og}.png  Brand and social assets
public/_headers                Cloudflare cache and security response headers
brand/                         Sazen brand kit sources (S mark, logo, feature graphics, og/og.html = social banner source, promo/ = 30 s 1:1 social promo videos: promo.html (ivory), promo-dark.html and promo-colour.html timelines, render.cjs renderer, sazen-promo*.mp4); not served
scripts/check-site.mjs         Build-output route, asset, anchor and metadata checks
docs/asset-sources.json        Asset provenance
```

The site is a static Astro build without framework hydration or server APIs. The only third-party runtime service is Google Analytics 4 (`G-1R2782BC02`), injected by `Studio.astro` in production builds only and disclosed on `/privacy`. Lenis (bundled at build time) provides smooth scrolling; plain browser scripts handle the showcase, pinned scroll, reveals, tilt, the screenshot dialog and the blog "View all" button. `dist/` is the Cloudflare upload directory; it is not committed.

## Design

Full-bleed width on desktop with side gutters only. Light mode is ivory `#f4f2ec` with near-black type; dark mode is pure black with white type, following the OS setting. Headings use Anton in uppercase; body text uses Google Sans. The header is a compact floating glass pill (links hidden on narrow screens). Same-origin navigations use a curtain-wipe view transition where supported.

Motion is balanced: line-by-line headline reveals, soft fade-up, a never-pausing marquee, 3D tilt on cards (fine pointers only), Lenis smooth scrolling and the giant SAZEN footer wordmark rising into place. Reveal hidden states only apply after JavaScript adds the `js` class, so content is visible without scripts. `prefers-reduced-motion` disables animation, smooth scrolling, auto-advance and video autoplay.

## Experience

**Home.** The hero pairs the headline with a coverflow of all seven apps in `PhonePreview` frames, fully visible on the page background. It auto-advances every 4.2 s with a progress line, pauses on hover and focus, and responds to arrow buttons, the keyboard, swipe and clicking a side phone. The bar below shows the active app's icon, category, name, headline, its Sazen page and Google Play. Exit Rush plays its gameplay video only while it is the active slide and on screen. The Apps and Games panels list every app as an icon row linking to its page. "How we build" pins and scrolls horizontally on screens 900px and wider; narrower screens swipe natively. The collection section shows the three studio reels (ivory, dark, colour) rendered from `brand/promo`: while in view they play muted one after another and loop, pausing off-screen or in a hidden tab; clicking a reel jumps to it. Reduced motion shows posters and plays only the clicked reel, without advancing. Three blog cards link to posts and to `/blog`.

**App pages.** Fanned three-phone hero (the centre phone plays the Exit Rush video on its page), feature marquee and numbered feature rows, three real screenshots with a native `<dialog>` enlargement (Escape, close button, backdrop, arrow keys), a support band pointing to that app's own Google Play listing and website, and rows for the other six apps. Budget AI states its pricing in its note.

**Blog.** One post per app, published 30 October 2026. The index shows three posts and reveals the rest with a button; all posts render without JavaScript. Post pages show the app's screens as a banner, the article, a sticky app card and three more posts.

**Privacy and 404.** Same visual system. No app policies are consolidated into a studio-wide claim.

## Content provenance

The local Budget AI, Rafeeq, 99-Names, FM-CRAFTS, Quran-Khatam-Tracker and Exit Rush projects supply app content, icons and screenshots; exact paths are in `docs/asset-sources.json`. SalahLog images come from its public Google Play listing for `com.track_prayer`. Sazen branding comes from developer ID `5262989636703605828`. The FM Crafts icon is its current green app icon (FM-CRAFTS commit `bc2fd0d`).

`99-Names` and `asmaul_husna` identify the same Android package and must not be duplicated. SalahLog has no separate website, so its Sazen page is the landing destination.

## Screenshot presentation

`PhonePreview.astro` owns the complete device presentation with the original Rafeeq metallic bezel. Sources with embedded status bars (Rafeeq, FM Crafts and Budget AI) keep their own bar. Quran Khatam Tracker and 99 Names reserve space for one status bar. Exit Rush and SalahLog mask only the existing status region. App content is not regenerated.

## Deployment and verification

Run `npm run build` then `npm run check`, and verify real browser behaviour after UI changes. Production publication uses Cloudflare Pages project `sazen`, branch `master`, `dist/` output. `SITE_URL` can override the origin, with metadata, robots and sitemap following it.

Do not store Cloudflare/GitHub tokens in files. No changes to Budget AI's Flutter app or other sibling projects are needed for site updates.

Store-link verification on 23 October 2026: the four existing app websites returned HTTP 200. Budget AI’s configured Google Play package URL returned HTTP 404, so its CTA says “Check Google Play”; the intended package link is retained alongside its working website.

Cloudflare CLI note: Wrangler 4.152 delegates new Pages projects to Workers. The Sazen Pages project was created with `pages project create sazen --production-branch master --force` to keep the `pages.dev` domain. Routine deployments use the existing project without that flag.

The shared header includes an accessible GitHub icon linking to `https://github.com/teamsazen`, visible on desktop and mobile. The Google Play header button includes a monochrome inline SVG Play icon before its label.
