// Generates files for LLMs and coding agents at build time (https://llmstxt.org):
//   /llms.txt         an index of every page, grouped like the sidebar, with one-line descriptions
//   /llms-full.txt    every page's Markdown in sidebar order, in one file
//   /<page>.md        each page's Markdown, next to its HTML (e.g. /developers/api-reference.md)
// Source is the docs' own Markdown: front matter and MDX imports are removed, site-relative links are made
// absolute, and the two illustrative React diagrams are replaced by their text descriptions.
const fs = require('fs');
const path = require('path');

const SITE = 'https://docs.achswap.app';

// The interactive SVG components, as text, for readers that cannot render them.
const COMPONENT_TEXT = {
  V2V3Comparison:
    '> Diagram (illustrative): V2 spreads a deposit thinly across every price from zero to infinity; V3 puts the same deposit between a chosen minimum and maximum price, providing more liquidity there, but only while the price is inside the range.',
  RangeStates:
    '> Diagram (illustrative): a V3 position holds only the base token when the price is below its range, both tokens (and earns fees) when the price is inside it, and only the quote token when the price is above it. A range entirely above the current price is funded with the base token alone; entirely below it, with the quote token alone.',
};

const GROUPS = [
  {title: 'Guides', match: (id) => /^(introduction|getting-started\/|achswap\/|quests\/|help\/)/.test(id) || /^technical\/(faq|glossary)$/.test(id)},
  {title: 'Developer API', match: (id) => id.startsWith('developers/')},
  {title: 'Technical reference', match: (id) => id.startsWith('technical/')},
];

function frontMatter(source) {
  const m = source.match(/^---\n([\s\S]*?)\n---\n/);
  const data = {};
  if (m) {
    for (const line of m[1].split('\n')) {
      const kv = line.match(/^([a-z_]+):\s*(.*)$/);
      if (!kv) continue;
      let v = kv[2].trim();
      if (v.startsWith('"')) {
        try { v = JSON.parse(v); } catch { /* keep raw */ }
      }
      data[kv[1]] = v;
    }
  }
  return {data, body: m ? source.slice(m[0].length) : source};
}

function sidebarOrder(sidebars) {
  const ids = [];
  const visit = (items) => {
    for (const item of items) {
      if (typeof item === 'string') ids.push(item);
      else if (item.type === 'doc') ids.push(item.id);
      else if (item.items) visit(item.items);
    }
  };
  for (const items of Object.values(sidebars)) visit(items);
  return ids;
}

function toMarkdown(body) {
  let out = body
    .replace(/^import .*;\s*$/gm, '')
    .replace(/<([A-Z][A-Za-z0-9]*)\s*\/>/g, (all, name) => COMPONENT_TEXT[name] ?? '')
    // Site-relative links become absolute page URLs.
    .replace(/\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g, (all, p, hash = '') => {
      const clean = p.replace(/\/$/, '');
      return `](${SITE}${clean}/${hash})`;
    });
  return out.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

module.exports = function llmsTxtPlugin(context) {
  return {
    name: 'llms-txt',
    async postBuild({outDir}) {
      const docsDir = path.join(context.siteDir, 'docs');
      const sidebars = require(path.join(context.siteDir, 'sidebars.js'));
      const order = sidebarOrder(sidebars);
      const pages = order.map((id) => {
        const source = fs.readFileSync(path.join(docsDir, `${id}.md`), 'utf8').replace(/\r\n/g, '\n');
        const {data, body} = frontMatter(source);
        const h1 = (body.match(/^# (.+)$/m) || [])[1];
        const markdown = toMarkdown(body);
        return {id, title: data.title || h1 || id, description: data.description || '', markdown};
      });

      for (const page of pages) {
        const file = path.join(outDir, `${page.id}.md`);
        fs.mkdirSync(path.dirname(file), {recursive: true});
        fs.writeFileSync(file, `<!-- Source: ${SITE}/${page.id}/ -->\n\n${page.markdown}`);
      }

      const lines = [
        '# AchSwap Documentation',
        '',
        '> AchSwap is a DEX aggregator on Arc Mainnet (chain ID 5042). For each swap it compares its own router, which indexes the pools of the supported DEXs on Arc and simulates every route on chain, with the KyberSwap and LI.FI aggregators, and uses the route expected to deliver the most after fees and gas. It also has AchSwap V2 and V3 liquidity pools, gasless swaps through Permit2, a bridge interface powered by LI.FI, and a REST API for quotes and ready-to-sign swap transactions.',
        '',
        'Key facts:',
        '',
        '- Network: Arc Mainnet, chain ID 5042. Gas is paid in USDC; USDC is one balance seen as an 18-decimal native currency and a 6-decimal ERC-20 at 0x3600000000000000000000000000000000000000.',
        '- App: https://trade.achswap.app. Developer API base URL: https://trade.achswap.app/api/v1 (POST /quote, POST /swap; API key required).',
        '- AchSwap routes execute on AchRouteExecutor 0x1B844738455b8060D12839331b35893526E9d314, which takes a 0.25% fee from the output.',
        '- Each page below is also available as Markdown at the linked .md URL. All pages in one file: ' + SITE + '/llms-full.txt',
        '',
      ];
      const used = new Set();
      for (const group of GROUPS) {
        const items = pages.filter((p) => !used.has(p.id) && group.match(p.id));
        if (!items.length) continue;
        lines.push(`## ${group.title}`, '');
        for (const p of items) {
          used.add(p.id);
          lines.push(`- [${p.title}](${SITE}/${p.id}.md)${p.description ? `: ${p.description}` : ''}`);
        }
        lines.push('');
      }
      fs.writeFileSync(path.join(outDir, 'llms.txt'), lines.join('\n'));

      const full = pages.map((p) => `<!-- Source: ${SITE}/${p.id}/ -->\n\n${p.markdown}`).join('\n\n---\n\n');
      fs.writeFileSync(path.join(outDir, 'llms-full.txt'), `# AchSwap Documentation (full text)\n\n${full}`);
    },
  };
};
