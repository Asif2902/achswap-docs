const sidebars = {
  achswapSidebar: [
    'introduction',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/quick-start',
        'getting-started/wallet-setup',
        'getting-started/network-setup',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: false,
      items: [
        'achswap/swap',
        'achswap/add-liquidity',
        'achswap/remove-liquidity',
        'achswap/pools',
        'achswap/bridge',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      collapsed: true,
      items: [
        'achswap/v4-pools',
        'achswap/gasless-swap',
        'achswap/v2-vs-v3',
        'achswap/concentrated-liquidity',
        'achswap/smart-routing',
        'achswap/adapter',
      ],
    },
  ],

  achmarketSidebar: [
    'introduction',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/quick-start',
        'getting-started/wallet-setup',
        'getting-started/network-setup',
      ],
    },
    {
      type: 'category',
      label: 'Using AchMarket',
      collapsed: false,
      items: [
        'achmarket/browse-markets',
        'achmarket/trading',
        'achmarket/portfolio',
        'achmarket/market-lifecycle',
      ],
    },
    {
      type: 'category',
      label: 'Market Creator',
      collapsed: true,
      items: [
        'achmarket/create-market',
        'achmarket/manage-markets',
        'achmarket/fee-management',
      ],
    },
    {
      type: 'category',
      label: 'Integration',
      collapsed: false,
      items: [
        'achmarket/integration',
      ],
    },
  ],

  achrwaSidebar: [
    {
      type: 'category',
      label: 'AchRWA',
      collapsed: false,
      items: [
        'achrwa/overview',
        'achrwa/supported-assets',
        'achrwa/security',
      ],
    },
  ],

  technicalSidebar: [
    {
      type: 'category',
      label: 'Architecture',
      collapsed: false,
      items: [
        'technical/smart-contracts',
        'technical/lmsr-mechanism',
        'technical/fee-structure',
        'technical/contract-addresses',
        'technical/mcp',
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      collapsed: true,
      items: [
        'technical/faq',
        'technical/glossary',
      ],
    },
  ],
};

module.exports = sidebars;
