// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AchSwap Documentation',
  tagline: 'The DEX aggregator on Arc Mainnet',
  url: 'https://docs.achswap.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  favicon: 'img/favicon.ico',
  clientModules: [require.resolve('./src/clientModules/diagramScale.js')],

  organizationName: 'achswap',
  projectName: 'achswap-docs',

  themes: [
    "@docusaurus/theme-mermaid",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      }),
    ],
  ],

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
    // Labels drawn as SVG text are measured in the font they render in, so multi-line
    // flowchart labels are never clipped when the site font loads after the diagram.
    mermaid: {
      options: {
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        htmlLabels: false,
        flowchart: { htmlLabels: false },
        sequence: { wrap: true, width: 120, actorMargin: 30, messageMargin: 30, boxMargin: 6, noteMargin: 8 },
      },
    },
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
          to: '/getting-started/quick-start',
          label: 'Guides',
          position: 'left',
          activeBaseRegex: '^/(introduction|getting-started|achswap|quests|help)',
        },
        {
          to: '/developers/developer-api',
          label: 'Developers',
          position: 'left',
          activeBasePath: 'developers',
        },
        {
          to: '/technical/architecture',
          label: 'Reference',
          position: 'left',
          activeBasePath: 'technical',
        },
        {
          to: '/help/troubleshooting',
          label: 'Help',
          position: 'left',
          activeBasePath: 'help',
        },
        {
          href: 'https://trade.achswap.app',
          label: 'Open app',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guides',
          items: [
            {label: 'Swap', to: '/achswap/swap'},
            {label: 'Liquidity', to: '/achswap/add-liquidity'},
            {label: 'Bridge', to: '/achswap/bridge'},
            {label: 'Troubleshooting', to: '/help/troubleshooting'},
          ],
        },
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/introduction'},
            {label: 'Quick start', to: '/getting-started/quick-start'},
            {label: 'Developer API', to: '/developers/developer-api'},
            {label: 'Contract addresses', to: '/technical/contract-addresses'},
            {label: 'Security', to: '/technical/security'},
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
