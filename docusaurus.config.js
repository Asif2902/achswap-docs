// @ts-check

/**
 * AchSwap Documentation — Docusaurus Config
 *
 * AI Assistant Integration:
 *   The official AchSwap AI lives in src/components/AIAssistant and is injected site-wide via src/theme/Root.tsx.
 *   - All requests go through the Cloudflare Worker (never directly to Cerebras).
 *   - WORKER_URL is read at RUNTIME from window.__ACHSWAP_AI_WORKER_URL__ (set via Cloudflare Pages env or meta tag).
 *   - Run `npm run index-docs` after doc changes (requires Qdrant + local embeddings).
 */

const workerUrl = process.env.WORKER_URL || process.env.ACHSWAP_AI_WORKER_URL || '';

const config = {
  title: 'AchSwap & AchMarket Documentation',
  tagline: 'Decentralized Exchange & Prediction Markets on ARC',
  url: 'https://docs.achswap.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',

  organizationName: 'achswap',
  projectName: 'achswap-docs',

  // Expose to client code at build time (optional fallback)
  customFields: {
    aiWorkerUrl: process.env.WORKER_URL || process.env.ACHSWAP_AI_WORKER_URL || undefined,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          breadcrumbs: true,
          routeBasePath: '/',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'AchSwap & AchMarket',
      logo: {
        alt: 'AchSwap Logo',
        src: 'img/achswap-logo.png',
      },
      items: [
        {
          to: '/achswap/swap',
          label: 'AchSwap',
          position: 'left',
          activeBasePath: 'achswap',
        },
        {
          to: '/achmarket/browse-markets',
          label: 'AchMarket',
          position: 'left',
          activeBasePath: 'achmarket',
        },
        {
          to: '/achrwa/overview',
          label: 'AchRWA',
          position: 'left',
          activeBasePath: 'achrwa',
        },
        {
          to: '/technical/smart-contracts',
          label: 'Technical',
          position: 'left',
          activeBasePath: 'technical',
        },
        {
          href: 'https://achswap.app',
          label: 'Website',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} AchSwap. Built with Docusaurus.`,
    },
    announcementBar: {
      id: 'announcement',
      content: 'Welcome to AchSwap & AchMarket Documentation',
      backgroundColor: '#2563eb',
      textColor: '#ffffff',
      isCloseable: true,
    },
  },

  // Inject WORKER_URL at runtime via meta tag (works with Cloudflare Pages build env vars)
  headTags: workerUrl
    ? [
        {
          tagName: 'meta',
          attributes: {
            name: 'achswap-ai-worker-url',
            content: workerUrl,
          },
        },
      ]
    : [],
};

module.exports = config;
