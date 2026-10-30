// One short post per app. Copy stays within what each app's own listing and website already say.
export const posts = [
  {
    slug: 'a-companion-for-the-small-moments', app: 'rafeeq', date: '2026-10-30',
    title: 'A companion for the small moments of your day',
    excerpt: 'Rafeeq keeps the Quran, prayer times, the Qibla and your daily duas in one calm place.',
    sections: [
      { p: ['Most days are full. Rafeeq was made for the small gaps in between: a few minutes before work, a pause after Maghrib, the quiet before sleep. It brings the things you reach for most into one place, so you spend less time searching and more time on what matters.'] },
      { h: 'Read and listen to the Quran', p: ['Open a surah, read at your own pace, or play the recitation and follow along. Each ayah is laid out clearly, so it is easy to pick up where you left off.'] },
      { h: 'Know when and where to pray', p: ['Prayer times sit on the home screen with a countdown to the next one, and the Qibla is a tap away when you are somewhere new.'] },
      { h: 'Duas and a Namaz guide, close at hand', p: ['Keep your daily duas nearby and use the Namaz guide when you want to check a step. Rafeeq supports English and Urdu.'] },
    ],
  },
  {
    slug: 'building-a-quran-habit', app: 'quran-khatam-tracker', date: '2026-10-30',
    title: 'Building a Quran habit, one ayah at a time',
    excerpt: 'Start with a niyyah, mark each ayah, and watch your khatam journey grow.',
    sections: [
      { p: ['Finishing the Quran can feel like a big goal. Quran Khatam Tracker breaks it into the smallest step there is: one ayah. Mark it, and you have moved forward.'] },
      { h: 'Begin with a niyyah', p: ['Every journey starts with an intention. Set yours, and the app keeps it in front of you as you read.'] },
      { h: 'Mark each ayah', p: ['Read and mark ayah by ayah. When you come back, the app takes you straight to where you stopped, so there is no hunting for your place.'] },
      { h: 'Watch your khatam grow', p: ['Your progress builds into khatam journeys. Reading streaks and awards give you a gentle reason to return tomorrow.'] },
    ],
  },
  {
    slug: 'thinking-through-an-exit-rush-board', app: 'exit-rush', date: '2026-10-30',
    title: 'How to think through an Exit Rush board',
    excerpt: 'Every arrow wants out. The trick is finding the right order before the clock runs down.',
    sections: [
      { p: ['Exit Rush looks simple: tap an arrow and it slides along its path. The puzzle is that arrows block each other, so the order you tap them in decides everything.'] },
      { h: 'Look before you tap', p: ['Find the arrows with a clear path to the edge first. Clearing them often opens the way for the rest of the board.'] },
      { h: 'Protect your three hearts', p: ['A wrong move costs a heart, and you only have three. Slow down on crowded boards and keep an eye on the timer.'] },
      { h: 'Try the special stages', p: ['When you want something different, special stages change up the challenge. Exit Rush also plays offline, so a quick board fits anywhere.'] },
    ],
  },
  {
    slug: 'tracking-money-without-the-busywork', app: 'budget-ai', date: '2026-10-30',
    title: 'Tracking money without the busywork',
    excerpt: 'Type it, say it, or snap the receipt. Budget AI turns logging into a few seconds.',
    sections: [
      { p: ['Most budgets fail at the same step: writing things down. Budget AI makes that step as quick as sending a message.'] },
      { h: 'Three ways to log', p: ['Type an expense in a chat, say it out loud, or take a photo of the receipt. Income works the same way.'] },
      { h: 'See where it goes', p: ['Browse your entries and explore spending insights to understand your patterns. Home Screen widgets keep your totals one glance away.'] },
      { h: 'What is free', p: ['Manual tracking is free. AI features are paid, with 5 free AI messages each month.'] },
    ],
  },
  {
    slug: 'time-with-the-99-names', app: '99-names', date: '2026-10-30',
    title: 'Spending time with the 99 names of Allah',
    excerpt: 'Read each name, its meaning in English and Urdu, and a short reflection. Even offline.',
    sections: [
      { p: ['99 Names – Asmaul Husna is a calm place to learn and return to the beautiful names of Allah, one at a time.'] },
      { h: 'Arabic, transliteration and meaning', p: ['Each name shows the Arabic, its transliteration, and its meaning in English and Urdu, so you can read and understand it together.'] },
      { h: 'Reflect and keep favourites', p: ['Read a short reflection on a name, and save the ones you want to come back to.'] },
      { h: 'Always with you', p: ['Everything works fully offline, so the names are there whether or not you have a connection.'] },
    ],
  },
  {
    slug: 'choosing-a-handmade-gift', app: 'fm-crafts', date: '2026-10-30',
    title: 'Choosing a handmade gift that feels like them',
    excerpt: 'Crochet flowers, custom bouquets and small gifts, made by hand in Pakistan.',
    sections: [
      { p: ['A handmade gift says you took a little extra time. FM Crafts collects handmade crochet flowers, custom bouquets and thoughtful little gifts in one place.'] },
      { h: 'Browse the collection', p: ['Look through the crochet collection and bouquets, and open any piece to see it up close before you decide.'] },
      { h: 'Ask about a piece', p: ['Found something you like, or want it made your way? Ask about it on WhatsApp straight from the app.'] },
      { h: 'Made in Pakistan', p: ['Every piece is handmade. Visit the FM Crafts shop for the current collection and custom requests.'] },
    ],
  },
  {
    slug: 'keeping-a-steady-prayer-routine', app: 'salahlog', date: '2026-10-30',
    title: 'Keeping a steady prayer routine',
    excerpt: 'Record each of the five daily prayers and look back on your progress, one prayer at a time.',
    sections: [
      { p: ['A routine grows from small, steady steps. SalahLog helps you notice them by keeping a simple record of your daily prayers.'] },
      { h: 'Record each prayer', p: ['Mark each of the five daily prayers as you pray them. It takes a moment and keeps your day in view.'] },
      { h: 'Look back on your progress', p: ['Your prayer history shows how your practice is going over time, so you can see where you are steady and where you want to grow.'] },
      { h: 'Times and reminders', p: ['Check prayer times and set up reminders for each prayer to support your routine.'] },
    ],
  },
] as const;

export type Post = (typeof posts)[number];
export const postDate = (post: Post) => new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const latestPostDate = posts.map(post => post.date).sort().at(-1)!;
export const readMinutes = (post: Post) => Math.max(1, Math.ceil(post.sections.flatMap(s => s.p).join(' ').split(/\s+/).length / 200));
