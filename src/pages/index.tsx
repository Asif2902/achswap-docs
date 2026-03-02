import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="Documentation"
      description="AchSwap & AchMarket Documentation - Decentralized Exchange and Prediction Markets on ARC">
      <main>
        <div className="hero">
          <div className="container">
            <Heading as="h1" className="hero__title">
              {siteConfig.title}
            </Heading>
            <p className="hero__subtitle">
              {siteConfig.tagline}
            </p>
            
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link className="button button--primary button--lg" to="/introduction">
                Get Started
              </Link>
              <Link className="button button--secondary button--lg" to="/achswap/swap">
                AchSwap v3
              </Link>
              <Link className="button button--secondary button--lg" to="/achmarket/browse-markets">
                AchMarket
              </Link>
            </div>
          </div>
        </div>

        <div className="container" style={{padding: '3rem 0'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
            <div className="card">
              <Heading as="h3">AchSwap v3</Heading>
              <p>
                A modern decentralized exchange supporting both Uniswap V2 and V3 style liquidity pools. 
                Trade tokens, add liquidity, and earn fees on ARC Testnet.
              </p>
              <ul style={{marginTop: '1rem', color: '#94a3b8'}}>
                <li>Token Swapping</li>
                <li>Concentrated Liquidity</li>
                <li>Cross-Chain Bridge</li>
              </ul>
            </div>

            <div className="card">
              <Heading as="h3">AchMarket</Heading>
              <p>
                Decentralized prediction markets powered by LMSR. 
                Create markets, trade on outcomes, and earn fees on resolved markets.
              </p>
              <ul style={{marginTop: '1rem', color: '#94a3b8'}}>
                <li>Create Prediction Markets</li>
                <li>Trade Outcome Shares</li>
                <li>0.25% Platform Fee</li>
              </ul>
            </div>

            <div className="card">
              <Heading as="h3">ARC Testnet</Heading>
              <p>
                Both applications run on ARC Testnet with USDC as the native gas token. 
                No ETH required - just USDC for all operations.
              </p>
              <ul style={{marginTop: '1rem', color: '#94a3b8'}}>
                <li>Chain ID: 5042002</li>
                <li>USDC as Gas Token</li>
                <li>CCTP Cross-Chain</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
