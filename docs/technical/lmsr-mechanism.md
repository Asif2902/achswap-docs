---
sidebar_position: 2
---

# LMSR Mechanism

Deep dive into how LMSR (Logarithmic Market Scoring Rule) powers AchMarket pricing.

## What is LMSR?

LMSR is an automated market making algorithm designed specifically for prediction markets. It provides:

- **Guaranteed liquidity** - Always able to buy/sell
- **Dynamic pricing** - Prices reflect market sentiment
- **Incentive alignment** - Accurate prices = lower cost

## The Core Formula

### Cost Function

The cost to buy shares is:

```
C(q) = b × ln(e^(q₁/b) + e^(q₂/b) + ... + e^(qn/b))
```

Where:
- `b` = liquidity parameter (controls price sensitivity)
- `q₁, q₂, ...` = shares in each outcome

### Simplified View

For a binary market (Yes/No):

```
Cost of Yes shares = b × ln(1 + e^((yesShares - noShares)/b))
```

## Price Calculation

### Implied Probability

The price (implied probability) of outcome i:

```
P(i) = e^(qi/b) / Σ(e^(qj/b) for all j)
```

### Price Bounds

- Minimum price: > 0 (approaches 0 as qi → 0)
- Maximum price: < 1 (approaches 1 as qi → ∞)
- Always sums to 1

## How Prices Move

### Example: Binary Market

Starting state (balanced):
- Yes: 50% ($0.50)
- No: 50% ($0.50)

After buying Yes:
- Yes: 65% ($0.65)
- No: 35% ($0.35)

The price moved because:
- More people bought Yes
- Market reflects changed sentiment

### Price Sensitivity

The `b` parameter controls sensitivity:

| b Value | Price Movement | Risk/Reward |
|---------|---------------|-------------|
| Low (100) | Large swings | High |
| High (1000) | Small swings | Low |

## Liquidity Parameter (b)

### Choosing b

Formula for selecting b:

```
b = expected_volume × 0.02
```

| Expected Volume | Recommended b |
|-----------------|---------------|
| $1,000 | 20 |
| $10,000 | 200 |
| $100,000 | 2,000 |

### Trade-off

- **Lower b**: More speculative, larger price swings
- **Higher b**: More stable, smaller price movements

## Buying Shares

### Step-by-Step

1. Decide amount to spend
2. Contract calculates cost
3. If cost ≤ amount (within slippage):
   - Shares minted to buyer
   - USDC stays in pool
4. Prices update

### Cost Increases

As you buy more:
- Each additional share costs more
- Prices move toward your position
- Self-reinforcing effect

## Selling Shares

### Reverse Process

1. Specify shares to sell
2. Calculate payout
3. Shares burned
4. USDC transferred to seller
5. Prices adjust opposite direction

### Payout Calculation

Payout is not equal to cost:
- If market moved in your favor: profit
- If market moved against you: loss
- Net = payout - original cost

## Mathematical Properties

### Always In Range

Regardless of trading:
- Prices always between 0 and 1
- No extreme prices
- Always tradeable

### Sum to One

Total probabilities always equal 1:
- If Yes is 70%, No is 30%
- If 3 outcomes, they sum to 100%

### Market Maker Profit

The pool makes money from:
- 0.25% fee on resolution
- Spreads naturally in pricing

## Advantages Over Order Books

| Feature | LMSR | Order Book |
|---------|------|------------|
| Liquidity | Guaranteed | Requires makers |
| Spread | Tight | Variable |
| Simplicity | Simple | Complex |
| Slippage | Calculable | Unknown |

## Real-World Example

### Market: "Will BTC hit $100k?"

Initial state:
- Yes: 50% ($0.50), No: 50% ($0.50)

User A buys $1,000 Yes:
- New price: Yes 58%, No 42%
- Pays: ~$800 cost
- Shares: ~$1,000 worth

User B buys $5,000 Yes:
- New price: Yes 78%, No 22%
- Pays: ~$3,200 cost
- Price moved more because more bought

The price reflects accumulated buying interest.

## Summary

LMSR provides:
1. Guaranteed liquidity always
2. Prices that reflect trading
3. Predictable pricing mechanics
4. Mathematical fairness

It's the gold standard for decentralized prediction markets.
