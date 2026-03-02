---
sidebar_position: 2
---

# Trading on Markets

Learn how to buy and sell outcome shares on AchMarket prediction markets.

## Understanding Prediction Markets

### How It Works

Prediction markets allow you to:
- **Buy shares** in an outcome (e.g., "Yes")
- **Sell shares** back to the market
- **Profit** if your outcome wins

### Key Concepts

| Term | Definition |
|------|------------|
| Share | A unit of an outcome |
| Cost | USDC paid to buy shares |
| Payout | USDC received when winning |
| Probability | Market's view of likelihood |

## The Trading Interface

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ [Outcome A]                     [Outcome B]           │
│           Selected: Outcome A (highlighted)            │
├─────────────────────────────────────────────────────────┤
│ [Buy] [Sell]                    Slippage: [1% ▼]     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Amount: [____________] USDC                            │
│                                                         │
│ ─────────────────────────────────────────────────────  │
│                                                         │
│ Preview:                                               │
│ • Shares: 50.0 Outcome A                               │
│ • Avg Price: $0.65                                     │
│ • Potential Payout: $76.92 (if wins)                   │
│ • Profit: $26.92                                       │
│                                                         │
│ [Buy Outcome A]                                        │
└─────────────────────────────────────────────────────────┘
```

### Outcome Selection

Click an outcome to select it:
- Only one can be selected at a time
- Selected outcome is highlighted
- Trading panel updates

## Buying Shares

### Step-by-Step

1. **Select Outcome** - Click Yes or No (or custom)
2. **Choose Buy Tab** - Click "Buy"
3. **Enter Amount** - Type USDC to spend
4. **Review Preview** - See estimated shares and payout
5. **Set Slippage** - Choose tolerance (default 1%)
6. **Place Order** - Click Buy button
7. **Confirm** - Approve in wallet
8. **Wait** - Transaction confirms on-chain

### Understanding Preview

| Field | Description |
|-------|-------------|
| Shares | You'll receive this many outcome shares |
| Avg Price | Average cost per share |
| Potential Payout | If this outcome wins |
| Profit | Payout minus your cost |

### Example

```
Market: "Will BTC hit $100k?"

Current Probabilities:
- Yes: 65% ($0.65)
- No: 35% ($0.35)

You Buy:
- Amount: $100 USDC
- Shares: ~153.8 Yes shares
- Avg Price: $0.65
- Potential Payout: $153.84
- Profit: $53.84
```

## Selling Shares

### When to Sell

Sell shares when:
- You change your prediction
- You want to cut losses
- Market moves against you
- You need liquidity

### Selling Process

1. **Select Outcome** - Click the outcome you hold
2. **Choose Sell Tab** - Click "Sell"
3. **Enter Shares** - Type number of shares to sell
4. **Review Preview** - See USDC you'll receive
5. **Place Order** - Click Sell
6. **Confirm** - Approve in wallet

### Understanding Sell Preview

| Field | Description |
|-------|-------------|
| Shares | Your shares being sold |
| Avg Price | Average price per share |
| You'll Receive | USDC from the sale |

## Slippage Protection

### What is Slippage?

Slippage is the difference between:
- Expected price when you submitted
- Actual price when executed

This happens because prices change with trading.

### Setting Slippage

| Level | Use Case |
|-------|----------|
| 0.5% | Stable markets |
| 1% | Default, balanced |
| 2% | Moving markets |
| 5% | Very volatile |

### Slippage in Action

```
You buy at $0.65 with 1% slippage:
- Expected: $0.65
- Max price: $0.6565

If execution price > $0.6565:
- Transaction reverts
- No shares purchased
```

## Probability & Pricing

### LMSR Mechanism

AchMarket uses **LMSR** (Logarithmic Market Scoring Rule):
- Dynamic pricing based on volume
- Price increases as more people buy
- Provides liquidity at all price levels

### Price Movement

```
Initial: 50% Yes / 50% No

After $1,000 more Yes buys:
→ 65% Yes / 35% No (Yes price increases)

After $1,000 more No buys:
→ 35% Yes / 65% No (No price increases)
```

## Portfolio Tracking

### After Trading

Your position appears in Portfolio:
- See all outcomes you hold
- Track total deposited
- Claim winnings when resolved

## Cancelled Markets

### Full Refunds

If a market is cancelled:
- All traders can claim full refund
- Based on original deposit
- No fees collected

## Resolved Markets

### Winning Outcome

If you bought the winning outcome:
- See "Claim Winnings" button
- Click to redeem shares
- Receive pro-rata pool share

### Losing Outcome

If you bought the losing outcome:
- Shares become worthless
- No redemption possible
- Loss = amount paid

---

## Related Links

- [Open AchMarket →](https://market.achswapfi.xyz)
