---
sidebar_position: 1
---

# Smart Contracts

Technical overview of the AchMarket smart contract architecture.

## Architecture Overview

AchMarket uses a factory pattern:

```
┌─────────────────────────────────────────────────────────┐
│  PredictionMarketFactory                                │
│  (Deploys and manages all markets)                     │
└─────────────────────────┬───────────────────────────────┘
                          │
                          │ creates
                          ▼
┌─────────────────────────────────────────────────────────┐
│  PredictionMarket (per market)                          │
│  (Individual market with LMSR pricing)                  │
└─────────────────────────────────────────────────────────┘
```

## Factory Contract

### Purpose

The Factory:
- Deploys new markets
- Maintains market registry
- Provides global statistics
- Manages market creator

### Key Functions

| Function | Description |
|----------|-------------|
| `createMarket()` | Deploy new market |
| `getMarketSummaries()` | List all markets |
| `getGlobalStats()` | Platform statistics |
| `getUserPortfolio()` | User's positions |

### Contract Address

```
Factory: 0x7B7D71141B5b9b2F42E6D7Bf1657ad9c2B140272
```

## Market Contract

### Purpose

Each market is its own contract:
- Holds its own state
- Manages trading
- Handles resolution
- Distributes payouts

### Key Features

1. **LMSR Pricing** - Automated market making
2. **ERC-1155 Style** - Shares as tokens
3. **Resolution** - Winner selection
4. **Redemption** - Payout distribution

## LMSR Mechanism

### What is LMSR?

Logarithmic Market Scoring Rule:
- Dynamic pricing algorithm
- Used by prediction markets
- Guaranteed liquidity
- Price bounds [0, 1]

### Mathematical Formula

```
Cost to buy q shares:
C(q) = b × ln(e^(q1/b) + e^(q2/b) + ... + e^(qn/b))

Where b = liquidity parameter
```

### Liquidity Parameter (b)

Controls price sensitivity:

| b Value | Effect |
|---------|--------|
| 100-300 | High volatility, large swings |
| 500-1000 | Stable prices |

### Buying Shares

```solidity
// Simplified cost calculation
function cost(uint256[] memory outcomeAmounts) public pure returns (uint256) {
    uint256 sum = 0;
    for (uint i = 0; i < outcomeAmounts.length; i++) {
        sum += exp(outcomeAmounts[i] / b);
    }
    return b * ln(sum);
}
```

## Market Lifecycle

### Stage Enum

```solidity
enum Stage {
    Active,      // Trading open
    Resolved,    // Winner decided
    Cancelled,   // Cancelled
    Expired      // Auto-expired
}
```

### State Transitions

```
Active → (deadline) → Grace Period (3 days)
         → resolve() → Resolved
         → cancel() → Cancelled
         → (no action) → Expired
```

## Trading Functions

### Buy Shares

```solidity
function buy(uint256 outcome, uint256 amountMin)
    external
    payable
{
    // Calculate cost
    uint256 cost = calculateCost(outcome, msg.value);
    require(cost <= amountMin, "Slippage exceeded");
    
    // Mint shares
    shares[msg.sender][outcome] += msg.value;
    totalShares[outcome] += msg.value;
}
```

### Sell Shares

```solidity
function sell(uint256 outcome, uint256 shareAmount)
    external
{
    // Calculate payout
    uint256 payout = calculatePayout(outcome, shareAmount);
    
    // Burn shares
    shares[msg.sender][outcome] -= shareAmount;
    totalShares[outcome] -= shareAmount;
    
    // Transfer USDC
    msg.sender.transfer(payout);
}
```

## Resolution

### Resolve Function

```solidity
function resolve(uint256 winningOutcome, string calldata proofUri)
    external
    onlyAdmin
{
    require(stage == Stage.Active);
    
    winningOutcome = winningOutcome;
    proofUri = proofUri;
    stage = Stage.Resolved;
    
    // Collect 0.25% fee
    uint256 fee = (address(this).balance * 25) / 10000;
    admin.transfer(fee);
    resolvedPoolWei = address(this).balance - fee;
}
```

## Redemption

### Redeem Winnings

```solidity
function redeem() external {
    require(stage == Stage.Resolved);
    
    uint256 winningShares = shares[msg.sender][winningOutcome];
    require(winningShares > 0);
    
    uint256 payout = (winningShares * resolvedPoolWei) / totalShares[winningOutcome];
    msg.sender.transfer(payout);
}
```

## Security Considerations

### Access Control

- Only factory owner can create markets
- Only market creator can resolve/cancel
- Users can only access their own shares

### Reentrancy Protection

- All functions use `nonReentrant` modifier
- Prevents recursive calls
- Protects against flash loan attacks

### Safe Math

- Uses Solidity 0.8+ overflow checks
- No SafeMath needed
