---
sidebar_position: 9
---

# Smart Routing & Aggregator

AchSwap's smart routing system automatically finds the best swap rate across V2, V3, and V4 pools. The aggregator takes this further by splitting trades across multiple protocols for optimal execution.

## How Smart Routing Works

### Multi-Protocol Quotes

When you request a swap, the system queries all enabled protocols in parallel:

1. **V2 Pools** — Direct pair and hop-through-wrapped routes
2. **V3 Pools** — All 5 fee tiers (single-hop) plus 25 multi-hop combinations
3. **V4 Pools** — All registered V4 pools with hooks
4. **Aggregator** — Optimal split across V2, V3, and V4 adapters

The best quote is selected by output amount, and you can manually override to use any available route.

### Route Selection

```
USDC → ACHS

V2:    2,480 ACHS (direct)
V3:    2,495 ACHS (0.05% fee tier)  ← Selected (best)
V4:    2,490 ACHS (0.30% pool)
Agg:   2,501 ACHS (60% V3 + 40% V4)
```

## The Aggregator

The AchSwap aggregator splits your trade across multiple protocols to minimize price impact and maximize output.

### How Aggregator Splitting Works

1. **Probe each adapter** — Get quotes from V2, V3, and V4 adapters for the full amount
2. **Coarse search** — Test 10% increment splits across adapter pairs
3. **Fine search** — Refine the top candidates with 1% increments
4. **Select best** — Choose the split with highest net output

### Example Split

```
Trade: 10,000 USDC → ACHS

Single V3 route:     24,800 ACHS
Aggregator split:
  ├─ 60% via V3:     14,940 ACHS
  └─ 40% via V4:      10,020 ACHS
  Total:             24,960 ACHS (+0.6% better)
```

### Source Mask

The aggregator uses a bitmask to select which protocols to include:

| Protocol | Bit Value |
|----------|-----------|
| V2 | 1 |
| V3 | 2 |
| V4 | 4 |

For example, source mask `7` (1+2+4) enables all three protocols.

### Aggregator Fee

The aggregator charges a **0.1% fee** (10 basis points) on the gross output. This is deducted before displaying the net output.

## Protocol-Specific Routing

### V2 Routing

- Queries direct path and hop-through-wrapped path
- Uses `getAmountsOut` on the V2 Router
- Best for: Simple pairs, stablecoins

### V3 Routing

- Tests all 5 fee tiers in parallel
- Multi-hop through wrapped token (25 fee-tier combinations)
- Uses `QuoterV2` for accurate quotes with gas estimates
- Best for: Concentrated liquidity, volatile pairs

### V4 Routing

- Queries all registered V4 pools
- Supports hook-enabled pools
- Uses the V4 Router's `quoteExactInputSingle`
- Best for: Custom hook logic, new pool types

## Configuration

### Protocol Toggles

In swap settings, you can enable/disable each protocol:

- **V2** — Classic constant product AMM
- **V3** — Concentrated liquidity pools
- **V4** — Hook-enabled singleton pools
- **Aggregator** — Split routing across all protocols

### Aggregator Sub-Source Toggles

When the aggregator is enabled, you can also toggle which sub-sources it uses:

- **Aggregator V2** — Route splits through V2 adapter
- **Aggregator V3** — Route splits through V3 adapter
- **Aggregator V4** — Route splits through V4 adapter

### Default Settings

All protocols and aggregator sources are enabled by default for maximum rate optimization.

## Price Impact

### Impact Calculation

Price impact is measured by comparing the spot price to the execution price:

```
Impact = (Spot Output - Actual Output) / Spot Output × 100
```

### Impact Thresholds

| Impact | UI Warning |
|--------|------------|
| < 1% | None |
| 1% - 5% | Yellow warning |
| > 15% | Red warning + confirmation required |

### Multi-Protocol Impact

The aggregator reduces price impact by splitting large trades across deeper pools.

## Troubleshooting

### "No route found"
- No pools exist for this token pair
- Try enabling more protocols in settings
- For V4, ensure the pool is registered on-chain

### "Aggregator has no route"
- The V4 adapter may not be registered in the aggregator
- Enable V2 or V3 as fallback sources
- Try a smaller amount

### Quote takes a while
- V3 queries 5+25 fee-tier combinations in parallel
- Aggregator probes multiple adapters and split combinations
- Large amounts trigger coarse + fine split search
- Results are cached for 5 seconds

## Best Practices

1. **Trust smart routing** — It finds the best path automatically
2. **Check the route** — Review which protocol/split was selected
3. **Use aggregator for large trades** — Splits reduce price impact
4. **Enable all protocols** — More options = better rates

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
