---
sidebar_position: 7
---

# Concentrated Liquidity

A deep dive into V3 concentrated liquidity mechanics and strategies.

## Concept Overview

Concentrated liquidity allows you to provide liquidity within a specific price range, rather than from 0 to infinity.

### Traditional AMM (V2)

```
Price: 0 ──────────────────────────────────────────────── ∞
Liquidity: |═══════════════════════════════════════════|
           All liquidity across all prices
```

### Concentrated Liquidity (V3)

```
Price: 0 ──────────●──────────────────────●────────────── ∞
Liquidity:        ╔═══════════════════╗
                  Only this range earns fees
```

## Key Terms

### Ticks

Ticks are discrete price points in V3:
- Each tick represents a specific price
- Spacing depends on fee tier
- Provide granularity for range orders

### Fee Tiers

| Tier | Tick Spacing | Use Case |
|------|--------------|----------|
| 0.01% | 1 | Stablecoins |
| 0.05% | 10 | Similar assets |
| 0.30% | 60 | Standard pairs |
| 1.00% | 200 | Exotic pairs |
| 10.00% | 2000 | Volatile pairs |

### Position

A position is your liquidity commitment:
- Has a token pair
- Has a fee tier
- Has a price range
- Tracks accrued fees

## Creating a Position

### Basic Mode

1. Select V3 mode
2. Choose token pair
3. Choose fee tier
4. Enter amounts
5. Select price range
6. Review APR
7. Add liquidity

### Price Range Selection

#### Full Range
- Entire price spectrum
- Like V2
- Lower returns but always in range

#### Custom Range

Determine your range:

```
Lower Bound = Current Price × (1 - Range%)
Upper Bound = Current Price × (1 + Range%)
```

Examples at $1.00:

| Range | Lower | Upper |
|-------|-------|-------|
| ±10% | $0.90 | $1.10 |
| ±25% | $0.75 | $1.25 |
| ±50% | $0.50 | $1.50 |

## The Math

### Concentration Multiplier

Your effective TVL increases with concentration:

```
Multiplier = (Upper - Lower) / (Upper × Lower - Lower × Lower)
```

At 10x concentration:
- Your $100 acts like $1,000
- You earn fees on $1,000
- But only when price is in range

### Fee Calculation

Fees earned within range:

```
Fees = (Volume in Range × Fee Tier) × (Your Liquidity / Total in Range)
```

## Strategies

### Wide Range (Conservative)

- Range: ±50% or more
- Risk: Low, price likely in range
- Returns: Lower than narrow range

### Narrow Range (Aggressive)

- Range: ±5% or less
- Risk: High, easy to exit range
- Returns: Much higher when in range

### Active Management

1. Monitor price daily
2. Adjust range as price moves
3. Collect fees regularly
4. Re-deposit when out of range

## Pool Health

The interface shows pool health:

| Status | Meaning | Action |
|--------|---------|--------|
| Green | In range | Continue |
| Yellow | Near edge | Consider adjusting |
| Red | Out of range | Must adjust |

## Impermanent Loss

### In Range

When price stays in range:
- Earn fees on full concentration
- Impermanent loss is manageable

### Out of Range

When price exits range:
- Stop earning fees
- Impermanent loss increases
- Consider adjusting range

## Best Practices

1. **Start Wide** - Use ±25% for first position
2. **Monitor** - Check position daily
3. **Adjust** - Move range with price
4. **Collect** - Claim fees regularly
5. **Diversify** - Multiple positions

## Advanced Tips

### Multiple Positions

Create multiple positions:
- One wide for stability
- One narrow for returns
- One at current price

### Rebalancing

Move position as price moves:
- Collect fees
- Remove liquidity
- Add new position with new range

## Conclusion

Concentrated liquidity is powerful but requires:
- Understanding of mechanics
- Active monitoring
- Willingness to adjust positions

Start with conservative ranges and graduate to aggressive strategies as you learn.

---

## Related Links

- [Open AchSwap →](https://app.achswapfi.xyz)
