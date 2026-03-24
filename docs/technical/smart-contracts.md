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
| `createMarket()` | Deploy new market with all parameters |
| `getMarkets()` | List markets with pagination |
| `getMarketCount()` | Total number of markets |
| `setMinBWad()` | Set minimum liquidity parameter |
| `setMaxBWad()` | Set maximum liquidity parameter |
| `setDurationBounds()` | Set min/max market duration |
| `editMarket()` | Edit existing market metadata |

### Configurable Bounds

The factory owner can configure market creation parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `minBWad` | 1,000e18 | Minimum liquidity parameter |
| `maxBWad` | 1,000,000e18 | Maximum liquidity parameter |
| `minDuration` | 1 hour | Minimum market duration |
| `maxDuration` | 365 days | Maximum market duration |

### Contract Address

```
Factory: 0xd7b122B12caCB299249f89be7F241a47f762f283
Lens: 0x8241ACa87D4Dee4CA167b1e172Ed955522599e70
```

Network: ARC Testnet (Chain ID: 5042002)

:::tip
Always verify contract addresses in the frontend configuration at deployment time.
:::

## Market Contract

### Purpose

Each market is its own contract:
- Holds its own state
- Manages trading
- Handles resolution
- Distributes payouts

### Key Features

1. **LMSR Pricing** - Automated market making
2. **Solady Math** - Fixed-point exp/ln calculations (WAD precision)
3. **Buy & Sell** - Both directions with slippage protection
4. **Edit Market** - Admin can edit title/description/category
5. **Edit Deadline** - Admin can extend the market deadline
6. **Suspend/Resume** - Admin can temporarily pause trading
7. **Trigger Expiry** - Anyone can trigger expiry after grace period
8. **Preview Functions** - Calculate cost/proceeds before trading
9. **Refund System** - Pro-rata refunds for cancelled/expired markets
10. **Native USDC** - Accepts native USDC for all trades

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

### Market Stability Levels

The liquidity parameter `b` determines market stability and is displayed as tags on each market:

| Stability Level | b Value Range | Description |
|-----------------|---------------|-------------|
| **Degen Market** | 0 - 5,000 | Highly speculative, large price swings, high risk/reward |
| **Highly Unstable** | 5,001 - 10,000 | Very volatile, rapid price changes |
| **Unstable** | 10,001 - 25,000 | Moderate volatility, balanced risk |
| **Stable** | 25,001 - 50,000 | Lower volatility, more predictable prices |
| **Highly Stable** | 50,001 - 100,000 | Very stable, minimal price impact |
| **Extremely Stable** | 100,001 - 250,000 | Near-stable, whale-friendly |
| **Whale Stable** | 250,001+ | Designed for large trades, minimal market impact |

### How Price Sensitivity Works

The `b` parameter directly controls how much prices move when traders buy or sell:

- **Lower b (Degen)**: Each trade causes large price swings. Good for speculation, risky for large positions.
- **Higher b (Stable)**: Prices move slowly even with large trades. Better for markets expecting high volume.

#### Example

For a binary Yes/No market with $10,000 in the pool:

| b Value | Buying $1,000 Yes moves price to... |
|---------|-------------------------------------|
| 1,000 (Degen) | ~75% |
| 10,000 (Stable) | ~55% |
| 100,000 (Whale Stable) | ~51% |

The higher the b value, the more "stable" the prices remain regardless of trade size.

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
    Suspended,   // Trading paused, can resume
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
         → suspend() → Suspended → resume() → Active
         → (no action) → Expired
```

## Trading Functions

### Buy Shares

```solidity
function buy(
    uint256 outcomeIdx,
    uint256 sharesWad,
    uint256 maxCostWei
) external payable nonReentrant onlyTradingAllowed {
    // Check trading period
    require(block.timestamp <= marketDeadline, "Trading period ended");
    require(outcomeIdx < outcomeCount, "Invalid outcome");
    require(sharesWad > 0, "Zero shares");

    // Calculate cost using LMSR
    int256 rawCost = LMSRMath.tradeCost(q, outcomeIdx, int256(sharesWad), b);
    require(rawCost >= 0, "Unexpected negative buy cost");
    
    uint256 costWei = uint256(rawCost);
    
    // Slippage protection
    require(costWei <= maxCostWei, "Slippage exceeded");
    require(msg.value >= costWei, "Insufficient USDC");
    
    // Update state
    totalSharesWad[outcomeIdx] += int256(sharesWad);
    sharesOf[msg.sender][outcomeIdx] += sharesWad;
    netDepositedWei[msg.sender] += costWei;
    totalVolumeWei += costWei;
    totalNetDepositedWei += costWei;
    _trackParticipant(msg.sender);
    
    // Refund excess USDC
    uint256 excess = msg.value - costWei;
    if (excess > 0) {
        (bool ok,) = msg.sender.call{value: excess}("");
    }
}
```

### Sell Shares

```solidity
function sell(
    uint256 outcomeIdx,
    uint256 sharesWad,
    uint256 minReceiveWei
) external nonReentrant onlyTradingAllowed {
    // Check trading period
    require(block.timestamp <= marketDeadline, "Trading period ended");
    require(outcomeIdx < outcomeCount, "Invalid outcome");
    require(sharesWad > 0, "Zero shares");
    require(sharesOf[msg.sender][outcomeIdx] >= sharesWad, "Insufficient shares");
    
    // Selling = negative delta in LMSR
    int256[] memory q = _getSharesArray();
    int256 rawCost = LMSRMath.tradeCost(q, outcomeIdx, -int256(sharesWad), b);
    require(rawCost <= 0, "Unexpected positive sell cost");
    
    uint256 proceedsWei = rawCost < 0 ? uint256(-rawCost) : 0;
    require(proceedsWei >= minReceiveWei, "Slippage exceeded");
    
    // Update state
    totalSharesWad[outcomeIdx] -= int256(sharesWad);
    sharesOf[msg.sender][outcomeIdx] -= sharesWad;
    totalVolumeWei += proceedsWei;
    
    // Adjust net deposited (cap at zero to avoid underflow on profit)
    if (proceedsWei > 0) {
        require(address(this).balance >= proceedsWei, "Insufficient liquidity");
        
        if (netDepositedWei[msg.sender] >= proceedsWei) {
            netDepositedWei[msg.sender] -= proceedsWei;
            totalNetDepositedWei -= proceedsWei;
        } else {
            totalNetDepositedWei -= netDepositedWei[msg.sender];
            netDepositedWei[msg.sender] = 0;
        }
        
        (bool ok,) = msg.sender.call{value: proceedsWei}("");
    }
}
```

### Preview Functions

```solidity
function previewBuy(uint256 outcomeIdx, uint256 sharesWad) 
    external view returns (uint256 costWei);

function previewSell(uint256 outcomeIdx, uint256 sharesWad) 
    external view returns (uint256 proceedsWei);
```

## Resolution

### Resolve Function

```solidity
function resolve(uint256 _winningOutcome, string calldata _proofUri)
    external
    onlyAdmin
{
    // Auto-expire if grace period passed
    if ((stage == Stage.Active || stage == Stage.Suspended) && 
        block.timestamp > marketDeadline + RESOLUTION_GRACE_PERIOD) {
        stage = Stage.Expired;
        emit MarketCancelled("Auto-expired after grace period", "");
        return;
    }

    require(stage == Stage.Active || stage == Stage.Suspended, "Market not active");
    require(_winningOutcome < outcomeCount, "Invalid outcome");
    require(bytes(_proofUri).length > 0, "Proof URI required");
    
    winningOutcome = _winningOutcome;
    proofUri = _proofUri;
    stage = Stage.Resolved;
    
    // Collect 0.25% platform fee
    uint256 pool = address(this).balance;
    uint256 fee = (pool * PLATFORM_FEE_BPS) / 10000;
    resolvedPoolWei = pool - fee;
    
    // Transfer fee to admin
    if (fee > 0) {
        (bool ok,) = admin.call{value: fee}("");
    }
}
```

### Cancel Function

```solidity
function cancel(string calldata reason, string calldata _proofUri)
    external
    onlyAdmin
{
    require(stage == Stage.Active || stage == Stage.Suspended, "Not active or suspended");
    require(bytes(reason).length > 0, "Reason required");
    require(bytes(_proofUri).length > 0, "Proof URI required");
    
    cancelReason = reason;
    cancelProofUri = _proofUri;
    stage = Stage.Cancelled;
}
```

### Suspend/Resume

```solidity
function suspend() external onlyAdmin {
    require(stage == Stage.Active, "Not active");
    stage = Stage.Suspended;
    emit MarketSuspended();
}

function resume() external onlyAdmin {
    require(stage == Stage.Suspended, "Not suspended");
    stage = Stage.Active;
    emit MarketResumed();
}
```

### Edit Market

```solidity
function editMarket(
    string calldata _title,
    string calldata _description,
    string calldata _category
) external onlyAdmin onlyEditable {
    require(bytes(_title).length > 0, "Empty title");
    require(bytes(_description).length > 0, "Empty description");
    require(bytes(_category).length > 0, "Empty category");
    
    title = _title;
    description = _description;
    category = _category;
    emit MarketEdited(_title, _description, _category);
}
```

### Edit Deadline

```solidity
function editDeadline(uint256 newDeadline) external onlyAdmin onlyEditable {
    require(newDeadline > block.timestamp, "Deadline must be in future");
    marketDeadline = newDeadline;
    emit DeadlineEdited(newDeadline);
}
```

### Trigger Expiry

Anyone can trigger market expiry after grace period:

```solidity
function triggerExpiry() external {
    require(stage == Stage.Active || stage == Stage.Suspended, "Not active or suspended");
    require(block.timestamp > marketDeadline + RESOLUTION_GRACE_PERIOD, "Grace period not passed");
    stage = Stage.Expired;
    emit MarketCancelled("Expired: not resolved within grace period", "");
}
```

## Redemption & Refunds

### Redeem Winnings (Resolved Market)

```solidity
function redeem() external nonReentrant {
    require(stage == Stage.Resolved, "Not resolved");
    require(!hasRedeemed[msg.sender], "Already redeemed");
    
    uint256 userWinShares = sharesOf[msg.sender][winningOutcome];
    uint256 totalWinShares = uint256(totalSharesWad[winningOutcome]);
    
    hasRedeemed[msg.sender] = true;
    
    // Pro-rata payout
    uint256 payout = (userWinShares * resolvedPoolWei) / totalWinShares;
    (bool ok,) = msg.sender.call{value: payout}("");
}
```

### Refund (Cancelled/Expired Market)

```solidity
function refund() external nonReentrant {
    require(stage == Stage.Cancelled || stage == Stage.Expired);
    require(!hasRefunded[msg.sender], "Already refunded");
    
    uint256 userDeposit = netDepositedWei[msg.sender];
    hasRefunded[msg.sender] = true;
    
    // Pro-rata refund based on net deposited
    uint256 bal = address(this).balance;
    uint256 payout = (userDeposit * bal) / totalNetDepositedWei;
    (bool ok,) = msg.sender.call{value: payout}("");
}
```

## View Functions

### Market Info

```solidity
function getMarketInfo() external view returns (
    string memory _title,
    string memory _description,
    string memory _category,
    string memory _imageUri,
    string memory _proofUri,
    string[] memory _outcomeLabels,
    Stage _stage,
    uint256 _winningOutcome,
    uint256 _createdAt,
    uint256 _marketDeadline,
    uint256 _totalVolumeWei,
    uint256 _participantCount,
    string memory _cancelReason,
    string memory _cancelProofUri
);
```

### Implied Probabilities

```solidity
function getImpliedProbabilities() external view returns (int256[] memory probs);
// Returns uniform distribution if no trades yet
```

### User Info

```solidity
function getUserInfo(address user) external view returns (
    uint256[] memory _shares,
    uint256 _netDeposited,
    bool _redeemed,
    bool _refunded,
    bool _canRedeem,
    bool _canRefund
);
```

### Resolution Deadline

```solidity
function resolutionDeadline() external view returns (uint256);
// Returns: marketDeadline + 3 days grace period
```

## Security Considerations

### Access Control

- Factory owner can configure parameters and create markets
- Each market has its own admin (market creator) who can:
  - Resolve/cancel the market
  - Edit market metadata
  - Suspend/resume trading
  - Extend the deadline
- Users can only access their own shares
- Reentrancy protection on all state-changing functions

### Reentrancy Protection

- All functions use `nonReentrant` modifier
- Prevents recursive calls
- Protects against flash loan attacks

### Safe Arithmetic

- Uses Solidity 0.8+ overflow checks
- No SafeMath needed

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
- [Open AchMarket →](https://prediction.achswap.app)
