---
sidebar_position: 8
---

# Integration Guide

This guide provides everything you need to integrate with the AchMarket prediction market system. It covers the contract architecture, data retrieval, and user-facing functions.

---

## System Overview

AchMarket uses a three-contract architecture:

| Contract | Purpose |
|----------|---------|
| **PredictionMarketFactory** | Creates and registers new markets |
| **PredictionMarket** | Individual market with LMSR pricing, trading, and redemption |
| **PredictionMarketLens** | Read-only analytics and data aggregation |

### Market Lifecycle

1. **Active** - Trading is open, users can buy/sell shares
2. **Suspended** - Trading paused (admin-controlled)
3. **Resolved** - Market decided, winners can redeem
4. **Cancelled** - Admin cancelled, users can refund
5. **Expired** - Grace period passed without resolution, users can refund

---

## Contract Addresses

> **Note:** Replace `FACTORY_ADDRESS` with the actual deployed factory address on your target network.

```solidity
PredictionMarketFactory factory = PredictionMarketFactory(FACTORY_ADDRESS);
PredictionMarketLens lens = PredictionMarketLens(LENS_ADDRESS);
```

---

## Getting Market Data

### 1. List All Markets

```solidity
// Get total market count
uint256 totalMarkets = factory.totalMarkets();

// Get market addresses (paginated)
address[] memory markets = factory.getMarkets(offset, limit);
```

### 2. Get Market Summaries

```solidity
MarketSummary[] memory summaries = lens.getMarketSummaries(offset, limit);

// MarketSummary contains:
// - market: address
// - marketId: uint256
// - title: string
// - category: string
// - imageUri: string
// - outcomeLabels: string[]
// - impliedProbabilitiesWad: int256[] (0 to 1e18)
// - stage: Stage (0=Active, 1=Suspended, 2=Resolved, 3=Cancelled, 4=Expired)
// - winningOutcome: uint256
// - marketDeadline: uint256 (timestamp)
// - totalVolumeWei: uint256
// - participants: uint256
// - bWad: int256 (LMSR liquidity parameter)
```

### 3. Get Full Market Details

```solidity
MarketDetail memory detail = lens.getMarketDetail(marketAddress);

// MarketDetail contains all MarketSummary fields plus:
// - description: string
// - proofUri: string (resolution proof)
// - totalSharesWad: int256[]
// - resolvedPoolWei: uint256
// - resolutionDeadline: uint256
// - cancelReason: string
// - cancelProofUri: string
```

### 4. Get Implied Probabilities

```solidity
int256[] memory probs = market.getImpliedProbabilities();

// Returns probability for each outcome as WAD (1e18 = 100%)
// Sums to approximately 1e18
```

### 5. Get User Positions

```solidity
UserPosition[] memory positions = lens.getUserPortfolio(userAddress);

// UserPosition contains:
// - market: address
// - title: string
// - category: string
// - outcomeLabels: string[]
// - sharesPerOutcome: uint256[] (WAD)
// - netDepositedWei: uint256
// - canRedeem: bool
// - canRefund: bool
// - hasRedeemed: bool
// - hasRefunded: bool
// - stage: Stage
```

### 6. Get Individual User Info

```solidity
(
    uint256[] memory shares,
    uint256 netDeposited,
    bool redeemed,
    bool refunded,
    bool canRedeem,
    bool canRefund
) = market.getUserInfo(userAddress);
```

---

## User Trading Functions

### Buy Shares

```solidity
function buy(
    uint256 outcomeIdx,    // Index of the outcome (0, 1, 2, ...)
    uint256 sharesWad,     // Amount of shares in WAD (1e18 = 1 share)
    uint256 maxCostWei    // Maximum acceptable cost (slippage protection)
) external payable;
```

**Parameters:**
- `outcomeIdx`: Index of the outcome to buy (0-based, matches outcomeLabels array)
- `sharesWad`: Amount of shares in wei-adjusted format (1e18 = 1 full share)
- `maxCostWei`: Maximum ETH willing to pay (prevents slippage)

**Example:**
```solidity
// Buy 10 shares of outcome 0, accepting up to 0.1 ETH
market.buy{value: 0.1 ether}(0, 10e18, 0.1 ether);
```

**Return:** Any excess ETH is refunded to the caller.

### Sell Shares

```solidity
function sell(
    uint256 outcomeIdx,     // Index of the outcome to sell
    uint256 sharesWad,      // Amount of shares to sell in WAD
    uint256 minReceiveWei  // Minimum acceptable proceeds (slippage protection)
) external;
```

**Parameters:**
- `outcomeIdx`: Index of the outcome to sell
- `sharesWad`: Amount of shares to sell in WAD
- `minReceiveWei`: Minimum ETH acceptable (prevents slippage)

**Example:**
```solidity
// Sell 5 shares of outcome 0, accepting at least 0.05 ETH
market.sell(0, 5e18, 0.05 ether);
```

**Return:** ETH proceeds are sent to the caller.

### Preview Buy Cost

```solidity
uint256 cost = market.previewBuy(outcomeIdx, sharesWad);
// Returns cost in wei
```

### Preview Sell Proceeds

```solidity
uint256 proceeds = market.previewSell(outcomeIdx, sharesWad);
// Returns proceeds in wei
```

---

## Redemption & Refunds

### Redeem Winnings (Resolved Markets)

When a market is resolved, winners can redeem their shares for ETH.

```solidity
function redeem() external;
```

**Requirements:**
- Market stage must be `Resolved`
- User must hold shares in the winning outcome
- User must not have already redeemed

**Example:**
```solidity
// After market resolves with outcome index 0 as winner
if (market.canRedeem(user)) {
    market.redeem();
}
```

### Get Redemption Status

```solidity
(
    ,
    ,
    bool hasRedeemed,
    bool hasRefunded,
    bool canRedeem,
    bool canRefund
) = market.getUserInfo(userAddress);
```

### Refund (Cancelled/Expired Markets)

When a market is cancelled or expires, users get pro-rata refunds.

```solidity
function refund() external;
```

**Requirements:**
- Market stage must be `Cancelled` or `Expired`
- User must have net deposits
- User must not have already refunded

**Example:**
```solidity
// Check if user can refund
 (, , , , , bool canRefund) = market.getUserInfo(userAddress);
 if (canRefund) {
     market.refund();
 }
```

---

## Key Data Types

### Stage Enum

```solidity
enum Stage {
    Active,     // 0 - Trading open
    Suspended,  // 1 - Trading paused
    Resolved,   // 2 - Winners can redeem
    Cancelled,  // 3 - Full refund available
    Expired     // 4 - Full refund available
}
```

### Probability Format

All probabilities are returned as WAD (fixed-point 18 decimals):
- `1e18` = 100%
- `5e17` = 50%
- `1e17` = 10%

---

## Smart Contract Integration Example

### Basic Integration Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PredictionMarket} from "./PredictionMarket.sol";
import {PredictionMarketFactory} from "./PredictionMarketFactory.sol";
import {PredictionMarketLens} from "./PredictionMarketLens.sol";

contract MarketIntegrator {
    PredictionMarketFactory public factory;
    PredictionMarketLens public lens;

    constructor(address _factory, address _lens) {
        factory = PredictionMarketFactory(_factory);
        lens = PredictionMarketLens(_lens);
    }

    struct MarketInfo {
        address marketAddress;
        string title;
        string description;
        string category;
        string[] outcomes;
        uint256 deadline;
        uint256 stage;
        uint256 volume;
        int256[] probabilities;
    }

    function getMarketInfo(address market) external view returns (MarketInfo memory info) {
        PredictionMarketLens.MarketDetail memory detail = lens.getMarketDetail(market);
        
        info.marketAddress = market;
        info.title = detail.title;
        info.description = detail.description;
        info.category = detail.category;
        info.outcomes = detail.outcomeLabels;
        info.deadline = detail.marketDeadline;
        info.stage = uint256(detail.stage);
        info.volume = detail.totalVolumeWei;
        info.probabilities = detail.impliedProbabilitiesWad;
    }

    function getUserPositions(address user) external view returns (
        address[] memory markets,
        uint256[][] memory allShares,
        uint256[] memory netDeposited
    ) {
        PredictionMarketLens.UserPosition[] memory positions = lens.getUserPortfolio(user);
        
        markets = new address[](positions.length);
        allShares = new uint256[][](positions.length);
        netDeposited = new uint256[](positions.length);
        
        for (uint i = 0; i < positions.length; i++) {
            markets[i] = positions[i].market;
            allShares[i] = positions[i].sharesPerOutcome;
            netDeposited[i] = positions[i].netDepositedWei;
        }
    }

    function buyOutcome(address market, uint256 outcomeIdx, uint256 shares, uint256 maxCost) external payable {
        PredictionMarket(market).buy{value: msg.value}(outcomeIdx, shares, maxCost);
    }

    function sellOutcome(address market, uint256 outcomeIdx, uint256 shares, uint256 minReceive) external {
        PredictionMarket(market).sell(outcomeIdx, shares, minReceive);
    }

    function redeemWinnings(address market) external {
        PredictionMarket(market).redeem();
    }

    function getRefund(address market) external {
        PredictionMarket(market).refund();
    }
}
```

### What Data Should Your Smart Contract Forward?

When integrating with AchMarket, your smart contract should forward:

1. **Market Address** - The specific PredictionMarket contract
2. **User Address** - The wallet interacting (typically `msg.sender`)
3. **Outcome Index** - Which outcome they're trading (0, 1, 2...)
4. **Amount** - Share quantity in WAD
5. **Value** - ETH value for purchases

---

## Error Codes

| Error | Description |
|-------|-------------|
| `PM: not admin` | Function restricted to admin |
| `PM: market not active` | Market not in Active stage |
| `PM: trading period ended` | Past market deadline |
| `PM: invalid outcome` | Outcome index out of bounds |
| `PM: zero shares` | Zero amount specified |
| `PM: slippage exceeded` | Price moved beyond maxCostWei/minReceiveWei |
| `PM: insufficient ETH` | Not enough ETH sent |
| `PM: insufficient shares` | Not enough shares to sell |
| `PM: not resolved` | Market not in Resolved stage |
| `PM: already redeemed` | Already claimed winnings |
| `PM: refunds not open` | Market not Cancelled/Expired |
| `PM: already refunded` | Already claimed refund |
| `PM: nothing to refund` | No deposits to refund |

---

## Events to Monitor

```solidity
// Trading
event SharesBought(address indexed trader, uint256 indexed outcomeIndex, uint256 sharesWad, uint256 costWei);
event SharesSold(address indexed trader, uint256 indexed outcomeIndex, uint256 sharesWad, uint256 proceedsWei);

// Resolution
event MarketResolved(uint256 winningOutcome, string proofUri);
event MarketCancelled(string reason, string proofUri);

// Claims
event Redeemed(address indexed user, uint256 amountWei);
event Refunded(address indexed user, uint256 amountWei);
```

---

## Gas Considerations

- **Buying**: Moderate gas (state updates + fee calculation)
- **Selling**: Higher gas (requires liquidity check)
- **Redeem**: Low gas (single transfer)
- **Refund**: Low gas (single transfer)
- **View calls**: Free (no gas)

---

## Testing Checklist

- [ ] Fetch and display market list
- [ ] Show market details with probabilities
- [ ] Implement buy with slippage protection
- [ ] Implement sell with slippage protection
- [ ] Handle resolution and show redeem button
- [ ] Handle cancellation/show refund button
- [ ] Show user portfolio with all positions
- [ ] Handle stage transitions correctly
- [ ] Format WAD numbers properly (divide by 1e18)
- [ ] Handle ETHwei (18 decimals)