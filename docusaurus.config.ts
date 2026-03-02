import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
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
          sidebarPath: './sidebars.ts',
          breadcrumbs: true,
          routeBasePath: '/',
          // @ts-expect-error: typedoc options
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // @ts-expect-error: navbar type
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
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    announcementBar: {
      id: 'announcement',
      content: 'Welcome to AchSwap & AchMarket Documentation',
      backgroundColor: '#2563eb',
      textColor: '#ffffff',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
