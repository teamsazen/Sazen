// Renders promo.html to a 1080x1080, 30 fps H.264 MP4 frame by frame.
// Needs ffmpeg, Google Chrome and playwright-core (`npm i --no-save playwright-core`).
// Usage: node brand/promo/render.cjs [out.mp4] [--page=promo-dark.html] [--from=s --to=s]
const { chromium } = require('playwright-core');
const { spawn, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const FPS = 30, DURATION = 30;
const args = process.argv.slice(2);
const flag = name => Number((args.find(a => a.startsWith(`--${name}=`)) || '').split('=')[1]);
const pageName = (args.find(a => a.startsWith('--page=')) || '--page=promo.html').split('=')[1];
const out = path.resolve(args.find(a => !a.startsWith('--')) || path.join(__dirname, pageName.replace('promo', 'sazen-promo').replace('.html', '.mp4')));
const from = flag('from') || 0, to = flag('to') || DURATION;

(async () => {
  // Exit Rush gameplay as still frames so the phone screen can be seeked deterministically.
  const frames = fs.mkdtempSync(path.join(os.tmpdir(), 'sazen-promo-'));
  execFileSync('ffmpeg', ['-v', 'error', '-ss', '0.5', '-t', '8', '-i', path.join(__dirname, '../../public/videos/exit-rush.mp4'), '-vf', `fps=${FPS},scale=480:-2`, '-q:v', '3', path.join(frames, 'f%03d.jpg')]);
  const nframes = fs.readdirSync(frames).length;

  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  const url = new URL('file://' + path.join(__dirname, pageName));
  url.searchParams.set('frames', 'file://' + frames);
  url.searchParams.set('nframes', nframes);
  await page.goto(url.href);
  await page.evaluate(() => window.ready);

  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = Math.round((to - from) * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => window.render(t), from + i / FPS);
    const png = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`\rframe ${i}/${total}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  fs.rmSync(frames, { recursive: true, force: true });
  console.log(`\nwrote ${out}`);
})();
