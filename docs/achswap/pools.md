---
sidebar_position: 4
---

# Pool Discovery

The Pools page displays all available liquidity pools on AchSwap, showing TVL and other statistics.

## Overview

The Pools page provides:
- **Pool Listings** - All V2 and V3 pools
- **TVL Display** - Total Value Locked per pool
- **Search & Filter** - Find specific pools
- **Statistics** - Platform-wide metrics

## Interface Guide

### Pool List

Each pool shows:

```
┌─────────────────────────────────────────────────────────────┐
│ [Token A] / [Token B]                    Fee: 0.3%        │
│ TVL: $125,000                         V2 / V3             │
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

### Filtering

Filter pools by:
- **V2 Only** - Classic AMM pools
- **V3 Only** - Concentrated liquidity pools
- **Search** - By token name or symbol

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

## Troubleshooting

### Pool not showing
- Pool may be new (wait for indexing)
- Check if token is imported

### TVL seems wrong
- Token price may have changed
- Check block explorer for accurate data

### Can't add liquidity
- Ensure you have both tokens
- Check token approvals

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
