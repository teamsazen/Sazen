# SEO tasks

The SEO plan for teamsazen.com and the app sites. Tick a box when a task is done
and add the date. Owner: **You** = done in a dashboard or account only you can
open; **Claude** = done in the code.

## Open

### 1. One page for each of the 99 Names (Claude)
- [ ] `99.teamsazen.com/names/<name>`: one page per Name with the Arabic,
      transliteration, English and Urdu meanings and the reflection, all read
      from the app's `lib/src/data/names.dart` (no new text)
- [ ] Each card in the homepage grid links to its page
- [ ] All 99 pages in `sitemap.xml`; structured data and breadcrumbs
- [ ] After it goes live (You): Search Console → Sitemaps → resubmit
      `https://99.teamsazen.com/sitemap.xml`

### 2. Longer, useful blog posts (Claude drafts, You approve)
- [ ] Decide whether posts may go beyond each app's existing copy (the rule in
      `AGENTS.md` says they may only restate it)
- [ ] Draft posts of 800+ words that answer real searches, for example
      "How to complete a Quran khatam in Ramadan" and
      "How to track expenses without a spreadsheet"
- [ ] Review and approve each draft before it goes live

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
- [ ] Sitemaps: submit all 7 if not done yet
      (`https://teamsazen.com/sitemap.xml` and the same path on `rafeeq.`,
      `99.`, `budgetai.`, `qkt.`, `exitrush.` and `fmcrafts.teamsazen.com`)
- [ ] Every 2–3 days: check **Performance** and **Pages**. Insights fill in
      on their own after a few weeks of search data; nothing to fix there.

### 6. FM Crafts products (Claude, later)
- [ ] Products load with JavaScript, so Google barely sees them. Give each
      product its own crawlable page.
- [ ] Redesign the storefront in the studio design like the other sites.

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
