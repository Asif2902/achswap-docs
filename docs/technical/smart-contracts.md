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
Factory: 0x249A649e138f46318AfC0aD128fe0fd432902e48
Lens: 0xF9e1DFa4d020fbd70924200d27E82B520D178354
```

Network: ARC Testnet (Chain ID: 5042002)

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
4. **Edit Market** - Admin can edit title/description
5. **Trigger Expiry** - Anyone can trigger expiry after grace period
6. **Preview Functions** - Calculate cost/proceeds before trading
7. **Refund System** - Pro-rata refunds for cancelled/expired markets

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
function buy(
    uint256 outcomeIdx,
    uint256 sharesWad,
    uint256 maxCostWei
) external payable nonReentrant onlyActive {
    // Calculate cost using LMSR
    int256 rawCost = LMSRMath.tradeCost(q, outcomeIdx, int256(sharesWad), b);
    uint256 costWei = uint256(rawCost);
    
    // Slippage protection
    require(costWei <= maxCostWei, "Slippage exceeded");
    require(msg.value >= costWei, "Insufficient ETH");
    
    // Update state
    totalSharesWad[outcomeIdx] += int256(sharesWad);
    sharesOf[msg.sender][outcomeIdx] += sharesWad;
    netDepositedWei[msg.sender] += costWei;
    
    // Refund excess ETH
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
) external nonReentrant onlyActive {
    // Selling = negative delta in LMSR
    int256 rawCost = LMSRMath.tradeCost(q, outcomeIdx, -int256(sharesWad), b);
    uint256 proceedsWei = uint256(-rawCost);
    
    require(proceedsWei >= minReceiveWei, "Slippage exceeded");
    
    // Update state
    totalSharesWad[outcomeIdx] -= int256(sharesWad);
    sharesOf[msg.sender][outcomeIdx] -= sharesWad;
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
    require(stage == Stage.Active, "Market not active");
    require(_winningOutcome < outcomeCount, "Invalid outcome");
    require(bytes(_proofUri).length > 0, "Proof URI required");
    
    winningOutcome = _winningOutcome;
    proofUri = _proofUri;
    stage = Stage.Resolved;
    
    // Collect 0.25% fee
    uint256 pool = address(this).balance;
    uint256 fee = (pool * PLATFORM_FEE_BPS) / 10000;
    resolvedPoolWei = pool - fee;
    
    // Transfer fee to admin
    (bool ok,) = admin.call{value: fee}("");
}
```

### Cancel Function

```solidity
function cancel(string calldata reason, string calldata _proofUri)
    external
    onlyAdmin
{
    require(stage == Stage.Active, "Not active");
    require(bytes(reason).length > 0, "Reason required");
    require(bytes(_proofUri).length > 0, "Proof URI required");
    
    cancelReason = reason;
    cancelProofUri = _proofUri;
    stage = Stage.Cancelled;
}
```

### Edit Market

```solidity
function editMarket(string calldata _title, string calldata _description)
    external
    onlyAdmin
{
    require(stage == Stage.Active, "Not active");
    title = _title;
    description = _description;
}
```

### Trigger Expiry

Anyone can trigger market expiry after grace period:

```solidity
function triggerExpiry() external {
    require(stage == Stage.Active);
    require(block.timestamp > marketDeadline + RESOLUTION_GRACE_PERIOD);
    stage = Stage.Expired;
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

- Only factory owner can create markets
- Only market creator (admin) can resolve/cancel/edit
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
