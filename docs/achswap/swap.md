---
sidebar_position: 1
---

# Token Swap

The Swap page is your gateway to exchanging tokens on AchSwap v3. Our smart routing system finds the best rates across both V2 and V3 liquidity pools.

## Overview

The swap interface provides:
- **Smart Routing** - Automatically finds the best path
- **V2 & V3 Support** - Leverages both pool types
- **Price Protection** - Configurable slippage tolerance
- **Real-time Quotes** - Live price updates

## How It Works

### Basic Swap Flow

1. **Select Tokens**
   - Choose the token you're selling ("From")
   - Choose the token you want to receive ("To")

2. **Enter Amount**
   - Type the amount or use the max button
   - The other amount updates automatically

3. **Review Trade**
   - Exchange rate
   - Price impact
   - Minimum received (after slippage)
   - Route visualization

4. **Execute Swap**
   - Click Swap
   - Approve in your wallet
   - Wait for confirmation

## Interface Guide

### Token Selection

```
┌────────────────────────────────────────────────────────┐
│  From                     [USDC ▼]                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 0.00                                             │  │
│  └──────────────────────────────────────────────────┘  │
│                    ⇅ (swap button)                     │
│  To                       [ACHS ▼]                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 0.00                                             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Rate: 1 USDC = 2.50 ACHS                              │
│  Price Impact: 0.05%                                   │
│  Min Received: 2.48 ACHS                                │
│                                                        │
│  [Swap]                                                │
└────────────────────────────────────────────────────────┘
```

### Settings

Click the gear icon to access swap settings:

| Setting | Description | Default |
|---------|-------------|---------|
| Slippage Tolerance | Maximum price change accepted | 0.5% |
| Transaction Deadline | Time before trade expires | 20 min |
| Recipient | Address receiving tokens | Your wallet |

### Slippage Tolerance

The slippage tolerance protects you from price changes during transaction confirmation:

- **0.5%** - Conservative, for stable pairs
- **1%** - Default, balanced
- **5%** - Aggressive, for volatile pairs

If price moves beyond your slippage tolerance, the transaction will revert.

### Price Impact

Price impact shows how your trade affects the pool price:

- **< 0.1%** - Minimal impact, large pools
- **0.1% - 1%** - Low impact, moderate trades
- **1% - 5%** - Moderate impact, large trades
- **> 5%** - High impact, very large trades

A yellow warning appears when price impact exceeds 15%.

## Route Visualization

The swap interface shows your trade route:

```
USDC → wUSDC → ACHS
```

This shows the path your tokens take. Multi-hop routes may provide better rates when direct pools are small.

## Supported Tokens

### Native Tokens

| Token | Symbol | Address |
|-------|--------|---------|
| USDC | USDC | 0x0000...0000 (native) |
| Wrapped USDC | wUSDC | 0xDe5DB9049a8dd344d... |

### Project Tokens

| Token | Symbol | Address |
|-------|--------|---------|
| Achswap Token | ACHS | 0x45Bb5425f293bdd2... |

## Advanced Features

### Wrap/Unwrap

Since USDC is native on ARC Testnet:
- **Wrapping** converts native USDC to wUSDC
- **Unwrapping** converts wUSDC back to native USDC
- The interface handles this automatically

### Transaction History

Recent swaps are stored locally:
- View in the "Recent" section
- Click to see transaction details
- Clear history option available

## Troubleshooting

### "Insufficient liquidity"
- Try a smaller amount
- The token pair may not have a pool

### "Price impact too high"
- Reduce trade size
- Increase slippage tolerance (caution!)

### Transaction reverted
- Price moved beyond slippage tolerance
- Increase slippage or try again later

---

## Related Links

- [Open AchSwap →](https://app.achswapfi.xyz)
