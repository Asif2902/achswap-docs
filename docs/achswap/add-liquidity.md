---
sidebar_position: 2
---

# Add Liquidity

Add liquidity to earn a share of trading fees. AchSwap supports V2 classic pools, V3 concentrated liquidity, and V4 hook-enabled singleton pools.

## Understanding Liquidity Providing

When you add liquidity to a pool:
1. You deposit two tokens (e.g., USDC and ACHS)
2. You receive LP tokens (V2), an NFT position (V3), or LP tokens (V4)
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

### Fee Tiers

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

## V4 Liquidity (Hook-Enabled Singleton Pools)

V4 pools use a singleton architecture — all V4 pools exist within a single Pool Manager contract. V4 pools support **hooks**, which are smart contracts that can execute custom logic at various points during swaps or liquidity operations.

### Key Concepts

| Term | Definition |
|------|------------|
| Pool Manager | Singleton contract holding all V4 pools |
| Pool Key | Unique identifier (currency0, currency1, fee, tickSpacing, hooks) |
| Hook Contract | Optional contract with custom logic (before/after swap, before/after modify position) |
| Fee Tier | Trading fee percentage (configurable at pool creation) |
| LP Token | ERC-20 token representing your share |

### Why V4?

- **Lower gas** — No separate contract per pool
- **Hook logic** — Custom price calculations, dynamic fees, oracle integration
- **Flexible fees** — Any fee tier, not just the 5 fixed V3 tiers
- **Composable** — Hooks can interact with other protocols

### Fee Tiers

| Fee | Tick Spacing | Best For |
|-----|--------------|----------|
| 0.05% | 10 | Stablecoin pairs |
| 0.30% | 60 | Standard pairs |
| 1.00% | 200 | Volatile pairs |

### Adding V4 Liquidity

1. Navigate to **Add Liquidity**
2. Select the **V4** tab
3. Choose your token pair
4. Select a fee tier (0.05%, 0.30%, or 1.00%)
5. Enter amounts for both tokens
6. For existing pools: amounts auto-match the current ratio
7. For new pools: enter amounts to set the initial price
8. Click **Initialize Pool** (for new pools) then **Add Liquidity`

### Pool Initialization

When you create a new V4 pool:
1. Set the initial price by entering both token amounts
2. The pool is initialized on-chain with your chosen fee tier
3. You can then add liquidity

Existing pools show their current ratio and auto-match your deposit.

### Hook Permissions

Hook addresses encode permissions in their low 14 bits. The Pool Manager validates these permissions before allowing hook calls. Common hook permissions include:

- **beforeSwap / afterSwap** — Execute logic around swaps
- **beforeModifyPosition / afterModifyPosition** — Execute logic around liquidity changes

The AchSwap UI handles hook permission encoding automatically. You don't need to set these manually.

### Claiming V4 Fees

V4 fees are auto-collected when you remove liquidity, similar to V2.

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

### V4 Returns

V4 returns are similar to V3 concentrated liquidity but depend on the hook contract's behavior. Some hooks may:
- Automatically rebalance positions
- Collect additional rewards
- Adjust fees dynamically

## Risks

### Impermanent Loss

When you provide liquidity:
- If token prices change significantly
- You may lose value vs. just holding
- This is "impermanent" until you withdraw

### V3 Specific Risks

- **Out of Range** - No fees earned if price moves outside your range
- **Full Range** - Lower returns but no range risk

### V4 Specific Risks

- **Hook Risk** - Custom hook logic may have unexpected behavior
- **Always review** the hook contract before adding liquidity to a V4 pool with a non-zero hook address

## Removing Liquidity

See [Remove Liquidity](/achswap/remove-liquidity) for withdrawal instructions.

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
