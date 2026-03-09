---
sidebar_position: 3
---

# Fee Structure

Detailed explanation of how fees work on AchMarket.

## Platform Fee

### Rate

| Fee Type | Rate |
|----------|------|
| Platform Fee | 0.25% (25 basis points) |

This rate is **immutable** - it cannot be changed after deployment.

## When Fees Apply

### Resolution

Fees are collected **only** when a market is resolved:

1. Market reaches deadline
2. Creator calls `resolve()`
3. 0.25% deducted from pool
4. Fee transferred to owner
5. Remaining pool for redemptions

### No Fee Cases

| Scenario | Fee Collected |
|----------|---------------|
| Market resolved | 0.25% ✓ |
| Market cancelled | $0 |
| Market expired | $0 |
| Trading (buy/sell) | $0 |

## Fee Collection Process

### During Resolution

```solidity
function resolve(uint256 winningOutcome) external onlyAdmin {
    // ... validation ...
    
    // Calculate and collect fee
    uint256 pool = address(this).balance;
    uint256 fee = (pool * PLATFORM_FEE_BPS) / 10000;
    
    // Transfer fee to owner
    admin.transfer(fee);
    
    // Store remaining for redemptions
    resolvedPoolWei = pool - fee;
}
```

### Fee Calculation Example

| Pool Size | Fee (0.25%) |
|-----------|--------------|
| $1,000 | $2.50 |
| $10,000 | $25.00 |
| $100,000 | $250.00 |
| $1,000,000 | $2,500.00 |

## Where Fees Go

### Recipient

Fees are transferred to:
- Factory contract owner
- Typically the platform operator
- Automatically during resolution

### Owner Wallet

The owner can:
- View collected fees in dashboard
- Use fees for operations
- Withdraw to any address

## Impact on Traders

### Winners

Your payout after fees:

```
Your Payout = (Your Shares / Total Winning Shares) × (Pool - Fee)
```

### Losers

No impact - your shares become worthless regardless.

### Cancelled Markets

No fee deducted - full refunds available.

## Fee Revenue

### Revenue Streams

Platform revenue = 0.25% × Resolved Pool Volume

### Factors Affecting Revenue

| Factor | Impact |
|--------|--------|
| More resolved markets | More revenue |
| Higher trading volume | Larger pools |
| Less cancellations | More fees |

## Fee Transparency

### Dashboard

Owners can view:
- Total fees collected
- Per-market fee history
- Platform statistics

### Events

Fee collection emits events:

```solidity
event FeeCollected(address indexed admin, uint256 fee);
```

## Best Practices

### For Platform

1. **Encourage resolution** - Resolve over cancel
2. **Create popular markets** - More volume = more fees
3. **Quality markets** - Attracts traders

### For Creators

1. **Resolve promptly** - Within grace period
2. **Provide proof** - Document outcomes
3. **Fair resolution** - Accurate winning outcome

## Comparison

### Traditional Prediction Markets

| Platform | Fee |
|----------|-----|
| Polymarket | 2-5% |
| Augur | ~1% |
| AchMarket | 0.25% |

AchMarket has the lowest fee among major prediction markets.

### DeFi Protocols

| Protocol | Fee |
|----------|-----|
| Uniswap V3 | 0.3% |
| Curve | 0.04% |
| AchMarket | 0.25% |

Competitive with major DEXs.

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
- [Open AchMarket →](https://prediction.achswap.app)
