---
sidebar_position: 4
---

# Pool Discovery

The Pools page displays all available liquidity pools on AchSwap, showing TVL and other statistics.

## Overview

The Pools page provides:
- **Pool Listings** - All V2, V3, V4, and RWA pools
- **TVL Display** - Total Value Locked per pool
- **Search & Filter** - Find specific pools
- **Statistics** - Platform-wide metrics

## Interface Guide

### Pool List

Each pool shows:

```
┌─────────────────────────────────────────────────────────────┐
│ [Token A] / [Token B]                    Fee: 0.3%        │
│ TVL: $125,000                         V2 / V3 / V4        │
└─────────────────────────────────────────────────────────────┘
```

### Statistics Bar

At the top of the page:

| Metric | Description |
|--------|-------------|
| Total Pools | Number of active pools |
| Total TVL | Combined value locked |
| V2 Pools | Number of V2 pools |
| V3 Pools | Number of V3 pools |
| V4 Pools | Number of V4 pools |
| RWA Pools | Number of RWA pools |
| RWA TVL | Total value locked in RWA pools |
| RWA Volume | Trading volume in RWA pools |

### Filtering

Filter pools by:
- **All** - Show all pools
- **V2 Only** - Classic AMM pools
- **V3 Only** - Concentrated liquidity pools
- **V4 Only** - Hook-enabled singleton pools
- **RWA Only** - Real World Asset pools
- **Search** - By token name or symbol

## Pool Types

### V2 Pools

Classic constant-product AMM pools. Single fee tier (0.3%). Best for stable pairs and simple swaps.

### V3 Pools

Concentrated liquidity pools with multiple fee tiers (0.01%-10%). Best for volatile pairs and capital-efficient LPing.

### V4 Pools

Hook-enabled singleton pools. All V4 pools exist within a single Pool Manager contract. Support custom hook logic and configurable fee tiers. See [V4 Pools](/achswap/v4-pools) for details.

### RWA Pools

Real World Asset pools for tokenized traditional assets. Uses oracle-based pricing. See the [AchRWA documentation](/achrwa/overview) for details.

## Understanding TVL

### What is TVL?

TVL (Total Value Locked) represents:
- Total tokens deposited in the pool
- Measured in USDC equivalent
- Changes with token prices and deposits/withdrawals

### Why TVL Matters

| TVL Level | Implication |
|-----------|-------------|
| < $1,000 | Low liquidity, high slippage |
| $1,000 - $10,000 | Developing pool |
| $10,000 - $100,000 | Healthy pool |
| > $100,000 | Deep liquidity, low slippage |

### TVL and Swaps

Higher TVL means:
- Better prices for traders
- Lower price impact
- More stable trading

## Pool Details

Click on a pool to see:

### V2 Pools
- Token pair info
- Your liquidity position
- Fees earned
- Historical chart

### V3 Positions
- Position details
- Current range
- Fee tier
- Fees collected
- APR estimate

### V4 Pools
- Pool key (currency pair, fee, tick spacing, hooks)
- Your LP balance
- Fees earned
- Hook contract address (if any)

### RWA Pools
- Oracle address
- Vault contract
- Asset pricing
- Your position

## Adding Liquidity from Pool View

Quick-add liquidity:
1. Find the pool
2. Click **Add Liquidity**
3. Pre-filled with selected pool

## Searching Pools

Use the search bar to find:
- Token symbols (e.g., "USDC", "ACHS")
- Token names
- Partial matches supported

## Refresh & Cache

Pool data is cached for performance:
- Auto-refreshes every 10 minutes
- Manual refresh available
- Last update timestamp shown

V4 pools are discovered on-chain and cached in localStorage. No subgraph index required.

## Troubleshooting

### Pool not showing
- Pool may be new (wait for indexing)
- Check if token is imported
- For V4: pool may not be initialized yet

### TVL seems wrong
- Token price may have changed
- Check block explorer for accurate data

### Can't add liquidity
- Ensure you have both tokens
- Check token approvals

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
