# Sazen — Agent Guide

Sazen is an independent Astro static website for the studio's seven apps: Quran Khatam Tracker, Exit Rush, Rafeeq, Budget AI, 99 Names – Asmaul Husna, FM Crafts, and SalahLog. The project lives alongside Budget-AI in `Muzamil/Projects/Sazen` and uses Cloudflare Pages (`sazen.pages.dev`).

Read `docs/agents/site.md` before changing structure, app content, visuals, or deployment. Keep this file, that guide, and README.md consistent when adding/removing/renaming files or changing features.

## Rules

- Keep the header GitHub icon linked to `https://github.com/teamsazen` (configured in `src/data/studio.ts`) and visible on mobile. Keep the inline SVG Play icon before the Google Play header label.
- Keep the hero phone frames fully visible on the page background, without a clipping backdrop or a bottom badge over the screens.
- Use the full-bleed studio design: ivory/black in light mode, pure black/white in dark mode, Anton display type with Google Sans, glass pill header, balanced motion. Keep the actual Sazen S mark.
- Reuse real app icons/screenshots and keep their sources in `docs/asset-sources.json`; do not invent app screens, ratings, download counts, testimonials, or product claims.
- 99 Names and Asmaul Husna are one app, package `com.muzamil.asmaulhusna`.
- Keep website links and Google Play package IDs in `src/data/apps.ts`, and blog posts in `src/data/blog.ts`; posts may only restate each app's existing copy.
- Budget AI manual tracking is free. AI is paid with 5 free AI messages per month.
- Do not imply all apps share one data policy. Link to each app's official support and privacy information.
- Use `PhonePreview.astro` for device presentation; crop baked-in frames within the shared shell and distinguish SalahLog presentation mockups from native Android captures.
- Keep assets local, responsive layouts accessible, content usable without JavaScript, and motion off under reduced motion.
- Google Analytics 4 (`G-1R2782BC02`, in `src/data/studio.ts`, production builds only) is the only analytics; keep the privacy page accurate about it. No contact submissions, accounts, backend or client secrets are needed.
- Use `master` directly. Commit with a Conventional Commit prefix and a co-author trailer; push after verification. Keep credentials, `.env`, generated build output and dependency folders out of Git.

## Verification

```sh
npm run build
npm run check
```

For UI changes, verify desktop/mobile, dark mode, the hero showcase, pinned scroll, navigation, screenshot dialog, blog View all and keyboard behavior. This project has no Dart code; Budget AI's Flutter checks apply only when that app is changed.

Deploy with `npm run deploy`. Preserve the intended public Sazen Pages project; do not deploy to one of the individual app websites.
