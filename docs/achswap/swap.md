---
sidebar_position: 1
---

# Token Swap

The Swap page is your gateway to exchanging tokens on AchSwap. Our smart routing system finds the best rates across V2, V3, V4, and aggregator pools.

## Overview

The swap interface provides:
- **Smart Routing** - Automatically finds the best path across all protocols
- **V2, V3 & V4 Support** - Leverages all pool types
- **Aggregator** - Splits trades across multiple protocols for optimal execution
- **Gasless Swaps** - Sign a transaction, relayer pays the gas
- **Price Protection** - Configurable slippage tolerance
- **Real-time Quotes** - Live price updates

## Supported Pool Types

| Pool | Type | Best For |
|------|------|----------|
| V2 | Classic AMM | Stable pairs, simple swaps |
| V3 | Concentrated liquidity | Volatile pairs, capital efficiency |
| V4 | Hook-enabled singleton | Custom logic, new pool types |
| Aggregator | Split across all | Best rate, large trades |

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
   - Route visualization (which protocol/split was selected)

4. **Execute Swap**
   - Click Swap
   - Approve in your wallet
   - Wait for confirmation

### Gasless Swap Flow

1. Click the **Zap** icon to enable gasless mode
2. If Permit2 is not approved, click **Enable Permit2 for Gasless** (one-time per token)
3. Enter swap details
4. Sign the permit message in your wallet
5. The relayer submits the transaction and pays the gas
6. Swap confirmed

See [Gasless Swap](/achswap/gasless-swap) for full details.

### Aggregator Routing

The aggregator automatically splits your trade across multiple protocols to minimize price impact:

1. Probes each adapter (V2, V3, V4) for the full amount
2. Tests split ratios (coarse 10% increments, then fine 1% increments)
3. Selects the split with highest net output
4. Applies a 0.1% fee on gross output

See [Smart Routing](/achswap/smart-routing) for full details.

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
| V2 | Enable/disable V2 pools | On |
| V3 | Enable/disable V3 pools | On |
| V4 | Enable/disable V4 pools | On |
| Aggregator | Enable/disable aggregator | On |
| Aggregator V2 | Use V2 adapter in aggregator splits | On |
| Aggregator V3 | Use V3 adapter in aggregator splits | On |
| Aggregator V4 | Use V4 adapter in aggregator splits | On |

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
USDC → wUSDC → ACHS (V3, 0.3%)
```

Or for aggregator splits:

```
60% via V3 (0.3%) + 40% via V4 (0.30%)
```

This shows the path your tokens take and which protocol was selected.

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

### RWA Swaps

The swap interface also supports RWA (Real World Asset) token swaps through a dedicated RWA tab. See the [AchRWA documentation](/achrwa/overview) for details.

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

### "No route found"
- Enable more protocols in settings
- For V4, ensure the pool is registered on-chain

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
