---
sidebar_position: 8
---

# Smart Routing

AchSwap's smart routing automatically finds the best swap path across V2 and V3 pools.

## How Smart Routing Works

### The Problem

When swapping Token A for Token B, there may be multiple paths:

```
Option 1: Direct
A ──────────────────────────────────────────────── B

Option 2: V2 via C
A ──────────── C ────────────────────────────────── B

Option 3: V3 via C  
A ──────────── C ────────────────────────────────── B
```

### The Solution

Smart routing:
1. Queries quotes from all pools
2. Compares prices
3. Selects best route
4. Executes optimal swap

## Routing Interface

### Route Display

When you input a swap, you see the route:

```
USDC → wUSDC → ACHS
 │         │
 └─ V3     └─ V2
```

This shows:
- Token path
- Pool type per hop

### Multi-Hop Routing

For complex swaps:

```
Token A → Token B → Token C → Token D
```

Up to 4 hops supported.

## Quote Calculation

### Process

1. **Query Pools**
   - Check all V2 pools
   - Check all V3 pools
   - Account for fees

2. **Calculate Output**
   ```
   Output = Input × (1 - Fee) × Rate
   ```

3. **Compare Routes**
   - Rank by output amount
   - Consider gas costs

4. **Select Best**
   - Choose highest output
   - Execute route

### Fee Deduction

Fees are deducted per hop:

| Pool Type | Fee |
|-----------|-----|
| V2 | 0.3% |
| V3 | Fee tier (0.01% - 10%) |

## V2 vs V3 Routing

### V2 Pools

- Single fee tier (0.3%)
- Distributed liquidity
- Simpler pricing

### V3 Pools

- Multiple fee tiers
- Concentrated liquidity
- More complex pricing

### Best Route Selection

The router considers:
- Output amount after fees
- Number of hops
- Gas cost estimation
- Price impact

## Price Impact and Routing

### Single Pool vs Multi-Hop

| Scenario | Price Impact |
|----------|--------------|
| Large direct pool | Low |
| Small direct pool | High |
| Multi-hop (deeper pools) | Lower |

Smart routing automatically:
1. Checks direct route first
2. Finds alternatives if impact high
3. Selects optimal path

### Impact Thresholds

| Impact | Warning |
|--------|---------|
| < 1% | None |
| 1-5% | Yellow warning |
| > 15% | Strong warning |

## Configuration

### Enable/Disable Protocols

In settings, you can toggle:

- Enable V2
- Enable V3

If a protocol is disabled, routing won't use those pools.

### Default Settings

Both V2 and V3 enabled by default for maximum efficiency.

## Examples

### Direct Swap (Best Case)

```
Swap: 1000 USDC → ACHS

Route: USDC → ACHS (V3)
Pool TVL: $1,000,000
Price Impact: 0.02%
Output: 2,498 ACHS
```

### Multi-Hop (Better Rate)

```
Swap: 1000 USDC → ACHS

Direct: USDC → ACHS (V2)
Price Impact: 2.5%
Output: 2,430 ACHS

Multi-hop: USDC → wUSDC → ACHS (V3)
Price Impact: 0.1%
Output: 2,485 ACHS ✓

Router selects: Multi-hop
```

### Fallback

If best route fails:
- Router falls back to second best
- Ensures swap completes

## Advanced

### Custom Routes

Advanced users can:
- Manually select routes
- Force specific paths
- Optimize for specific conditions

### Gas Estimation

Router estimates gas for each route:
- Considers hop count
- Account for V3 vs V2
- Adds to total cost

## Troubleshooting

### "No route found"
- Token pair may not have pools
- Enable disabled protocols
- Try smaller amount

### "Route failed"
- Try again (transient)
- Increase slippage
- Try alternative token pair

## Best Practices

1. **Trust the Router** - Usually finds best path
2. **Check Price Impact** - Yellow/red warnings
3. **Review Route** - See what's being used
4. **Adjust Slippage** - If trades revert often

---

## Related Links

- [Open AchSwap →](https://app.achswapfi.xyz)
