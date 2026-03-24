---
sidebar_position: 8
---

# Integration Guide

This guide explains how to integrate with AchMarket prediction markets from any application (web, mobile, backend). It provides complete function documentation, data structures, and ABI references that work with any web3 framework (Ethers.js, Viem, Web3.py, etc.).

---

## System Overview

AchMarket uses a three-contract architecture:

| Contract | Purpose | Address (ARC Testnet) |
|----------|---------|----------------------|
| **PredictionMarketFactory** | Creates and registers new markets | `0xd7b122B12caCB299249f89be7F241a47f762f283` |
| **PredictionMarketLens** | Read-only analytics and data aggregation | `0x8241ACa87D4Dee4CA167b1e172Ed955522599e70` |
| **PredictionMarket** | Individual market - one per prediction market | Unique per market |

### Network Configuration

| Parameter | Value |
|-----------|-------|
| Chain ID | 5042002 (0x4CEC52) |
| RPC URL | https://arc-testnet.drpc.org/ |
| Block Explorer | https://testnet.arcscan.app |
| Native Currency | USDC (18 decimals) |

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

## Contract ABIs

### PredictionMarketFactory ABI

```javascript
export const FACTORY_ABI = [
  // Read functions
  "function owner() view returns (address)",
  "function totalMarkets() view returns (uint256)",
  "function markets(uint256) view returns (address)",
  "function isMarket(address) view returns (bool)",
  "function minBWad() view returns (int256)",
  "function maxBWad() view returns (int256)",
  "function minDuration() view returns (uint256)",
  "function maxDuration() view returns (uint256)",
  "function getMarkets(uint256 offset, uint256 limit) view returns (address[])",
  "function getMarketCount() view returns (uint256)",

  // Events
  "event MarketCreated(address indexed market, uint256 indexed marketId, address indexed creator, string title, string category, uint256 outcomeCount, uint256 deadline)",
];
```

### PredictionMarketLens ABI

```javascript
export const LENS_ABI = [
  // Global stats - aggregate data across all markets
  "function getGlobalStats() view returns (tuple(uint256 totalMarkets, uint256 totalVolumeWei, uint256 totalParticipants, uint256 activeMarkets, uint256 resolvedMarkets, uint256 cancelledOrExpiredMarkets))",

  // Paginated market list - for displaying market cards
  "function getMarketSummaries(uint256 offset, uint256 limit) view returns (tuple(address market, uint256 marketId, string title, string category, string imageUri, string[] outcomeLabels, int256[] impliedProbabilitiesWad, uint8 stage, uint256 winningOutcome, uint256 marketDeadline, uint256 totalVolumeWei, uint256 participants, int256 bWad)[])",

  // Single market detail - full information about one market
  "function getMarketDetail(address market) view returns (tuple(address market, string title, string description, string category, string imageUri, string proofUri, string[] outcomeLabels, int256[] totalSharesWad, int256[] impliedProbabilitiesWad, uint8 stage, uint256 winningOutcome, uint256 createdAt, uint256 marketDeadline, int256 bWad, uint256 totalVolumeWei, uint256 participants, uint256 resolvedPoolWei, uint256 resolutionDeadline, string cancelReason, string cancelProofUri))",

  // User portfolio - all positions across all markets
  "function getUserPortfolio(address user) view returns (tuple(address market, string title, string category, string[] outcomeLabels, uint256[] sharesPerOutcome, uint256 netDepositedWei, bool canRedeem, bool canRefund, bool hasRedeemed, bool hasRefunded, uint8 stage)[])",
];
```

### PredictionMarket ABI (Per Market)

Use this ABI to interact with a specific market. Replace `MARKET_ADDRESS` with the market's address.

```javascript
export const MARKET_ABI = [
  // === READ FUNCTIONS (View) ===

  // Market Metadata
  "function title() view returns (string)",
  "function description() view returns (string)",
  "function category() view returns (string)",
  "function imageUri() view returns (string)",
  "function proofUri() view returns (string)",
  "function cancelReason() view returns (string)",
  "function cancelProofUri() view returns (string)",
  "function admin() view returns (address)",
  "function createdAt() view returns (uint256)",

  // Market State
  "function stage() view returns (uint8)",
  "function winningOutcome() view returns (uint256)",
  "function marketDeadline() view returns (uint256)",

  // LMSR Pricing
  "function b() view returns (int256)",
  "function outcomeCount() view returns (uint256)",
  "function getShares() view returns (int256[])",
  "function getImpliedProbabilities() view returns (int256[])",

  // Analytics
  "function totalVolumeWei() view returns (uint256)",
  "function totalNetDepositedWei() view returns (uint256)",
  "function participantCount() view returns (uint256)",
  "function resolvedPoolWei() view returns (uint256)",
  "function resolutionDeadline() view returns (uint256)",

  // Constants
  "function PLATFORM_FEE_BPS() view returns (uint256)",
  "function RESOLUTION_GRACE_PERIOD() view returns (uint256)",

  // User Positions
  "function sharesOf(address, uint256) view returns (uint256)",
  "function netDepositedWei(address) view returns (uint256)",
  "function hasRedeemed(address) view returns (bool)",
  "function hasRefunded(address) view returns (bool)",

  // Complex View Functions
  "function getMarketInfo() view returns (string _title, string _description, string _category, string _imageUri, string _proofUri, string[] _outcomeLabels, uint8 _stage, uint256 _winningOutcome, uint256 _createdAt, uint256 _marketDeadline, uint256 _totalVolumeWei, uint256 _participantCount, string _cancelReason, string _cancelProofUri)",
  "function previewBuy(uint256 outcomeIdx, uint256 sharesWad) view returns (uint256 costWei)",
  "function previewSell(uint256 outcomeIdx, uint256 sharesWad) view returns (uint256 proceedsWei)",
  "function getUserInfo(address user) view returns (uint256[] _shares, uint256 _netDeposited, bool _redeemed, bool _refunded, bool _canRedeem, bool _canRefund)",

  // === WRITE FUNCTIONS (User Actions) ===

  // Buy shares of an outcome
  // outcomeIdx: Which outcome to buy (0 = first outcome, 1 = second, etc.)
  // sharesWad: Amount of shares (in wei, 1e18 = 1 full share)
  // maxCostWei: Maximum USDC willing to pay (slippage protection)
  // Note: Must send USDC value equal to maxCostWei
  "function buy(uint256 outcomeIdx, uint256 sharesWad, uint256 maxCostWei) payable",

  // Sell shares back to market
  // outcomeIdx: Which outcome to sell
  // sharesWad: Amount of shares to sell (in wei)
  // minReceiveWei: Minimum USDC expected (slippage protection)
  "function sell(uint256 outcomeIdx, uint256 sharesWad, uint256 minReceiveWei)",

  // Redeem winnings (only for resolved markets)
  // Call when market stage is Resolved and you hold winning outcome shares
  "function redeem()",

  // Get refund (only for cancelled/expired markets)
  // Call when market stage is Cancelled or Expired
  "function refund()",

  // === EVENTS ===
  "event SharesBought(address indexed trader, uint256 indexed outcomeIndex, uint256 sharesWad, uint256 costWei)",
  "event SharesSold(address indexed trader, uint256 indexed outcomeIndex, uint256 sharesWad, uint256 proceedsWei)",
  "event MarketResolved(uint256 winningOutcome, string proofUri)",
  "event MarketCancelled(string reason, string proofUri)",
  "event Redeemed(address indexed user, uint256 amountWei)",
  "event Refunded(address indexed user, uint256 amountWei)",
  "event FeeCollected(address indexed recipient, uint256 amountWei)",
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

Connect to the blockchain:

```javascript
// Ethers.js
import { ethers } from 'ethers';
const provider = new ethers.BrowserProvider(window.ethereum);

// Viem
import { createPublicClient, http } from 'viem';
const client = createPublicClient({
  chain: {
    id: 5042002,
    name: 'ARC Testnet',
    nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
    rpcUrls: { default: { http: ['https://arc-testnet.drpc.org/'] } },
  },
  transport: http()
});
```

### Step 2: Connect to Contracts

```javascript
const FACTORY_ADDRESS = '0xd7b122B12caCB299249f89be7F241a47f762f283';
const LENS_ADDRESS = '0x8241ACa87D4Dee4CA167b1e172Ed955522599e70';

// Using Ethers.js
const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
const lens = new ethers.Contract(LENS_ADDRESS, LENS_ABI, provider);
```

### Step 3: Get Market List

```javascript
// Get total number of markets
const totalMarkets = await factory.totalMarkets();

// Get market addresses (paginated)
const marketAddresses = await factory.getMarkets(0, 10);

// Get market summaries with probabilities
const summaries = await lens.getMarketSummaries(0, 10);
// Returns: [{ market, marketId, title, category, imageUri, outcomeLabels, impliedProbabilitiesWad, stage, winningOutcome, marketDeadline, totalVolumeWei, participants, bWad }, ...]
```

### Step 4: Get Market Details

```javascript
// Full details for a single market
const detail = await lens.getMarketDetail(marketAddress);
// Returns: { market, title, description, category, imageUri, proofUri, outcomeLabels, totalSharesWad, impliedProbabilitiesWad, stage, winningOutcome, createdAt, marketDeadline, bWad, totalVolumeWei, participants, resolvedPoolWei, resolutionDeadline, cancelReason, cancelProofUri }

// Access fields:
// detail.title - Market name
// detail.description - Full description  
// detail.imageUri - Image URL for market
// detail.outcomeLabels - Array of outcome names (e.g., ["Yes", "No"])
// detail.impliedProbabilitiesWad - Array of probabilities (divide by 1e18)
// detail.stage - Current stage (0-4)
// detail.marketDeadline - Unix timestamp when trading ends
// detail.totalVolumeWei - Total trading volume in USDC wei
```

### Step 5: Execute Transactions

**Buying Shares:**

```javascript
// 1. Preview cost first
const market = new ethers.Contract(marketAddress, MARKET_ABI, signer);
const costWei = await market.previewBuy(outcomeIdx, sharesWad);

// 2. Execute buy with slippage protection
// Set maxCostWei = costWei * 1.05 (5% slippage buffer)
const maxCostWei = (costWei * 105n) / 100n;

const tx = await market.buy(outcomeIdx, sharesWad, maxCostWei, {
  value: maxCostWei  // Send USDC equal to maxCostWei
});
await tx.wait();
```

**Selling Shares:**

```javascript
// 1. Preview proceeds first
const proceedsWei = await market.previewSell(outcomeIdx, sharesWad);

// 2. Execute sell with slippage protection
// Set minReceiveWei = proceedsWei * 0.95 (5% slippage buffer)
const minReceiveWei = (proceedsWei * 95n) / 100n;

const tx = await market.sell(outcomeIdx, sharesWad, minReceiveWei);
await tx.wait();
```

**Redeeming Winnings:**

```javascript
// Get user info to check if can redeem
const [, , , , canRedeem] = await market.getUserInfo(userAddress);

if (canRedeem) {
  const tx = await market.redeem();
  await tx.wait();
}
```

**Getting Refund:**

```javascript
// Get user info to check if can refund
const [, , , , , canRefund] = await market.getUserInfo(userAddress);

if (canRefund) {
  const tx = await market.refund();
  await tx.wait();
}
```

---

## Understanding LMSR Pricing

The market uses Logarithmic Market Scoring Rule (LMSR) for dynamic pricing:

- **Price increases** as more people buy the same outcome
- **Price decreases** as people sell
- **Implied probability** reflects the current market sentiment
- Use `previewBuy()` and `previewSell()` to get exact prices before trading

**Key concept**: The `b` parameter (liquidity parameter) controls how prices respond to trading. Higher `b` means slower price movement (more stable probabilities).

---

## Slippage Protection

Always use slippage protection when trading:

- **Buy**: Set `maxCostWei` higher than expected cost (recommend 1-5%)
- **Sell**: Set `minReceiveWei` lower than expected proceeds (recommend 1-5%)

Example:
```javascript
// 5% slippage protection
const SLIPPAGE_PERCENT = 5;
const slippageMultiplier = 100 + SLIPPAGE_PERCENT;
const maxCostWei = (costWei * BigInt(slippageMultiplier)) / 100n;
```

---

## User Position Tracking

To get a user's complete portfolio:

```javascript
const positions = await lens.getUserPortfolio(userAddress);
// Returns: [{ market, title, category, outcomeLabels, sharesPerOutcome, netDepositedWei, canRedeem, canRefund, hasRedeemed, hasRefunded, stage }, ...]

// Each position contains:
// - market: Market contract address
// - title: Market name
// - outcomeLabels: ["Yes", "No", etc.]
// - sharesPerOutcome: Array of share amounts in wei
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
- [ ] Connect to factory (`0xd7b122B12caCB299249f89be7F241a47f762f283`)
- [ ] Connect to lens (`0x8241ACa87D4Dee4CA167b1e172Ed955522599e70`)
- [ ] Fetch market list with pagination
- [ ] Display market cards with images (imageUri)
- [ ] Show implied probabilities (divide WAD by 1e18)
- [ ] Display market deadline with countdown
- [ ] Implement buy with slippage protection
- [ ] Implement sell with slippage protection
- [ ] Show buy/sell only when market is Active (stage 0) and before deadline
- [ ] Display resolved market with winner highlighted
- [ ] Show redeem button when user can redeem (canRedeem = true)
- [ ] Show refund button when user can refund (canRefund = true)
- [ ] Fetch and display user portfolio
- [ ] Handle all error cases gracefully
- [ ] Format amounts correctly (wei / 1e18 for display)
- [ ] Use USDC as currency symbol (not ETH)