// Navigation by task: guides for users first, then liquidity concepts, XP, help, developers and the
// technical reference. Every page in docs/ appears exactly once, so none is orphaned.
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
      label: 'Swaps and bridging',
      collapsed: false,
      items: [
        'achswap/swap',
        'achswap/smart-routing',
        'achswap/gasless',
        'achswap/bridge',
        'achswap/explore',
        'achswap/analytics',
      ],
    },
    {
      type: 'category',
      label: 'Liquidity',
      collapsed: false,
      items: [
        'achswap/add-liquidity',
        'achswap/remove-liquidity',
        'achswap/pools',
        'achswap/v2-vs-v3',
        'achswap/concentrated-liquidity',
        'achswap/liquidity-earnings',
      ],
    },
    {
      type: 'category',
      label: 'Quests and XP',
      collapsed: true,
      items: [
        'quests/overview',
        'quests/earning-xp',
        'quests/distribution',
      ],
    },
    {
      type: 'category',
      label: 'Help',
      collapsed: false,
      items: [
        'help/troubleshooting',
        'technical/faq',
        'technical/glossary',
      ],
    },
    {
      type: 'category',
      label: 'Developers',
      collapsed: true,
      items: [
        'developers/developer-api',
        'developers/api-reference',
        'developers/examples',
        'developers/errors-and-limits',
        'developers/changelog',
      ],
    },
    {
      type: 'category',
      label: 'Technical reference',
      collapsed: true,
      items: [
        'technical/architecture',
        'technical/smart-contracts',
        'technical/contract-addresses',
        'technical/swap-execution',
        'technical/routing-engine',
        'technical/gasless',
        'technical/fee-structure',
        'technical/security',
      ],
    },
  ],
};

module.exports = sidebars;
