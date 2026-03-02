// @ts-check

const config = {
  title: 'AchSwap & AchMarket Documentation',
  tagline: 'Decentralized Exchange & Prediction Markets on ARC',
  url: 'https://docs.achswap.com',
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
          sidebarPath: require.resolve('./sidebars.cjs'),
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
    navbar: {
      title: 'AchSwap & AchMarket',
      logo: {
        alt: 'AchSwap Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'achswapSidebar',
          label: 'AchSwap v3',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'achmarketSidebar',
          label: 'AchMarket',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'technicalSidebar',
          label: 'Technical',
          position: 'left',
        },
        {
          href: 'https://achswap.com',
          label: 'Website',
          position: 'right',
        },
        {
          href: 'https://github.com/Asif2902',
          label: 'GitHub',
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
