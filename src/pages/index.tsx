import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';

type Entry = {label: string; to: string};
type Audience = {id: string; eyebrow: string; title: string; description: string; entries: Entry[]};

// Every link here points at a page that exists; the build fails on a broken one.
const audiences: Audience[] = [
  {
    id: 'users',
    eyebrow: 'For users',
    title: 'Trade and earn on Arc',
    description: 'Swap, provide liquidity, bridge and earn XP, with every step explained.',
    entries: [
      {label: 'Getting started', to: '/getting-started/quick-start'},
      {label: 'How swaps work', to: '/achswap/swap#what-happens-when-you-swap'},
      {label: 'Comparing swap routes', to: '/achswap/smart-routing#how-the-best-route-is-chosen'},
      {label: 'Gasless swaps', to: '/achswap/gasless'},
      {label: 'Providing liquidity', to: '/achswap/add-liquidity'},
      {label: 'Bridging assets', to: '/achswap/bridge'},
      {label: 'XP and quests', to: '/quests/overview'},
      {label: 'Troubleshooting', to: '/help/troubleshooting'},
    ],
  },
  {
    id: 'developers',
    eyebrow: 'For developers',
    title: 'Integrate the API',
    description: 'Quotes and ready-to-sign swap transactions on Arc, with an optional fee for your app.',
    entries: [
      {label: 'API quick start', to: '/developers/examples'},
      {label: 'Authentication and API keys', to: '/developers/developer-api#authentication'},
      {label: 'Requesting quotes', to: '/developers/api-reference#post-quote'},
      {label: 'Preparing and executing swaps', to: '/developers/api-reference#post-swap'},
      {label: 'Fees and partner integrations', to: '/developers/api-reference#fees'},
      {label: 'Error handling', to: '/developers/errors-and-limits'},
      {label: 'API reference', to: '/developers/api-reference'},
      {label: 'Changelog', to: '/developers/changelog'},
    ],
  },
  {
    id: 'reference',
    eyebrow: 'Technical reference',
    title: 'How it works on chain',
    description: 'Contracts, routing, gasless execution and the trust assumptions behind them.',
    entries: [
      {label: 'Smart contracts', to: '/technical/smart-contracts'},
      {label: 'Contract addresses', to: '/technical/contract-addresses'},
      {label: 'Supported protocols', to: '/achswap/smart-routing#liquidity-sources'},
      {label: 'Network configuration', to: '/getting-started/network-setup'},
      {label: 'Routing architecture', to: '/technical/architecture'},
      {label: 'Gasless architecture', to: '/technical/gasless'},
      {label: 'Security considerations', to: '/technical/security'},
    ],
  },
];

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Documentation"
      description="AchSwap is a DEX aggregator on Arc Mainnet: guides for swaps, liquidity, bridging and XP, a developer API, and contract reference.">
      <main>
        <section className="homeHero">
          <div className="container homeHero__inner">
            <p className="homeHero__eyebrow">Official documentation</p>
            <ThemedImage
              className="homeHero__logo"
              alt="AchSwap"
              sources={{
                light: useBaseUrl('/img/achswap-lockup-blue.svg'),
                dark: useBaseUrl('/img/achswap-lockup-white.svg'),
              }}
            />
            <h1 className="homeHero__title">The DEX aggregator on Arc</h1>
            <p className="homeHero__subtitle">
              AchSwap compares its own router, which reads every supported DEX on Arc, with KyberSwap and LI.FI, and
              uses the route expected to leave you the most after fees and gas.
            </p>
            <div className="homeActions">
              <Link className="button button--primary button--lg" to="/getting-started/quick-start">
                Get started
              </Link>
              <Link className="button button--secondary button--lg" to="/developers/developer-api">
                Developer API
              </Link>
              <Link className="button button--secondary button--lg" to="/introduction">
                What AchSwap does
              </Link>
            </div>
          </div>
        </section>

        <section className="homeSection">
          <div className="container">
            <div className="audienceGrid">
              {audiences.map((audience) => (
                <section className="audienceCard" key={audience.id} aria-labelledby={`aud-${audience.id}`}>
                  <span className="featureCard__label">{audience.eyebrow}</span>
                  <h2 id={`aud-${audience.id}`}>{audience.title}</h2>
                  <p>{audience.description}</p>
                  <ul>
                    {audience.entries.map((entry) => (
                      <li key={entry.to}>
                        <Link to={entry.to}>
                          <span>{entry.label}</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="networkPanel">
              <div>
                <span className="networkPanel__label">Network</span>
                <strong>Arc Mainnet</strong>
              </div>
              <div>
                <span className="networkPanel__label">Chain ID</span>
                <strong>5042</strong>
              </div>
              <div>
                <span className="networkPanel__label">Gas token</span>
                <strong>USDC</strong>
              </div>
              <Link className="networkPanel__link" to="/getting-started/network-setup">
                Network setup
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
