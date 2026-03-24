---
sidebar_position: 8
---

# Integration Guide

This guide explains how to integrate with AchMarket prediction markets from any application (web, mobile, backend). It provides complete function documentation, data structures, and ABI references that work with any web3 framework (Ethers.js, Viem, Web3.py, etc.).

---

## System Overview

AchMarket uses a three-contract architecture:

| Contract | Purpose | Address |
|----------|---------|---------|
| **PredictionMarketFactory** | Creates and registers new markets | `FACTORY_ADDRESS` |
| **PredictionMarketLens** | Read-only analytics and data aggregation | `LENS_ADDRESS` |
| **PredictionMarket** | Individual market - one per prediction market | Unique per market |

### Market Lifecycle

A market goes through these stages:

| Stage | Value | Description | User Actions |
|-------|-------|-------------|---------------|
| **Active** | 0 | Trading is open | Buy, Sell |
| **Suspended** | 1 | Trading paused by admin | None |
| **Resolved** | 2 | Market decided, winners can claim | Redeem |
| **Cancelled** | 3 | Admin cancelled market | Refund |
| **Expired** | 4 | Grace period passed, no resolution | Refund |

---

## Native Currency

- **Currency**: USDC (native gas token)
- **Decimals**: 18 (same as ETH)
- All amounts in contracts are in wei (1 USDC = 10¹⁸ wei)

---

## Contract ABIs

### PredictionMarketFactory ABI

Use this ABI to interact with the factory that creates and tracks all markets.

```javascript
const ABI_FACTORY = [
  // Write Functions
  'function createMarket(string _title, string _description, string _category, string _imageUri, string[] _outcomeLabels, int256 _bWad, uint256 _durationSeconds) external returns (address)',
  'function editMarket(address market, string _title, string _description, string _category) external',
  'function setMinBWad(int256 _min) external',
  'function setMaxBWad(int256 _max) external',
  'function setDurationBounds(uint256 _min, uint256 _max) external',
  
  // View Functions - Registry
  'function totalMarkets() view returns (uint256)',
  'function markets(uint256) view returns (address)',
  'function getMarketCount() view returns (uint256)',
  'function getMarkets(uint256 offset, uint256 limit) view returns (address[])',
  'function isMarket(address) view returns (bool)',
  'function marketIndex(address) view returns (uint256)',
  
  // View Functions - Configuration
  'function minBWad() view returns (int256)',
  'function maxBWad() view returns (int256)',
  'function minDuration() view returns (uint256)',
  'function maxDuration() view returns (uint256)',
  
  // Events
  'event MarketCreated(address indexed market, uint256 indexed marketId, address indexed creator, string title, string category, uint256 outcomeCount, uint256 deadline)'
];
```

### PredictionMarketLens ABI

Use this ABI to fetch aggregated data, market summaries, and user portfolios.

```javascript
const ABI_LENS = [
  // Global Analytics
  'function getGlobalStats() view returns (uint256 totalMarkets, uint256 totalVolumeWei, uint256 totalParticipants, uint256 activeMarkets, uint256 resolvedMarkets, uint256 cancelledOrExpiredMarkets)',
  
  // Market List (Paginated)
  'function getMarketSummaries(uint256 offset, uint256 limit) view returns (tuple(address market, uint256 marketId, string title, string category, string imageUri, string[] outcomeLabels, int256[] impliedProbabilitiesWad, uint8 stage, uint256 winningOutcome, uint256 marketDeadline, uint256 totalVolumeWei, uint256 participants, int256 bWad)[])',
  
  // Single Market Detail
  'function getMarketDetail(address market) view returns (tuple(address market, string title, string description, string category, string imageUri, string proofUri, string[] outcomeLabels, int256[] totalSharesWad, int256[] impliedProbabilitiesWad, uint8 stage, uint256 winningOutcome, uint256 createdAt, uint256 marketDeadline, int256 bWad, uint256 totalVolumeWei, uint256 participants, uint256 resolvedPoolWei, uint256 resolutionDeadline, string cancelReason, string cancelProofUri))',
  
  // User Portfolio
  'function getUserPortfolio(address user) view returns (tuple(address market, string title, string category, string[] outcomeLabels, uint256[] sharesPerOutcome, uint256 netDepositedWei, bool canRedeem, bool canRefund, bool hasRedeemed, bool hasRefunded, uint8 stage)[])',
  
  // Utility
  'function factory() view returns (address)'
];
```

### PredictionMarket ABI (Per Market)

Use this ABI to interact with a specific market contract. Replace `MARKET_ADDRESS` with the specific market's address.

```javascript
const ABI_MARKET = [
  // === WRITE FUNCTIONS (USER ACTIONS) ===
  
  // Buy shares of an outcome
  // outcomeIdx: Which outcome to buy (0 = first outcome, 1 = second, etc.)
  // sharesWad: Amount of shares (in wei, 1e18 = 1 full share)
  // maxCostWei: Maximum USDC willing to pay (slippage protection)
  // Returns: Any excess USDC is refunded to caller
  'function buy(uint256 outcomeIdx, uint256 sharesWad, uint256 maxCostWei) external payable',
  
  // Sell shares back to market
  // outcomeIdx: Which outcome to sell
  // sharesWad: Amount of shares to sell (in wei)
  // minReceiveWei: Minimum USDC expected (slippage protection)
  // Returns: Proceeds in USDC sent to caller
  'function sell(uint256 outcomeIdx, uint256 sharesWad, uint256 minReceiveWei) external',
  
  // Redeem winnings (only for resolved markets)
  // Call when market stage is Resolved and you hold winning outcome shares
  // Returns: Your share of the resolved pool in USDC
  'function redeem() external',
  
  // Get refund (only for cancelled/expired markets)
  // Call when market stage is Cancelled or Expired
  // Returns: Pro-rata share of remaining pool based on net deposits
  'function refund() external',
  
  // === VIEW FUNCTIONS (DATA) ===
  
  // Market Metadata
  'function title() view returns (string)',
  'function description() view returns (string)',
  'function category() view returns (string)',
  'function imageUri() view returns (string)',
  'function createdAt() view returns (uint256)',
  'function admin() view returns (address)',
  
  // Outcomes
  'function outcomeLabels(uint256) view returns (string)',
  'function outcomeCount() view returns (uint256)',
  
  // LMSR Pricing
  'function b() view returns (int256)',
  'function getShares() view returns (int256[])',
  'function getImpliedProbabilities() view returns (int256[])',
  
  // User Positions
  'function sharesOf(address user, uint256 outcomeIdx) view returns (uint256)',
  'function netDepositedWei(address user) view returns (uint256)',
  'function hasRedeemed(address user) view returns (bool)',
  'function hasRefunded(address user) view returns (bool)',
  'function getUserInfo(address user) view returns (uint256[] memory _shares, uint256 _netDeposited, bool _redeemed, bool _refunded, bool _canRedeem, bool _canRefund)',
  
  // Market State
  'function stage() view returns (uint8)',
  'function winningOutcome() view returns (uint256)',
  'function marketDeadline() view returns (uint256)',
  'function proofUri() view returns (string)',
  'function cancelReason() view returns (string)',
  'function cancelProofUri() view returns (string)',
  'function resolvedPoolWei() view returns (uint256)',
  'function resolutionDeadline() view returns (uint256)',
  
  // Analytics
  'function totalVolumeWei() view returns (uint256)',
  'function participantCount() view returns (uint256)',
  'function totalNetDepositedWei() view returns (uint256)',
  
  // Price Previews
  'function previewBuy(uint256 outcomeIdx, uint256 sharesWad) view returns (uint256 costWei)',
  'function previewSell(uint256 outcomeIdx, uint256 sharesWad) view returns (uint256 proceedsWei)',
  
  // Complete Market Info
  'function getMarketInfo() view returns (string memory _title, string memory _description, string memory _category, string memory _imageUri, string memory _proofUri, string[] memory _outcomeLabels, uint8 _stage, uint256 _winningOutcome, uint256 _createdAt, uint256 _marketDeadline, uint256 _totalVolumeWei, uint256 _participantCount, string memory _cancelReason, string memory _cancelProofUri)',
  
  // Admin/Utility
  'function triggerExpiry() external',
  'function resolutionDeadline() view returns (uint256)'
];
```

---

## Data Types Reference

### WAD Format (Fixed-Point 18 Decimals)

- Used for: Shares, probabilities, cost amounts
- Conversion: `human = raw / 1e18`
- Example: `1000000000000000000` = 1.0 (100% or 1 share)

### Implied Probabilities

- Format: WAD (0 to 1e18)
- `1e18` = 100%
- `5e17` = 50%
- `1e17` = 10%
- Sum of all outcome probabilities ≈ 1e18

### Timestamps

- Unix timestamp in seconds
- Multiply by 1000 for JavaScript Date

---

## Integration Flow

### Step 1: Initialize Provider

Connect to the blockchain using your preferred framework:

```javascript
// Ethers.js
import { ethers } from 'ethers';
const provider = new ethers.BrowserProvider(window.ethereum);

// Viem
import { createPublicClient, http } from 'viem';
const client = createPublicClient({
  chain: arcTestnet,
  transport: http()
});
```

### Step 2: Get Market List

```javascript
// Get total number of markets
const totalMarkets = await factory.totalMarkets();

// Get market addresses (paginated)
const marketAddresses = await factory.getMarkets(0, 10);

// Get market summaries with probabilities
const summaries = await lens.getMarketSummaries(0, 10);
```

### Step 3: Get Market Details

```javascript
// Full details for a single market
const detail = await lens.getMarketDetail(marketAddress);

// Access fields:
// detail.title - Market name
// detail.description - Full description
// detail.imageUri - Image URL for market
// detail.outcomeLabels - Array of outcome names (e.g., ["Yes", "No"])
// detail.impliedProbabilitiesWad - Array of probabilities (divide by 1e18)
// detail.stage - Current stage (0-4)
// detail.marketDeadline - Unix timestamp when trading ends
// detail.totalVolumeWei - Total trading volume
```

### Step 4: Execute Transactions

**Buying Shares:**

```javascript
// 1. Preview cost first
const costWei = await market.previewBuy(outcomeIdx, sharesWad);

// 2. Execute buy with slippage protection
// Set maxCostWei = costWei * 1.05 (5% slippage)
const maxCostWei = costWei * 105 / 100;

await market.buy(outcomeIdx, sharesWad, maxCostWei, { value: maxCostWei });
```

**Selling Shares:**

```javascript
// 1. Preview proceeds first
const proceedsWei = await market.previewSell(outcomeIdx, sharesWad);

// 2. Execute sell with slippage protection
// Set minReceiveWei = proceedsWei * 0.95 (5% slippage)
const minReceiveWei = proceedsWei * 95 / 100;

await market.sell(outcomeIdx, sharesWad, minReceiveWei);
```

**Redeeming Winnings:**

```javascript
// Check if user can redeem
const [, , , , canRedeem] = await market.getUserInfo(userAddress);

if (canRedeem) {
  await market.redeem();
}
```

**Getting Refund:**

```javascript
// Check if user can refund
const [, , , , , canRefund] = await market.getUserInfo(userAddress);

if (canRefund) {
  await market.refund();
}
```

---

## Key Functions Explained

### Understanding LMSR Pricing

The market uses Logarithmic Market Scoring Rule (LMSR) for dynamic pricing:

- **Price increases** as more people buy the same outcome
- **Price decreases** as people sell
- **Implied probability** reflects the current market sentiment
- Use `previewBuy()` and `previewSell()` to get exact prices before trading

### Slippage Protection

Always use slippage protection when trading:

- **Buy**: Set `maxCostWei` higher than expected cost
- **Sell**: Set `minReceiveWei` lower than expected proceeds
- Recommended: 1-5% buffer depending on market liquidity

### User Position Tracking

To get a user's complete portfolio:

```javascript
const positions = await lens.getUserPortfolio(userAddress);

// Each position contains:
// - market: Market contract address
// - title: Market name
// - outcomeLabels: ["Yes", "No", etc.]
// - sharesPerOutcome: Array of share amounts (WAD)
// - netDepositedWei: Total USDC deposited minus withdrawn
// - canRedeem: Boolean - can claim winnings?
// - canRefund: Boolean - can get refund?
// - hasRedeemed: Boolean - already claimed?
// - hasRefunded: Boolean - already refunded?
```

---

## Events to Monitor

Listen to these events for real-time updates:

```javascript
// Trading Events
event SharesBought(address indexed trader, uint256 indexed outcomeIndex, uint256 sharesWad, uint256 costWei);
event SharesSold(address indexed trader, uint256 indexed outcomeIndex, uint256 sharesWad, uint256 proceedsWei);

// Resolution Events
event MarketResolved(uint256 winningOutcome, string proofUri);
event MarketCancelled(string reason, string proofUri);

// Claim Events
event Redeemed(address indexed user, uint256 amountWei);
event Refunded(address indexed user, uint256 amountWei);
```

---

## Error Codes Reference

| Error Message | Meaning |
|---------------|---------|
| `PM: market not active` | Market is not in Active stage |
| `PM: trading period ended` | Past market deadline |
| `PM: invalid outcome` | Invalid outcome index |
| `PM: zero shares` | Amount must be > 0 |
| `PM: slippage exceeded` | Price moved beyond slippage limit |
| `PM: insufficient ETH` | Not enough USDC sent (check msg.value) |
| `PM: insufficient shares` | Not enough shares to sell |
| `PM: not resolved` | Market not resolved yet |
| `PM: already redeemed` | Already claimed winnings |
| `PM: refunds not open` | Market not cancelled/expired |
| `PM: already refunded` | Already claimed refund |
| `PM: nothing to refund` | No deposit to refund |

---

## Complete Integration Checklist

- [ ] Initialize provider (Ethers.js, Viem, Web3.py, etc.)
- [ ] Connect factory and lens contracts
- [ ] Fetch market list with pagination
- [ ] Display market cards with images
- [ ] Show implied probabilities (divide WAD by 1e18)
- [ ] Display market deadline with countdown
- [ ] Implement buy with slippage protection
- [ ] Implement sell with slippage protection
- [ ] Show buy/sell only when market is Active and before deadline
- [ ] Display resolved market with winner highlighted
- [ ] Show redeem button when user can redeem
- [ ] Show refund button when user can refund
- [ ] Fetch and display user portfolio
- [ ] Handle all error cases gracefully
- [ ] Format amounts correctly (wei / 1e18 for display)