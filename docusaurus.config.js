// @ts-check

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
          label: 'AchSwap v3',
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
