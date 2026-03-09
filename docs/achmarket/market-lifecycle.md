---
sidebar_position: 4
---

# Market Lifecycle

Understanding the stages and lifecycle of prediction markets on AchMarket.

## Market Stages

Every market goes through stages:

```
┌─────────┐   ┌─────────────┐   ┌──────────┐   ┌───────────┐
│ Active  │ → │   Grace     │ → │ Resolved │   │ Cancelled │
│         │   │   Period    │   │    or    │   │  / Expired│
└─────────┘   └─────────────┘   │ Expired  │   └───────────┘
                                └──────────┘
```

## Stage Details

### 1. Active

**Duration:** From creation until deadline

During this stage:
- Trading is open
- Users can buy/sell outcome shares
- Price updates dynamically
- Volume accumulates

### 2. Grace Period

**Duration:** 3 days after deadline

After the deadline passes:
- Trading stops
- Market creator has 3 days to resolve
- Purpose: Allow time for resolution

### 3. Resolved

Market decided with winner:
- Winning outcome set
- Proof provided by creator
- 0.25% fee deducted
- Winners can claim payouts
- Losers' shares become worthless

### 4. Cancelled

Market cancelled by creator:
- All participants get refunds
- No fee collected
- Full pool distributed

### 5. Expired

Not resolved in grace period:
- Auto-expires after 3 days
- Full refunds to participants
- Like cancelled

## Resolution Process

### Creator Actions

Market creator can:
1. **Resolve** - Set winning outcome + proof
2. **Cancel** - Cancel market (full refunds)

### What Happens

#### Resolving

```
1. Creator selects winning outcome
2. Provides proof (link to proof)
3. 0.25% fee deducted from pool
4. Remaining pool locked for redemption
5. Winners claim pro-rata shares
```

#### Cancelling

```
1. Creator clicks Cancel
2. No proof required
3. No fee collected
4. Full pool available
5. Participants claim refunds
```

## User Actions by Stage

### During Active

| Action | Available |
|--------|-----------|
| Buy shares | ✓ |
| Sell shares | ✓ |
| Claim | ✗ |

### During Grace Period

| Action | Available |
|--------|-----------|
| Buy shares | ✗ |
| Sell shares | ✗ |
| Claim | ✗ |

### After Resolution

| Action | Winner | Loser |
|--------|--------|-------|
| Claim Winnings | ✓ | ✗ |
| Claim Refund | ✗ | ✗ |

### After Cancellation

| Action | Available |
|--------|-----------|
| Claim Refund | ✓ |

## Fee Structure

### When Fees Apply

**Only on resolution**, not cancellation:
- Fee: 0.25% of pool
- Deducted before redemption
- Goes to platform

### Fee Calculation

```
Pool: $10,000 USDC
Fee: 0.25% × $10,000 = $25
After Fees: $9,975 for redemptions
```

### No Fee Cases

| Scenario | Fee |
|----------|-----|
| Market resolved | 0.25% ✓ |
| Market cancelled | $0 |
| Market expired | $0 |

This encourages resolution but no penalty for honest cancellations.

## Market Categories

Markets can be created in:

| Category | Example |
|----------|---------|
| Crypto | "Will BTC hit $100k?" |
| Sports | "Who wins Super Bowl?" |
| Politics | "Who wins election?" |
| Entertainment | "Best Picture winner?" |
| Science | "First Mars landing?" |
| Other | Custom categories |

## Market Information

### Volume

Total USDC traded:
- Sum of all buys + sells
- Increases as market grows
- Indicates market interest

### Participants

Unique traders:
- Counted once per market
- Shows market engagement

### Deadline

Resolution deadline:
- Set by creator
- After this, grace Cannot be extended

 period starts
-## User Experience

### Timeline View

```
Day 1: Market created (Active)
   ↓
... (trading continues)
   ↓
Day 15: Deadline reached (Active → Grace)
   ↓
Day 18: Resolved (Grace → Resolved)
   ↓
Day 18-∞: Winners claim (Resolved)
```

### Notifications

Check Portfolio for:
- Markets needing attention
- Claims available
- Refunds due

---

## Related Links

- [Open AchMarket →](https://prediction.achswap.app)
