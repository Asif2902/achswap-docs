---
sidebar_position: 6
---

# V4 Pools

AchSwap V4 introduces hook-enabled singleton pools, a new liquidity architecture that allows custom logic to be attached to pool operations.

## What Are V4 Pools?

V4 pools are Uniswap V4-style pools managed through a single Pool Manager contract. Unlike V2 and V3 where each pool is a separate contract, all V4 pools exist within one contract, reducing gas costs and enabling new features.

### Key Differences from V2/V3

| Feature | V2 | V3 | V4 |
|---------|-----|-----|-----|
| Pool Contract | Separate per pair | Separate per pair | Singleton (all pools in one) |
| Hooks | No | No | Yes |
| Fee Tiers | Fixed 0.3% | 5 tiers (0.01%-10%) | Configurable per pool |
| Liquidity Model | Full range | Concentrated | Concentrated + hooks |

## How V4 Pools Work

### Pool Key

Each V4 pool is identified by a unique key:

| Field | Description |
|-------|-------------|
| currency0 | First token (sorted by address) |
| currency1 | Second token (sorted by address) |
| fee | Trading fee (e.g., 500 = 0.05%, 3000 = 0.30%) |
| tickSpacing | Tick spacing for the pool |
| hooks | Address of the hook contract (or zero address for no hook) |

### Hook Contracts

Hooks are smart contracts that can execute custom logic at various points in a swap or liquidity operation:

- **Before/after swaps** — Custom price calculations, dynamic fees
- **Before/after liquidity** — Deposit/withdrawal hooks
- **Oracle integration** — TWAP or other price feeds

Hook addresses encode permissions in their low 14 bits, which the Pool Manager validates before allowing hook calls.

## Using V4 Pools

### Swapping on V4

V4 swaps work like any other swap on AchSwap. The smart routing system automatically includes V4 pools when finding the best rate.

1. Select tokens to swap
2. Enter the amount
3. If a V4 pool offers the best rate, the router will use it
4. Confirm the swap in your wallet

### Adding V4 Liquidity

1. Go to **Add Liquidity**
2. Select the **V4** tab
3. Choose your token pair
4. Select a fee tier:
   - **0.05%** — Stable pairs
   - **0.30%** — Standard pairs
   - **1.00%** — Volatile pairs
5. Enter amounts for both tokens
6. The interface auto-matches the current pool ratio for initialized pools
7. For new pools, enter amounts to set the initial price
8. Click **Initialize Pool** (for new pools) then **Add Liquidity**

### Pool Initialization

When you create a new V4 pool:

1. Set the initial price by entering both token amounts
2. The pool is initialized on-chain
3. You can then add liquidity

Existing pools show their current ratio and auto-match your deposit.

### Removing V4 Liquidity

1. Go to **Remove Liquidity**
2. Select the **V4** tab
3. Choose the pool position to remove
4. Select amount to remove (partial or full)
5. Confirm the transaction

## Fee Structure

V4 pools support custom fee tiers set at pool creation:

| Fee | Tick Spacing | Best For |
|-----|--------------|----------|
| 0.05% (500) | 10 | Stablecoin pairs |
| 0.30% (3000) | 60 | Standard pairs |
| 1.00% (10000) | 200 | Volatile pairs |

Fees are collected by liquidity providers proportionally to their share of the pool.

## Gasless V4 Swaps

V4 swaps can be executed gaslessly through the AchSwap relayer. See [Gasless Swap](/achswap/gasless-swap) for details.

## Smart Routing with V4

The AchSwap aggregator automatically routes trades across V2, V3, and V4 pools to find the best rate. See [Smart Routing](/achswap/smart-routing) for details.

## Troubleshooting

### "Pool not initialized"
The V4 pool hasn't been created yet. Use the **Initialize Pool** button first.

### "Hook address has no V4 permission bits"
The hook contract address doesn't have the required permission flags. Hook addresses must be deployed via CREATE2 so the low 14 bits encode the correct permissions.

### "No V4 pool found"
No registered V4 pool exists for this token pair. The pool may need to be initialized first.

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
