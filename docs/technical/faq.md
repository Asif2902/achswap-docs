---
sidebar_position: 4
---

# Frequently Asked Questions

Common questions about AchSwap and AchMarket.

## General

### What is AchSwap?

AchSwap is a decentralized exchange (DEX) built on ARC Testnet, supporting both V2 and V3 liquidity pools with smart routing and cross-chain bridging.

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
2. Choose V2 or V3
3. Select token pair
4. Enter amounts
5. Confirm transaction

### What's the difference between V2 and V3?

- **V2**: Classic AMM, full range liquidity
- **V3**: Concentrated liquidity, higher potential returns

### How are fees earned?

V2: Earn a share of trading fees proportional to your pool share.
V3: Earn fees when price stays within your selected range.

### What is smart routing?

Smart routing automatically finds the best swap path across both V2 and V3 pools to get you the best rate.

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
