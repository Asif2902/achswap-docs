// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AchSwap & AchMarket Documentation',
  tagline: 'Decentralized Exchange & Prediction Markets on ARC',
  url: 'https://docs.achswap.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  organizationName: 'achswap',
  projectName: 'achswap-docs',

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
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/og-image.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Docs',
      logo: {
        alt: 'AchSwap',
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
      links: [
        {
          title: 'Products',
          items: [
            {label: 'AchSwap', to: '/achswap/swap'},
            {label: 'AchRWA', to: '/achrwa/overview'},
            {label: 'AchMarket', to: '/achmarket/browse-markets'},
          ],
        },
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/introduction'},
            {label: 'Quick start', to: '/getting-started/quick-start'},
            {label: 'Smart contracts', to: '/technical/smart-contracts'},
          ],
        },
        {
          title: 'Links',
          items: [
            {label: 'Website', href: 'https://achswap.app'},
            {label: 'X @AchProtocol', href: 'https://x.com/AchProtocol'},
            {label: 'Telegram @AchProtocol', href: 'https://t.me/AchProtocol'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AchSwap.`,
    },
    announcementBar: {
      id: 'announcement-brand-2026',
      content: 'Welcome to AchSwap & AchMarket Documentation',
      backgroundColor: '#003579',
      textColor: '#ffffff',
      isCloseable: true,
    },
    metadata: [
      {name: 'theme-color', content: '#003579'},
    ],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        href: '/img/apple-touch-icon.png',
      },
    },
  ],
};

module.exports = config;
