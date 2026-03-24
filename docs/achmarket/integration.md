---
sidebar_position: 8
---

# Integration Guide

This guide shows how to integrate AchMarket into a React frontend. It covers contract setup, fetching market data, and rendering markets with images and probabilities.

---

## System Overview

AchMarket uses a three-contract architecture:

| Contract | Purpose |
|----------|---------|
| **PredictionMarketFactory** | Creates and registers new markets |
| **PredictionMarket** | Individual market with LMSR pricing, trading, and redemption |
| **PredictionMarketLens** | Read-only analytics and data aggregation |

### Market Stages

| Stage | Value | Description |
|-------|-------|-------------|
| Active | 0 | Trading is open |
| Suspended | 1 | Trading paused |
| Resolved | 2 | Winners can redeem |
| Cancelled | 3 | Full refund available |
| Expired | 4 | Full refund available |

---

## Prerequisites

Install required packages:

```bash
npm install ethers viem @tanstack/react-query
```

---

## Contract Setup

### Using Ethers.js

```javascript
import { ethers } from 'ethers';

const FACTORY_ADDRESS = '0x...'; // Replace with actual factory address
const LENS_ADDRESS = '0x...';    // Replace with actual lens address

const ABI_FACTORY = [
  'function totalMarkets() view returns (uint256)',
  'function getMarkets(uint256 offset, uint256 limit) view returns (address[])',
  'function isMarket(address) view returns (bool)',
  'function markets(uint256) view returns (address)',
  'function getMarketCount() view returns (uint256)'
];

const ABI_LENS = [
  'function getMarketSummaries(uint256 offset, uint256 limit) view returns (tuple(address market, uint256 marketId, string title, string category, string imageUri, string[] outcomeLabels, int256[] impliedProbabilitiesWad, uint8 stage, uint256 winningOutcome, uint256 marketDeadline, uint256 totalVolumeWei, uint256 participants, int256 bWad)[])',
  'function getMarketDetail(address market) view returns (tuple(address market, string title, string description, string category, string imageUri, string proofUri, string[] outcomeLabels, int256[] totalSharesWad, int256[] impliedProbabilitiesWad, uint8 stage, uint256 winningOutcome, uint256 createdAt, uint256 marketDeadline, int256 bWad, uint256 totalVolumeWei, uint256 participants, uint256 resolvedPoolWei, uint256 resolutionDeadline, string cancelReason, string cancelProofUri))',
  'function getUserPortfolio(address user) view returns (tuple(address market, string title, string category, string[] outcomeLabels, uint256[] sharesPerOutcome, uint256 netDepositedWei, bool canRedeem, bool canRefund, bool hasRedeemed, bool hasRefunded, uint8 stage)[])',
  'function getGlobalStats() view returns (uint256 totalMarkets, uint256 totalVolumeWei, uint256 totalParticipants, uint256 activeMarkets, uint256 resolvedMarkets, uint256 cancelledOrExpiredMarkets)',
  'function factory() view returns (address)'
];

const ABI_MARKET = [
  // Write functions
  'function buy(uint256 outcomeIdx, uint256 sharesWad, uint256 maxCostWei) external payable',
  'function sell(uint256 outcomeIdx, uint256 sharesWad, uint256 minReceiveWei) external',
  'function redeem() external',
  'function refund() external',
  
  // View functions - Metadata
  'function title() view returns (string)',
  'function description() view returns (string)',
  'function category() view returns (string)',
  'function imageUri() view returns (string)',
  'function createdAt() view returns (uint256)',
  'function admin() view returns (address)',
  
  // View functions - Outcomes
  'function outcomeLabels(uint256) view returns (string)',
  'function outcomeCount() view returns (uint256)',
  
  // View functions - LMSR
  'function b() view returns (int256)',
  'function totalSharesWad(uint256) view returns (int256)',
  'function getShares() view returns (int256[])',
  'function getImpliedProbabilities() view returns (int256[])',
  
  // View functions - User positions
  'function sharesOf(address, uint256) view returns (uint256)',
  'function netDepositedWei(address) view returns (uint256)',
  'function hasRedeemed(address) view returns (bool)',
  'function hasRefunded(address) view returns (bool)',
  'function getUserInfo(address user) view returns (uint256[] memory _shares, uint256 _netDeposited, bool _redeemed, bool _refunded, bool _canRedeem, bool _canRefund)',
  
  // View functions - Market state
  'function stage() view returns (uint8)',
  'function winningOutcome() view returns (uint256)',
  'function marketDeadline() view returns (uint256)',
  'function proofUri() view returns (string)',
  'function cancelReason() view returns (string)',
  'function cancelProofUri() view returns (string)',
  'function resolvedPoolWei() view returns (uint256)',
  'function resolutionDeadline() view returns (uint256)',
  
  // View functions - Analytics
  'function totalVolumeWei() view returns (uint256)',
  'function participantCount() view returns (uint256)',
  'function totalNetDepositedWei() view returns (uint256)',
  
  // View functions - Previews
  'function previewBuy(uint256 outcomeIdx, uint256 sharesWad) view returns (uint256 costWei)',
  'function previewSell(uint256 outcomeIdx, uint256 sharesWad) view returns (uint256 proceedsWei)',
  
  // View functions - Full info
  'function getMarketInfo() view returns (string memory _title, string memory _description, string memory _category, string memory _imageUri, string memory _proofUri, string[] memory _outcomeLabels, uint8 _stage, uint256 _winningOutcome, uint256 _createdAt, uint256 _marketDeadline, uint256 _totalVolumeWei, uint256 _participantCount, string memory _cancelReason, string memory _cancelProofUri)'
];

export function getContracts(provider) {
  const factory = new ethers.Contract(FACTORY_ADDRESS, ABI_FACTORY, provider);
  const lens = new ethers.Contract(LENS_ADDRESS, ABI_LENS, provider);
  return { factory, lens };
}

export function getMarketContract(marketAddress, signer) {
  return new ethers.Contract(marketAddress, ABI_MARKET, signer);
}
```

### Using Viem

```javascript
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const client = createPublicClient({
  chain: yourChain,
  transport: http()
});

const walletClient = createWalletClient({
  chain: yourChain,
  transport: http(),
  account: yourAccount
});
```

---

## Fetching Market Data

### Get All Markets

```javascript
async function fetchMarkets(provider, offset = 0, limit = 10) {
  const { lens } = getContracts(provider);
  
  const summaries = await lens.getMarketSummaries(offset, limit);
  
  return summaries.map((s, i) => ({
    address: s.market,
    id: s.marketId,
    title: s.title,
    category: s.category,
    imageUri: s.imageUri,
    outcomes: s.outcomeLabels,
    probabilities: s.impliedProbabilitiesWad.map(p => Number(p) / 1e18),
    stage: Number(s.stage),
    winningOutcome: Number(s.winningOutcome),
    deadline: Number(s.marketDeadline),
    volume: Number(s.totalVolumeWei) / 1e18,
    participants: Number(s.participants)
  }));
}
```

### Get Single Market Detail

```javascript
async function fetchMarketDetail(provider, marketAddress) {
  const { lens } = getContracts(provider);
  
  const detail = await lens.getMarketDetail(marketAddress);
  
  return {
    address: detail.market,
    title: detail.title,
    description: detail.description,
    category: detail.category,
    imageUri: detail.imageUri,
    proofUri: detail.proofUri,
    outcomes: detail.outcomeLabels,
    probabilities: detail.impliedProbabilitiesWad.map(p => Number(p) / 1e18),
    totalShares: detail.totalSharesWad.map(s => Number(s) / 1e18),
    stage: Number(detail.stage),
    winningOutcome: Number(detail.winningOutcome),
    createdAt: Number(detail.createdAt),
    deadline: Number(detail.marketDeadline),
    volume: Number(detail.totalVolumeWei) / 1e18,
    participants: Number(detail.participants),
    resolvedPoolWei: Number(detail.resolvedPoolWei),
    resolutionDeadline: Number(detail.resolutionDeadline),
    cancelReason: detail.cancelReason,
    cancelProofUri: detail.cancelProofUri
  };
}
```

---

## Rendering Market Cards

### Basic Market Card Component

```jsx
import React from 'react';

function MarketCard({ market, onClick }) {
  const formatProbability = (prob) => {
    return `${(prob * 100).toFixed(1)}%`;
  };
  
  const formatDeadline = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatVolume = (volume) => {
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toFixed(2);
  };
  
  const getStageLabel = (stage) => {
    const labels = ['Active', 'Suspended', 'Resolved', 'Cancelled', 'Expired'];
    return labels[stage] || 'Unknown';
  };
  
  return (
    <div 
      className="market-card" 
      onClick={() => onClick(market.address)}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s'
      }}
    >
      {/* Image */}
      {market.imageUri && (
        <img 
          src={market.imageUri} 
          alt={market.title}
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '12px'
          }}
        />
      )}
      
      {/* Title & Category */}
      <h3 style={{ margin: '0 0 8px 0' }}>{market.title}</h3>
      <span 
        style={{
          display: 'inline-block',
          padding: '4px 8px',
          background: '#f0f0f0',
          borderRadius: '4px',
          fontSize: '12px'
        }}
      >
        {market.category}
      </span>
      
      {/* Probabilities */}
      <div style={{ marginTop: '12px' }}>
        {market.outcomes.map((outcome, idx) => (
          <div 
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}
          >
            <span>{outcome}</span>
            <span style={{ fontWeight: 'bold' }}>
              {formatProbability(market.probabilities[idx])}
            </span>
          </div>
        ))}
      </div>
      
      {/* Footer Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #e0e0e0',
        fontSize: '12px',
        color: '#666'
      }}>
        <span>{getStageLabel(market.stage)}</span>
        <span>Vol: {formatVolume(market.volume)} USDC</span>
        <span>Ends: {formatDeadline(market.deadline)}</span>
      </div>
    </div>
  );
}

export default MarketCard;
```

### Market Grid

```jsx
function MarketGrid({ markets, onMarketClick }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      padding: '20px'
    }}>
      {markets.map(market => (
        <MarketCard 
          key={market.address}
          market={market}
          onClick={onMarketClick}
        />
      ))}
    </div>
  );
}
```

---

## Rendering Market Detail Page

### Full Market Detail Component

```jsx
function MarketDetailPage({ market, userAddress, onBuy, onSell, onRedeem, onRefund }) {
  const formatProbability = (prob) => `${(prob * 100).toFixed(1)}%`;
  const formatEth = (wei) => `${(Number(wei) / 1e18).toFixed(4)} USDC`;
  
  const isResolved = market.stage === 2;
  const isCancelled = market.stage === 3;
  const isExpired = market.stage === 4;
  const isActive = market.stage === 0;
  const canTrade = isActive && Date.now() / 1000 < market.deadline;
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Header with Image */}
      {market.imageUri && (
        <img 
          src={market.imageUri}
          alt={market.title}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '12px',
            marginBottom: '20px'
          }}
        />
      )}
      
      {/* Title & Description */}
      <h1>{market.title}</h1>
      <p style={{ color: '#666', fontSize: '16px' }}>{market.description}</p>
      
      {/* Category Tag */}
      <span style={{
        display: 'inline-block',
        padding: '6px 12px',
        background: '#e3f2fd',
        borderRadius: '20px',
        fontSize: '14px'
      }}>
        {market.category}
      </span>
      
      {/* Market Stats */}
      <div style={{
        display: 'flex',
        gap: '20px',
        margin: '20px 0',
        padding: '16px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>Volume</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {market.volume.toFixed(2)} USDC
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>Participants</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {market.participants}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>Deadline</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {new Date(market.deadline * 1000).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      {/* Outcomes & Probabilities */}
      <h2>Outcomes</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {market.outcomes.map((outcome, idx) => (
          <div 
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: isResolved && market.winningOutcome === idx ? '#e8f5e9' : '#fff',
              border: isResolved && market.winningOutcome === idx ? '2px solid #4caf50' : '1px solid #ddd',
              borderRadius: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isResolved && market.winningOutcome === idx && (
                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓ Winner</span>
              )}
              <span style={{ fontSize: '18px', fontWeight: '500' }}>{outcome}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {formatProbability(market.probabilities[idx])}
              </span>
              {canTrade && (
                <button
                  onClick={() => onBuy(idx)}
                  style={{
                    padding: '8px 16px',
                    background: '#2196f3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Buy
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Resolution Info */}
      {(isResolved || isCancelled || isExpired) && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: isResolved ? '#e8f5e9' : isCancelled ? '#ffebee' : '#fff3e0',
          borderRadius: '8px'
        }}>
          <h3>
            {isResolved ? 'Market Resolved' : isCancelled ? 'Market Cancelled' : 'Market Expired'}
          </h3>
          {market.proofUri && (
            <p>Proof: <a href={market.proofUri}>{market.proofUri}</a></p>
          )}
          {market.cancelReason && (
            <p>Reason: {market.cancelReason}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Trading Interface

### Buy Component

```jsx
function BuyPanel({ market, outcomeIdx, outcomeLabel, onConfirm }) {
  const [amount, setAmount] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(null);
  
  useEffect(() => {
    if (amount && market) {
      // Call previewBuy to get estimated cost
      // estimateCost(market.address, outcomeIdx, parseFloat(amount) * 1e18)
      //   .then(setEstimatedCost);
    }
  }, [amount, market, outcomeIdx]);
  
  const handleBuy = () => {
    const sharesWad = ethers.parseEther(amount);
    const maxCost = estimatedCost ? estimatedCost.mul(105).div(100) : ethers.parseEther(amount); // 5% slippage
    onConfirm(outcomeIdx, sharesWad, maxCost);
  };
  
  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h4>Buy {outcomeLabel}</h4>
      <input
        type="number"
        placeholder="Amount (USDC)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '12px',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}
      />
      {estimatedCost && (
        <p>Estimated cost: {ethers.formatEther(estimatedCost)} USDC</p>
      )}
      <button
        onClick={handleBuy}
        disabled={!amount}
        style={{
          width: '100%',
          padding: '12px',
          background: '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Buy Shares
      </button>
    </div>
  );
}
```

### Sell Component

```jsx
function SellPanel({ market, outcomeIdx, outcomeLabel, userShares, onConfirm }) {
  const [amount, setAmount] = useState('');
  const [estimatedProceeds, setEstimatedProceeds] = useState(null);
  
  const handleSell = () => {
    const sharesWad = ethers.parseEther(amount);
    const minReceive = estimatedProceeds ? estimatedProceeds.mul(95).div(100) : 0; // 5% slippage
    onConfirm(outcomeIdx, sharesWad, minReceive);
  };
  
  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h4>Sell {outcomeLabel}</h4>
      <p>Your shares: {userShares ? ethers.formatEther(userShares) : 0}</p>
      <input
        type="number"
        placeholder="Amount to sell"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '12px'
        }}
      />
      <button
        onClick={handleSell}
        disabled={!amount || !userShares}
        style={{
          width: '100%',
          padding: '12px',
          background: '#ff9800',
          color: '#fff',
          border: 'none',
          borderRadius: '6px'
        }}
      >
        Sell Shares
      </button>
    </div>
  );
}
```

---

## User Portfolio

### Portfolio Component

```jsx
function Portfolio({ positions, onRedeem, onRefund }) {
  const formatEth = (wei) => ethers.formatEther(wei);
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Portfolio</h2>
      {positions.length === 0 ? (
        <p>No positions yet</p>
      ) : (
        positions.map((pos) => (
          <div 
            key={pos.market}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}
          >
            <h3>{pos.title}</h3>
            <p>Category: {pos.category}</p>
            
            {/* Shares */}
            <div style={{ margin: '12px 0' }}>
              <strong>Your Shares:</strong>
              {pos.outcomeLabels.map((label, idx) => (
                <div key={idx}>
                  {label}: {pos.sharesPerOutcome[idx] ? formatEth(pos.sharesPerOutcome[idx]) : 0}
                </div>
              ))}
            </div>
            
            {/* Net Deposited */}
            <p>Net Deposited: {formatEth(pos.netDeposited)} USDC</p>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {pos.canRedeem && (
                <button
                  onClick={() => onRedeem(pos.market)}
                  style={{
                    padding: '10px 20px',
                    background: '#4caf50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px'
                  }}
                >
                  Redeem Winnings
                </button>
              )}
              {pos.canRefund && (
                <button
                  onClick={() => onRefund(pos.market)}
                  style={{
                    padding: '10px 20px',
                    background: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px'
                  }}
                >
                  Get Refund
                </button>
              )}
              {pos.hasRedeemed && (
                <span style={{ color: '#4caf50' }}>✓ Redeemed</span>
              )}
              {pos.hasRefunded && (
                <span style={{ color: '#f44336' }}>✓ Refunded</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
```

---

## Executing Transactions

### Buy Shares

```javascript
async function buyShares(marketAddress, outcomeIdx, sharesWad, maxCostWei, signer) {
  const market = getMarketContract(marketAddress, signer);
  
  const tx = await market.buy(outcomeIdx, sharesWad, maxCostWei, {
    value: maxCostWei
  });
  
  const receipt = await tx.wait();
  return receipt;
}
```

### Sell Shares

```javascript
async function sellShares(marketAddress, outcomeIdx, sharesWad, minReceiveWei, signer) {
  const market = getMarketContract(marketAddress, signer);
  
  const tx = await market.sell(outcomeIdx, sharesWad, minReceiveWei);
  const receipt = await tx.wait();
  
  return receipt;
}
```

### Redeem Winnings

```javascript
async function redeem(marketAddress, signer) {
  const market = getMarketContract(marketAddress, signer);
  
  const tx = await market.redeem();
  const receipt = await tx.wait();
  
  return receipt;
}
```

### Get Refund

```javascript
async function refund(marketAddress, signer) {
  const market = getMarketContract(marketAddress, signer);
  
  const tx = await market.refund();
  const receipt = await tx.wait();
  
  return receipt;
}
```

---

## Handling Images

### Image Component with Fallback

```jsx
function MarketImage({ src, alt, style }) {
  const [error, setError] = useState(false);
  
  return (
    <img
      src={error ? '/placeholder-market.png' : src}
      alt={alt}
      onError={() => setError(true)}
      style={style}
    />
  );
}
```

### Using IPFS Images

```javascript
// If your imageUri is an IPFS link like ipfs://Qmxxx
function getImageUrl(ipfsUri) {
  if (!ipfsUri) return null;
  
  if (ipfsUri.startsWith('ipfs://')) {
    const ipfsHash = ipfsUri.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }
  
  return ipfsUri;
}

// Usage in component
<img src={getImageUrl(market.imageUri)} alt={market.title} />
```

---

## Utility Functions

### Format WAD to USDC

```javascript
function formatWadToEth(wad) {
  return (Number(wad) / 1e18).toFixed(4);
}

function parseEthToWad(eth) {
  return (parseFloat(eth) * 1e18).toString();
}
```

### Format Probability

```javascript
function formatProbability(probabilityWad) {
  return `${(Number(probabilityWad) / 1e18 * 100).toFixed(1)}%`;
}
```

### Time Formatting

```javascript
function formatTimestamp(timestamp) {
  return new Date(timestamp * 1000).toLocaleString();
}

function formatTimeRemaining(deadline) {
  const now = Math.floor(Date.now() / 1000);
  const remaining = deadline - now;
  
  if (remaining <= 0) return 'Ended';
  
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
```

---

## Complete Integration Example

```jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  
  // Initialize provider
  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
    }
  }, []);
  
  // Connect wallet
  const connectWallet = async () => {
    if (!provider) return;
    const signer = await provider.getSigner();
    setUserAddress(await signer.getAddress());
  };
  
  // Fetch markets
  useEffect(() => {
    if (!provider) return;
    // fetchMarkets(provider).then(setMarkets);
  }, [provider]);
  
  return (
    <div>
      {/* Header */}
      <header style={{ padding: '16px', borderBottom: '1px solid #ddd' }}>
        <h1>AchMarket</h1>
        {userAddress ? (
          <span>{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>
      
      {/* Main Content */}
      {selectedMarket ? (
        <MarketDetailPage 
          market={selectedMarket}
          userAddress={userAddress}
          onBuy={(idx, shares, maxCost) => /* handle buy */}
          onRedeem={(addr) => /* handle redeem */}
          onRefund={(addr) => /* handle refund */}
        />
      ) : (
        <MarketGrid 
          markets={markets}
          onMarketClick={(addr) => /* fetch and show detail */}
        />
      )}
    </div>
  );
}
```

---

## Testing Checklist

- [ ] Connect wallet and get user address
- [ ] Fetch and display market list
- [ ] Render market images correctly
- [ ] Display market probabilities as percentages
- [ ] Show market deadline with proper formatting
- [ ] Handle different market stages (Active, Resolved, etc.)
- [ ] Implement buy with slippage protection
- [ ] Implement sell with slippage protection
- [ ] Show redeem button when market is resolved
- [ ] Show refund button when market is cancelled/expired
- [ ] Fetch and display user portfolio
- [ ] Handle transaction errors gracefully
- [ ] Add loading states for async operations