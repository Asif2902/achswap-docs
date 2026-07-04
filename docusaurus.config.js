// @ts-check

/**
 * AchSwap Documentation — Docusaurus Config
 *
 * AI Assistant Integration:
 *   The official AchSwap AI lives in src/components/AIAssistant and is injected site-wide via src/theme/Root.tsx.
 *   - All requests go through the Cloudflare Worker (never directly to Cerebras).
 *   - Set WORKER_URL in root .env or as env var before `npm run build` for production.
 *   - Run `npm run index-docs` after doc changes (requires Qdrant + local embeddings).
 */

require('dotenv').config();

const { DefinePlugin } = require('webpack');

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

  // Expose to client code. Set WORKER_URL in root .env or env for production.
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
};

// Inject WORKER_URL at build time so the AI client uses the value from root .env or env var
// Usage: WORKER_URL=https://your-worker.workers.dev npm run build
config.plugins = config.plugins || [];
config.plugins.push(function () {
  return {
    name: 'ai-worker-url-define',
    configureWebpack() {
      return {
        plugins: [
          new DefinePlugin({
            'process.env.WORKER_URL': JSON.stringify(
              process.env.WORKER_URL || process.env.ACHSWAP_AI_WORKER_URL || 'http://localhost:8787'
            ),
          }),
        ],
      };
    },
  };
});

module.exports = config;
