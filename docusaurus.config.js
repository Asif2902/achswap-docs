// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AchSwap Documentation',
  tagline: 'Swaps and liquidity on Arc Mainnet',
  url: 'https://docs.achswap.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
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
          to: '/achswap/add-liquidity',
          label: 'Liquidity',
          position: 'left',
          activeBasePath: 'achswap',
        },
        {
          to: '/technical/contract-addresses',
          label: 'Contracts',
          position: 'left',
          activeBasePath: 'technical',
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
            {label: 'Liquidity', to: '/achswap/add-liquidity'},
            {label: 'Bridge', to: '/achswap/bridge'},
          ],
        },
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/introduction'},
            {label: 'Quick start', to: '/getting-started/quick-start'},
            {label: 'Smart contracts', to: '/technical/smart-contracts'},
            {label: 'Developer API', to: '/developers/developer-api'},
          ],
        },
        {
          title: 'Links',
          items: [
            {label: 'X @AchProtocol', href: 'https://x.com/AchProtocol'},
            {label: 'Telegram @AchProtocol', href: 'https://t.me/AchProtocol'},
            {label: 'support@achswap.app', href: 'mailto:support@achswap.app'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AchSwap.`,
    },
    announcementBar: {
      id: 'announcement-mainnet-2026',
      content: 'AchSwap on Arc Mainnet · Chain ID 5042',
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
