// Renders a 1200×630 social card for every app and blog post into public/og/ with headless Chrome.
// Reads the same data the site uses, so run it after adding or renaming an app or post:
//   node brand/og/render.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { apps } from '../../src/data/apps.ts';
import { posts } from '../../src/data/blog.ts';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../../public/og');
const mark = readFileSync(join(here, 'og.html'), 'utf8').match(/<svg[\s\S]*?<\/svg>/)[0];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const iconSrc = (slug) => `../../public/images/${slug}/icon.webp`;

const page = (body) => `<link rel=stylesheet href=base.css><body style="background:#f4f2ec;color:#111110;padding:64px 80px;display:flex;flex-direction:column;justify-content:space-between">
<div class=brand>${mark}<span class=d style="font-size:34px">Sazen</span></div>
${body}</body>`;

const appCard = (app) => page(`<div style="display:flex;align-items:center;gap:52px">
<img src="${iconSrc(app.slug)}" style="width:210px;height:210px;border-radius:48px;flex:none">
<div><h1 class=d style="font-size:${app.name.length > 12 ? 104 : 136}px">${esc(app.name)}</h1>
<p style="font-size:40px;color:#6b6a64;margin-top:20px;max-width:760px">${esc(app.headline)}</p></div></div>
<div style="font-size:26px;color:#6b6a64">teamsazen.com/apps/${app.slug}</div>`);

const postCard = (post) => {
  const app = apps.find((a) => a.slug === post.app);
  return page(`<h1 class=d style="font-size:${post.title.length > 36 ? 80 : 96}px;max-width:1040px">${esc(post.title)}</h1>
<div style="display:flex;align-items:center;gap:20px;font-size:28px;color:#6b6a64">
<img src="${iconSrc(app.slug)}" style="width:64px;height:64px;border-radius:15px">
<span><b style="color:#111110;font-weight:600">${esc(app.name)}</b> · Sazen blog</span></div>`);
};

const render = async (html, file) => {
  const tmp = join(here, '.render.html');
  writeFileSync(tmp, html);
  const shot = join(here, '.render.png');
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--force-device-scale-factor=1', '--window-size=1200,630', `--screenshot=${shot}`, `file://${tmp}`], { stdio: 'ignore' });
  mkdirSync(dirname(file), { recursive: true });
  await sharp(shot).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(file);
  rmSync(tmp);
  rmSync(shot);
  console.log('wrote', file.slice(file.indexOf('public/')));
};

for (const app of apps) await render(appCard(app), join(out, 'apps', `${app.slug}.png`));
for (const post of posts) await render(postCard(post), join(out, 'blog', `${post.slug}.png`));
