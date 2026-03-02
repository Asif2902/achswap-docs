---
sidebar_position: 2
---

# Add Liquidity

Add liquidity to earn a share of trading fees. AchSwap supports both V2 classic pools and V3 concentrated liquidity.

## Understanding Liquidity Providing

When you add liquidity to a pool:
1. You deposit two tokens (e.g., USDC and ACHS)
2. You receive LP tokens (V2) or an NFT position (V3)
3. Traders pay fees when swapping through the pool
4. You earn a pro-rata share of those fees

## V2 Liquidity (Classic)

V2 provides liquidity across the entire price range - like a traditional AMM.

### Adding V2 Liquidity

1. Navigate to **Add Liquidity**
2. Select **V2** mode
3. Choose your token pair (e.g., USDC/ACHS)
4. Enter amounts for both tokens

### Understanding Ratios

The interface shows:
- **Current Ratio** - Tokens in the pool
- **Your Deposit** - What you're adding
- **Pool Share** - Your % of total liquidity

### Example

```
Pool Status:
- USDC: 100,000
- ACHS: 250,000
- Total LP Tokens: 10,000

Your Deposit:
- USDC: 1,000
- ACHS: 2,500

Your Share: 1% (100 / 10,000)
```

### Claiming Fees

V2 fees are auto-collected when you remove liquidity. There's no separate claim step.

## V3 Liquidity (Concentrated)

V3 allows you to concentrate your liquidity within a specific price range, earning more fees on the same capital.

### Key Concepts

| Term | Definition |
|------|------------|
| Tick | Price granularity in V3 |
| Fee Tier | Trading fee percentage (0.01% - 10%) |
| Position | Your liquidity commitment |
| Range | Price min and max for your position |

### Fee a Tiers

Choose fee tier based on your strategy:

| Tier | Best For |
|------|----------|
| 0.01% | Stablecoin pairs |
| 0.05% | Similar assets |
| 0.30% | Standard pairs (USDC/ACHS) |
| 1.00% | Exotic pairs |
| 10.00% | Very volatile pairs |

### Adding V3 Liquidity

#### Basic Mode (Recommended)

1. Select **V3** mode
2. Choose your token pair
3. Select a fee tier (0.30% for USDC/ACHS)
4. Enter deposit amounts
5. Choose a price range:
   - **Full Range** - Across all prices
   - **Custom Range** - Specific price bounds
6. Review the APR estimate
7. Click **Add Liquidity**

#### Advanced Mode

For experienced users:
- Set exact tick boundaries
- Fine-tune price range
- Monitor pool health

### Price Range Selection

Choosing the right range is crucial:

- **Narrow Range** - More fees if price stays in range, but risk of no trading
- **Wide Range** - More stable, less fees per swap
- **Full Range** - Like V2, no concentration risk

### Pool Health

The V3 interface shows pool health:
- **Green** - Good range selection
- **Yellow** - Consider widening range
- **Red** - Out of range, no fees earned

## Migrating from V2 to V3

If you have V2 LP positions:

1. Go to **Add Liquidity**
2. Select **V2** tab
3. See your existing positions
4. Click **Migrate** to move to V3
5. Set your V3 parameters
6. Confirm migration

## Expected Returns

### V2 Returns

V2 returns depend on:
- Your share of total liquidity
- Trading volume in the pool
- Fee tier (fixed at 0.3%)

APY calculation:
```
APY = (Your Share × Annual Volume × 0.3%) / Your Liquidity
```

### V3 Returns

V3 returns can be higher due to concentration:

- **1x concentration** = Similar to V2
- **10x concentration** = ~10x fees (if price stays in range)
- **100x concentration** = ~100x fees (if price stays in range)

The interface shows estimated APR based on recent volume.

## Risks

### Impermanent Loss

When you provide liquidity:
- If token prices change significantly
- You may lose value vs. just holding
- This is "impermanent" until you withdraw

### V3 Specific Risks

- **Out of Range** - No fees earned if price moves outside your range
- **Full Range** - Lower returns but no range risk

## Removing Liquidity

See [Remove Liquidity](/achswap/remove-liquidity) for withdrawal instructions.
