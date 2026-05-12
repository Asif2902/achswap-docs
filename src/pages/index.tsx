import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

const products = [
  {
    title: 'AchSwap v3',
    description:
      'Swap tokens with smart routing across V2 and V3 style liquidity, manage pools, and bridge USDC on Arc.',
    href: '/achswap/swap',
    items: ['Token swaps', 'Concentrated liquidity', 'Cross-chain USDC bridge'],
  },
  {
    title: 'AchRWA',
    description:
      'Buy and redeem vault-backed synthetic assets for stocks, commodities, and forex using native USDC.',
    href: '/achrwa/overview',
    items: ['10 supported RWA assets', 'Oracle-based pricing', 'USDC-backed redemptions'],
  },
  {
    title: 'AchMarket',
    description:
      'Create and trade prediction markets with LMSR pricing, outcome shares, and transparent resolution flows.',
    href: '/achmarket/browse-markets',
    items: ['Browse markets', 'Trade outcome shares', 'Resolve with proof'],
  },
];

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="Documentation"
      description="AchSwap & AchMarket Documentation - Decentralized Exchange and Prediction Markets on ARC">
      <main>
        <section className="homeHero">
          <div className="container homeHero__inner">
            <p className="homeHero__eyebrow">Arc DeFi documentation</p>
            <h1 className="homeHero__title">{siteConfig.title}</h1>
            <p className="homeHero__subtitle">{siteConfig.tagline}</p>

            <div className="homeActions">
              <Link className="button button--primary button--lg" to="/introduction">
                Start reading
              </Link>
              <Link className="button button--secondary button--lg" to="/achswap/swap">
                AchSwap v3
              </Link>
              <Link className="button button--secondary button--lg" to="/achrwa/overview">
                AchRWA
              </Link>
              <Link className="button button--secondary button--lg" to="/achmarket/browse-markets">
                AchMarket
              </Link>
            </div>
          </div>
        </section>

        <section className="homeSection">
          <div className="container">
            <div className="featureGrid">
              {products.map((product) => (
                <Link className="featureCard" to={product.href} key={product.title}>
                  <span className="featureCard__label">Docs</span>
                  <h2>{product.title}</h2>
                  <p>{product.description}</p>
                  <ul className="featureList">
                    {product.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>

            <div className="networkPanel">
              <div>
                <span className="networkPanel__label">Network</span>
                <strong>ARC Testnet</strong>
              </div>
              <div>
                <span className="networkPanel__label">Chain ID</span>
                <strong>5042002</strong>
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
