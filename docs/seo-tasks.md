# SEO tasks

The SEO plan for teamsazen.com and the app sites. Tick a box when a task is done
and add the date. Owner: **You** = done in a dashboard or account only you can
open; **Claude** = done in the code.

## Open

### 1. One page for each of the 99 Names (Claude)
- [x] (31 Oct 2026) `99.teamsazen.com/names/<name>`: one page per Name with the Arabic,
      transliteration, English and Urdu meanings and the reflection, all read
      from the app's `lib/src/data/names.dart` (no new text)
- [x] (31 Oct 2026) Each card in the homepage grid links to its page
- [x] (31 Oct 2026) All 99 pages in `sitemap.xml` (101 URLs); structured data and breadcrumbs
- [ ] Now that it is live (You): Search Console → Sitemaps → resubmit
      `https://99.teamsazen.com/sitemap.xml`

### 2. Longer, useful blog posts (Claude drafts, You approve)
- [x] (31 Oct 2026) Posts may now give general guidance; app claims still restate
      existing copy, and new posts start as drafts (`draft: true`)
- [x] (31 Oct 2026) Four drafts of 1,100+ words: Quran khatam in 30 days, the 99
      Names and their meanings, tracking expenses without a spreadsheet, finding
      the Qibla. Preview: https://drafts.sazen.pages.dev/blog
- [x] (31 Oct 2026) All four approved and live

### 3. Links from your own accounts (You, about 15 minutes)
- [ ] Play Console: set each app's store listing **Website** to its site
      (`https://rafeeq.teamsazen.com`, `https://99.teamsazen.com`,
      `https://budgetai.teamsazen.com`, `https://qkt.teamsazen.com`,
      `https://exitrush.teamsazen.com`, `https://fmcrafts.teamsazen.com`)
- [ ] Instagram bio: `teamsazen.com`
- [ ] GitHub: the `teamsazen` profile and each repo's About → Website
- [ ] LinkedIn: link the site in posts and on the profile

### 4. Bing Webmaster Tools (You, about 5 minutes)
- [ ] bing.com/webmasters → Import from Google Search Console (brings every
      site at once; ChatGPT search relies largely on Bing)

### 5. Search Console follow-up (You)
- [ ] Request indexing for the 4 remaining blog posts (about 10 requests a day
      are allowed):
      `https://teamsazen.com/blog/tracking-money-without-the-busywork`,
      `https://teamsazen.com/blog/time-with-the-99-names`,
      `https://teamsazen.com/blog/choosing-a-handmade-gift`,
      `https://teamsazen.com/blog/keeping-a-steady-prayer-routine`
- [ ] Request indexing for the 4 new guide posts:
      `https://teamsazen.com/blog/how-to-complete-a-quran-khatam-in-30-days`,
      `https://teamsazen.com/blog/the-99-names-of-allah-and-their-meanings`,
      `https://teamsazen.com/blog/how-to-track-expenses-without-a-spreadsheet`,
      `https://teamsazen.com/blog/how-to-find-the-qibla-direction-anywhere`
- [ ] Sitemaps: submit all 7 if not done yet
      (`https://teamsazen.com/sitemap.xml` and the same path on `rafeeq.`,
      `99.`, `budgetai.`, `qkt.`, `exitrush.` and `fmcrafts.teamsazen.com`)
- [ ] Every 2–3 days: check **Performance** and **Pages**. Insights fill in
      on their own after a few weeks of search data; nothing to fix there.

### 6. FM Crafts products (Claude, later)
- [x] (31 Oct 2026) Each product has its own page at
      `https://fmcrafts.teamsazen.com/products/<name>-<id6>`, rendered live by the
      admin Worker from the products table, plus a sitemap listing every product.
      Only each product's first photo is public.
- [ ] Keep the `fmcrafts` DNS record **proxied (orange cloud)** in Cloudflare (You).
      The product pages run through Cloudflare, so ignore the earlier advice to
      switch it to DNS only.
- [ ] Cloudflare → SSL/TLS: keep the mode on **Full** rather than Full (strict)
      (You), so the shop keeps working even if Firebase cannot renew its own
      certificate behind the proxy.
- [ ] Search Console → Sitemaps: submit `https://fmcrafts.teamsazen.com/sitemap.xml` (You)
- [x] (31 Oct 2026) Search-friendly titles ("Red Crochet Heart Keychain – Handmade in
      Pakistan"), collection pages that fill themselves (`/collections/crochet-heart-keychains`,
      `/collections/crochet-roses`, `/collections/crochet-sunflowers`), readable photo
      names and an image sitemap
- [ ] Storefront redesign: preview ready at https://fmcrafts--redesign-tn8v2wja.web.app,
      waiting for approval (You)
- [ ] Optional (You): show a price, even "from Rs X", to qualify for Google's product
      results and free Shopping listings; register FM Crafts on Google Business
      Profile for local and Maps results

### 7. Optional
- [ ] Google Analytics on the app sites. Each site's privacy policy must change
      first (99 Names promises no tracking), so this is your call.
- [ ] Rafeeq: the iOS app icon in `ios/Runner/Assets.xcassets/AppIcon.appiconset`
      is still Flutter's default logo. Fix it before an iPhone release.

## Done (31 October 2026)
- [x] Search Console Domain property for `teamsazen.com` (You)
- [x] Request indexing: teamsazen.com, the 6 app homepages, `/blog` and 3 posts (You)
- [x] AI crawlers allowed in Cloudflare (You)
- [x] Clean canonical URLs, structured data, per-page share images and blog
      Markdown on teamsazen.com
- [x] Favicons Google can show (96/192 px and `favicon.ico`) on all 7 sites
- [x] Real `robots.txt` and `sitemap.xml` on all 7 sites
- [x] "Publisher: Sazen" structured data and "Made by Sazen" links on every app site
- [x] Studio redesign of Rafeeq, 99 Names, Budget AI and Quran Khatam Tracker
