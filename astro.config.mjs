import { defineConfig } from 'astro/config';

// Wraps the intro and each `##` heading with the content after it in <section class="reveal">,
// the structure the blog's .prose layout and scroll reveals expect.
const sectionize = () => tree => {
  const sections = [];
  for (const node of tree.children) {
    if (node.type === 'text' && !node.value.trim()) continue;
    if (!sections.length || (node.type === 'element' && node.tagName === 'h2')) {
      sections.push({ type: 'element', tagName: 'section', properties: { className: ['reveal'] }, children: [] });
    }
    sections.at(-1).children.push(node);
  }
  tree.children = sections;
};

export default defineConfig({
  site: process.env.SITE_URL || 'https://teamsazen.com',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: { rehypePlugins: [sectionize] },
});
