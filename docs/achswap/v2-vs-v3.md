---
sidebar_position: 5
---

# V2 vs V3 vs V4 Pools

Understanding the differences between V2, V3, and V4 liquidity pools on AchSwap.

## Overview

AchSwap supports three AMM models:

| Feature | V2 | V3 | V4 |
|---------|----|----|-----|
| Liquidity Type | Full Range | Concentrated | Concentrated + Hooks |
| Fee Tiers | Single (0.3%) | Multiple (0.01%-10%) | Configurable per pool |
| Position Format | LP Tokens | NFT Position | LP Tokens (ERC-20) |
| Capital Efficiency | 1x | Up to 100x | Up to 100x + hooks |
| Contract Model | Separate per pair | Separate per pair | Singleton (all pools in one) |
| Hooks | No | No | Yes |
| Complexity | Simple | Advanced | Advanced |

## V2 Pools (Classic AMM)

### How V2 Works

V2 uses the classic xy=k formula:
- Liquidity distributed evenly across all prices
- Any price can be traded
- Simpler to understand and manage

### Advantages

1. **Simplicity** - No need to manage price ranges
2. **No Range Risk** - Always earning fees
3. **Easy Tracking** - Single LP token position

### Disadvantages

1. **Lower Returns** - Capital spread thin
2. **Lower Capital Efficiency** - Same fees on less capital

## V3 Pools (Concentrated Liquidity)

### How V3 Works

V3 allows concentrating liquidity:
- Choose a specific price range
- Earn more fees when price is in range
- More complex but higher returns

### Advantages

1. **Higher Returns** - Concentrated fees
2. **Capital Efficiency** - Same returns on less capital
3. **Custom Strategies** - Multiple positions possible

### Disadvantages

1. **Range Risk** - No fees if price moves out
2. **Complexity** - Requires active management
3. **More Transactions** - May need to adjust range

## V4 Pools (Hook-Enabled Singleton)

### How V4 Works

V4 uses a singleton Pool Manager — all V4 pools exist in one contract:
- Custom hook contracts can execute logic before/after swaps
- Configurable fee tiers (not limited to 5 fixed tiers)
- Lower gas (no separate contract deployment per pool)

### Advantages

1. **Hook Logic** - Custom price calculations, dynamic fees, oracle integration
2. **Lower Gas** - Singleton architecture
3. **Flexible Fees** - Any fee tier at pool creation
4. **Composable** - Hooks can interact with other protocols

### Disadvantages

1. **Hook Risk** - Custom hook logic may have unexpected behavior
2. **Complexity** - Understanding hook permissions
3. **Newer** - Less battle-tested than V2/V3

## When to Use V2

### Best For

- New liquidity providers
- Long-term passive LPing
- Token pairs with low volatility
- When you don't want to manage positions

### Example

You want to LP USDC/ACHS for 6 months:
- Use V2
- Deposit and forget
- Earn 0.3% on all trades

## When to Use V3

### Best For

- Experienced LPing
- High-volume trading pairs
- Active position management
- Maximizing returns

### Example

You're an active trader:
- Add 50x concentrated position
- Monitor price daily
- Adjust range as needed

## When to Use V4

### Best For

- Custom hook logic needs (dynamic fees, oracles, auto-rebalancing)
- Lower gas costs for pool creation
- Flexible fee tier requirements
- Building on top of existing hook contracts

### Example

You want a pool with dynamic fees:
- Choose a V4 pool with a fee-adjustment hook
- Fees adapt to volatility automatically
- No need to manually adjust positions

## Migration Between Versions

### From V2 to V3

You can migrate V2 positions to V3:
1. Go to Add Liquidity → V2 tab
2. See your existing positions
3. Click Migrate
4. Set V3 parameters
5. Confirm

Migration is one-click but you set your V3 parameters.

### Maintaining Multiple Positions

You can have positions in all three:
- V2 for stability
- V3 for concentrated returns
- V4 for hook-enabled features
- Diversify your LP strategy

## Returns Comparison

### V2 Example

```
Deposit: $1,000 USDC + 2,500 ACHS
Annual Volume: $100,000
Your Share: 1%
Annual Fees: $300 (0.3% × $100,000)
APY: 30%
```

### V3 Example

Same deposit, 10x concentrated:

```
Deposit: $1,000 USDC + 2,500 ACHS
Annual Volume: $100,000
Your Share: 1% (within range)
Concentration: 10x
Effective Annual Volume: $1,000,000
Annual Fees: $3,000
APY: 300%
```

*Note: Actual returns depend on price staying in range*

### V4 Example

Same deposit, V4 with auto-rebalancing hook:

```
Deposit: $1,000 USDC + 2,500 ACHS
Annual Volume: $100,000
Your Share: 1% (within range)
Concentration: 10x (auto-maintained by hook)
Annual Fees: $3,000
APY: 300%
```

*Note: Hook behavior varies — always review the hook contract*

## Recommendation

| User Type | Recommendation |
|-----------|---------------|
| Beginner | Start with V2 |
| Passive | V2 is fine |
| Intermediate | Try V3 with wide range |
| Advanced | V3 with active management |
| Hook builder | V4 for custom logic |

## Conclusion

All three versions have their place:
- **V2**: Simple, stable, low maintenance
- **V3**: Complex, higher returns, active management
- **V4**: Hook-enabled, flexible fees, composable

Start with V2 to learn, then graduate to V3 or V4 as you gain experience.

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
