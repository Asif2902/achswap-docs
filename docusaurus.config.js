// @ts-check

/**
 * AchSwap Documentation — Docusaurus Config
 *
 * AI Assistant Integration:
 *   The official AchSwap AI lives in src/components/AIAssistant and is injected site-wide via src/theme/Root.tsx.
 *   - All requests go through the Cloudflare Worker (never directly to Cerebras).
 *   - Configure worker URL in src/lib/aiConfig.ts (WORKER_URL).
 *   - Run `npm run index-docs` after doc changes (requires Qdrant + local embeddings).
 */

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

  // Expose to client code. AI worker URL can be overridden at build time via env if desired.
  customFields: {
    aiWorkerUrl: process.env.ACHSWAP_AI_WORKER_URL || undefined,
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
};

module.exports = config;
