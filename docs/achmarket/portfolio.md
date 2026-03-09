---
sidebar_position: 3
---

# Portfolio

Your Portfolio page shows all your positions across all markets.

## Overview

The Portfolio displays:
- All markets where you have positions
- Total deposited amounts
- Shares per outcome
- Actions available (claim, refund)

## Accessing Portfolio

1. Connect your wallet
2. Click "Portfolio" in navigation
3. View all your positions

## Portfolio Interface

### Summary Stats

At the top, see totals:

```
┌─────────────────────────────────────────────────────────┐
│  Portfolio                      5 positions             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┬─────────────┬─────────────┐           │
│  │ Total       │ Active      │ Claimable   │           │
│  │ Deposited   │ Positions   │             │           │
│  │ $1,250      │ 3           │ $75         │           │
│  └─────────────┴─────────────┴─────────────┘           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Stat | Description |
|------|-------------|
| Total Deposited | Net USDC invested across all positions |
| Active Positions | Markets still unresolved |
| Claimable | Winnings/refunds available |

## Position Cards

Each position shows:

```
┌─────────────────────────────────────────────────────────┐
│ Market Title                          [Active Badge]    │
│ Category                                    Deposited  │
│                                             $500 USDC  │
├─────────────────────────────────────────────────────────┤
│ Shares:                                                        │
│ [Yes: 200]  [No: 0]                                        │
├─────────────────────────────────────────────────────────┤
│ [View Market]                              [Claim Winnings] │
└─────────────────────────────────────────────────────────┘
```

### Fields

| Field | Description |
|-------|-------------|
| Market Title | Question being predicted |
| Category | Sports, Crypto, etc. |
| Stage | Active, Resolved, etc. |
| Shares | Your holdings per outcome |
| Deposited | Net USDC invested |

## Understanding Positions

### Active Positions

Markets still trading:
- Can hold shares
- Market hasn't resolved yet
- Check back later for results

### Resolved Positions

Market decided:
- Winning outcome shown
- "Claim Winnings" if you won
- Shares valued at $0 if lost

### Cancelled Positions

Market cancelled:
- "Claim Refund" available
- Get back your deposit

## Claiming Winnings

### When Available

After a market resolves to your outcome:
- "Claim Winnings" button appears
- Green highlight on winning outcome

### How to Claim

1. Find position with "Claim Winnings"
2. Click the button
3. Confirm transaction in wallet
4. Wait for confirmation
5. USDC added to wallet

### Payout Calculation

Your payout:
```
Your Payout = (Your Winning Shares / Total Winning Shares) × Pool After Fees
```

Example:
- You have 100 winning shares
- Total winning shares: 10,000
- Pool after fees: $100,000
- Your payout: (100/100,000) × $100,000 = $1,000

## Claiming Refunds

### When Available

For cancelled or expired markets:
- "Claim Refund" button appears
- Get back pro-rata deposit

### How to Claim

1. Find position with "Claim Refund"
2. Click the button
3. Confirm in wallet
4. Receive USDC refund

### Refund Calculation

Refund amount:
```
Your Refund = (Your Deposit / Total Deposits) × Remaining Pool
```

## Claimed Status

### After Claiming

Claimed positions show status:
- ✓ Winnings claimed
- ✓ Refund claimed

## Position History

### No Positions Yet

If you haven't traded:
- "Connect Wallet" prompt
- Browse markets to start

### Empty After Connecting

If you have wallet but no positions:
- No trades placed yet
- All markets would show here

## Connecting Wallet

Portfolio requires wallet connection:
- See "Connect Wallet" empty state
- Must connect to view positions
- Click "Connect Wallet" to proceed

---

## Related Links

- [Open AchMarket →](https://prediction.achswap.app)
