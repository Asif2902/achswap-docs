const sidebars = {
  achswapSidebar: [
    'introduction',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: [
        'getting-started/quick-start',
        'getting-started/wallet-setup',
        'getting-started/network-setup',
      ],
    },
    {
      type: 'category',
      label: 'Using AchSwap',
      collapsed: false,
      items: [
        'achswap/swap',
        'achswap/gasless',
        'achswap/smart-routing',
        'achswap/add-liquidity',
        'achswap/remove-liquidity',
        'achswap/pools',
        'achswap/bridge',
      ],
    },
    {
      type: 'category',
      label: 'Liquidity concepts',
      collapsed: true,
      items: [
        'achswap/v2-vs-v3',
        'achswap/concentrated-liquidity',
      ],
    },
    {
      type: 'category',
      label: 'Technical reference',
      collapsed: true,
      items: [
        'technical/smart-contracts',
        'technical/swap-execution',
        'technical/routing-engine',
        'technical/gasless',
        'technical/contract-addresses',
        'technical/fee-structure',
        'technical/faq',
        'technical/glossary',
      ],
    },
  ],
};

module.exports = sidebars;
