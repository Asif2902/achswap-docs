---
sidebar_position: 6
---

# V2 vs V3 Pools

Understanding the differences between V2 and V3 liquidity pools on AchSwap.

## Overview

AchSwap supports two AMM models:

| Feature | V2 | V3 |
|---------|----|----|
| Liquidity Type | Full Range | Concentrated |
| Fee Tiers | Single (0.3%) | Multiple (0.01% - 10%) |
| Position Format | LP Tokens | NFT Position |
| Capital Efficiency | 1x | Up to 100x |
| Complexity | Simple | Advanced |

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

## Migration Between Versions

### From V2 to V3

You can migrate V2 positions to V3:
1. Go to Add Liquidity → V2 tab
2. See your existing positions
3. Click Migrate
4. Set V3 parameters
5. Confirm

Migration is one-click but you set your V3 parameters.

### Maintaining Both

You can have positions in both:
- V2 for stability
- V3 for returns
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

## Recommendation

| User Type | Recommendation |
|-----------|---------------|
| Beginner | Start with V2 |
| Passive | V2 is fine |
| Intermediate | Try V3 with wide range |
| Advanced | V3 with active management |

## Conclusion

Both V2 and V3 have their place:
- **V2**: Simple, stable, low maintenance
- **V3**: Complex, higher returns, active management

Start with V2 to learn, then graduate to V3.

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
