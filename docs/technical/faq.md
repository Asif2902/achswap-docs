---
sidebar_position: 4
---

# Frequently Asked Questions

Common questions about AchSwap and AchMarket.

## General

### What is AchSwap?

AchSwap is a decentralized exchange (DEX) built on ARC Testnet, supporting V2, V3, and V4 liquidity pools with smart routing, aggregator split routing, gasless swaps, and cross-chain bridging.

### What is AchMarket?

AchMarket is a decentralized prediction market platform where users can create markets, trade outcome shares, and earn from platform fees.

### What network do they run on?

Both run on **ARC Testnet** (Chain ID: 5042002).

### What's the native token?

**USDC** is the native gas token on ARC Testnet.

---

## AchSwap

### How do I add liquidity?

1. Go to **Add Liquidity**
2. Choose V2, V3, or V4
3. Select token pair
4. Enter amounts
5. Confirm transaction

### What's the difference between V2, V3, and V4?

- **V2**: Classic AMM, full range liquidity, single 0.3% fee tier
- **V3**: Concentrated liquidity, higher potential returns, multiple fee tiers (0.01%-10%)
- **V4**: Hook-enabled singleton pools, configurable fees, custom logic hooks

### How are fees earned?

V2: Earn a share of trading fees proportional to your pool share.
V3: Earn fees when price stays within your selected range.
V4: Similar to V3, plus potential additional rewards from hook contracts.

### What is smart routing?

Smart routing automatically finds the best swap path across V2, V3, and V4 pools to get you the best rate.

### What is the aggregator?

The aggregator splits your trade across multiple protocols (V2, V3, V4) to minimize price impact and maximize output. It charges a 0.1% fee on the gross output.

### What are gasless swaps?

Gasless swaps let you sign a swap transaction and have the relayer submit it on your behalf, so you don't need native USDC for gas. See [Gasless Swap](/achswap/gasless-swap) for details.

### What are RWA pairs?

RWA (Real World Asset) pairs allow trading tokenized traditional assets like stocks, commodities, and forex. See the [AchRWA documentation](/achrwa/overview) for details.

### How do I use the bridge?

1. Go to **Bridge**
2. Select source chain
3. Enter USDC amount
4. Click Bridge
5. Wait for attestation
6. Receive USDC on ARC

---

## AchMarket

### How do prediction markets work?

You buy shares in outcomes (e.g., Yes/No). If your outcome wins, you redeem shares for a pro-rata payout from the pool.

### What's LMSR?

LMSR (Logarithmic Market Scoring Rule) is the pricing algorithm that dynamically prices shares based on trading volume.

### How do I create a market?

Connect as owner → Navigate to Create Market → Fill details → Confirm transaction

### What happens when a market resolves?

1. Winning outcome is set
2. 0.25% fee deducted
3. Winners can claim payouts

### What happens if a market is cancelled?

No fee is collected. All traders can claim full refunds based on their deposits.

### How much are platform fees?

**0.25%** (only on resolved markets, never on cancelled).

### What do the market stability tags mean?

Markets are tagged based on their liquidity parameter (b):

| Tag | b Value | What it means |
|-----|---------|---------------|
| Degen Market | 0-5,000 | High risk, large price swings |
| Highly Unstable | 5,001-10,000 | Very volatile |
| Unstable | 10,001-25,000 | Moderate volatility |
| Stable | 25,001-50,000 | Lower volatility |
| Highly Stable | 50,001-100,000 | Very stable prices |
| Extremely Stable | 100,001-250,000 | Near-stable |
| Whale Stable | 250,001+ | Designed for large trades |

Lower b = more speculative, higher potential returns but also bigger losses.
Higher b = more stable, better for larger positions without moving the price much.

### Which stability level should I choose?

- **Degen/Unstable**: For speculative short-term bets, smaller markets
- **Stable**: For general use, balanced risk/reward
- **Highly Stable+**: For markets expecting high volume, or large positions

The b parameter is set at market creation and cannot be changed later.

---

## Wallets & Network

### Which wallets are supported?

MetaMask, Coinbase Wallet, WalletConnect, Rainbow, Trust Wallet, and any RainbowKit-compatible wallet.

### How do I add ARC Testnet?

Network details:
- Chain ID: 5042002
- RPC: https://arc-testnet.drpc.org/
- Explorer: https://testnet.arcscan.app

### How do I get test USDC?

Use the Bridge on AchSwap to transfer USDC from other testnets (Sepolia, Fuji, etc.)

---

## Trading

### Why did my transaction revert?

Common reasons:
- Slippage exceeded (price moved too much)
- Insufficient balance
- Network congestion

### What is slippage tolerance?

The maximum price change you're willing to accept. If market moves beyond this, transaction reverts.

### How is price impact calculated?

Price impact shows how your trade affects the pool price. Larger trades relative to pool size = higher impact.

---

## Troubleshooting

### "Insufficient liquidity"

- Try a smaller amount
- The pool may not exist

### "Transaction failed"

- Check balance
- Increase slippage tolerance
- Try again later

### Wallet not connecting

- Refresh page
- Check wallet extension
- Try incognito mode

### Network not found

- Manually add ARC Testnet
- Ensure using correct RPC URL

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
- [Open AchMarket →](https://prediction.achswap.app)
