---
sidebar_position: 7
---

# Fee Management

Understanding and collecting platform fees on AchMarket.

## Fee Overview

### Fee Rate

Platform fee is **0.25%** (25 basis points):
- Immutable (cannot change)
- Only on resolved markets
- Deducted at resolution time

### When Collected

Fees are collected when:
- Market is **resolved** (not cancelled)
- Automatically during resolution
- Transferred to owner wallet

## Fee Calculation

### Formula

```
Fee = Pool Balance × 0.25%
```

### Example

```
Market Pool: $10,000 USDC
Fee: 0.25% × $10,000 = $25 USDC
After Fees: $9,975 for redemptions
```

## Fee Dashboard

### Access

Navigate to **Fee Management** in owner dashboard:
- `/owner/fees`

### Dashboard Shows

| Metric | Description |
|--------|-------------|
| Total Fees Collected | All-time fees |
| Resolved Markets | Count of resolved |
| Total Volume | Across all resolved |

## Fee Collection Events

### Per-Market Breakdown

Each resolution shows:
- Market title
- Resolution date
- Pool size
- Fee collected

### Event Log

```
┌─────────────────────────────────────────────────────────┐
│ Fee Collection History                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ BTC $100k?                                             │
│ Resolved: Jan 15, 2024                                 │
│ Pool: $10,000 → Fee: $25.00                          │
│                                                         │
│ Super Bowl Winner                                       │
│ Resolved: Feb 12, 2024                                 │
│ Pool: $50,000 → Fee: $125.00                         │
│                                                         │
│ Election Result                                         │
│ Resolved: Nov 5, 2024                                  │
│ Pool: $100,000 → Fee: $250.00                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Fee Collection

### Automatic Transfer

Fees are automatically:
- Deducted during resolve()
- Transferred to owner wallet
- No manual claim needed

### Wallet

Fees go to:
- Owner's connected wallet
- Standard USDC balance
- Can be withdrawn/sent anywhere

## What Affects Fees

### Volume

More trading = larger pool = more fees

### Resolution vs Cancellation

| Market Type | Fee |
|-------------|-----|
| Resolved | 0.25% ✓ |
| Cancelled | $0 |
| Expired | $0 |

### No Fee Scenarios

No fee collected when:
- Market is cancelled
- Market expires
- Volume is zero

## Statistics

### Dashboard Metrics

Track overall performance:
- Total fees collected
- Number of resolved markets
- Average fee per market
- Total trading volume

## Best Practices

### Maximizing Fees

1. **Encourage resolution** - Resolve rather than cancel
2. **Promote trading** - More volume = more fees
3. **Create quality markets** - Attracts traders

### Responsible Management

1. **Resolve promptly** - Within grace period
2. **Provide proof** - Document resolutions
3. **Fair cancellation** - Only when necessary
