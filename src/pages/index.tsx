import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';

const products = [
  {
    title: 'Swap',
    description:
      'Compare aggregator and LI.FI quotes, inspect the route, and swap on Arc Mainnet.',
    href: '/achswap/swap',
    items: ['Token swaps', 'Split and mixed-DEX routes', 'Route map'],
  },
  {
    title: 'Liquidity',
    description:
      'Provide liquidity in AchSwap V2 pools or manage concentrated V3 positions.',
    href: '/achswap/add-liquidity',
    items: ['V2 pools', 'V3 positions', 'Fees and ranges'],
  },
  {
    title: 'Contracts',
    description:
      'Find the deployed Arc Mainnet contracts and all seven active routing adapters.',
    href: '/technical/contract-addresses',
    items: ['AchSwap V2 and V3', 'Aggregator contracts', 'Adapter registry'],
  },
];

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="Documentation"
      description="AchSwap swaps, liquidity, routing, and contract addresses on Arc Mainnet">
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
            <h1 className="homeHero__title">{siteConfig.title}</h1>
            <p className="homeHero__subtitle">{siteConfig.tagline}</p>

            <div className="homeActions">
              <Link className="button button--primary button--lg" to="/introduction">
                Start reading
              </Link>
              <Link className="button button--secondary button--lg" to="/achswap/swap">
                AchSwap
              </Link>
              <Link className="button button--secondary button--lg" to="/achswap/add-liquidity">
                Liquidity
              </Link>
              <Link className="button button--secondary button--lg" to="/technical/contract-addresses">
                Contracts
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
