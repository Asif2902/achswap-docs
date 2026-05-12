---
sidebar_position: 1
---

# AchRWA - Real World Assets on Arc

AchRWA brings **real-world asset prices** on-chain through a vault-backed synthetic token system. Users can buy and redeem synthetic tokens representing stocks, commodities, and forex, all settled in USDC on Arc.

## How It Works

```
┌──────────┐    USDC     ┌──────────────┐    mint    ┌───────────┐
│   User   │ ──────────► │  RWAVault    │ ─────────► │  Synth    │
│          │ ◄────────── │              │ ◄───────── │  (sAAPL)  │
│          │    USDC     │  0.3% fee    │    burn    │           │
└──────────┘             └──────┬───────┘            └───────────┘
                                │
                         ┌──────┴───────┐
                         │ AchRWAOracle │
                         │  (prices)    │
                         └──────────────┘
```

1. **Buy** — Send USDC to the vault, receive synth tokens at the current oracle price
2. **Redeem** — Send synth tokens back to the vault, receive USDC at the current oracle price
3. **Fee** — 0.3% on every buy and redeem

## Supported Assets

| Symbol | Asset | Category | Price Source |
|--------|-------|----------|-------------|
| sAAPL | Apple Inc. | Stock | Yahoo Finance |
| sGOOGL | Alphabet Inc. | Stock | Yahoo Finance |
| sMSFT | Microsoft Corp. | Stock | Yahoo Finance |
| sTSLA | Tesla Inc. | Stock | Yahoo Finance |
| sNVDA | Nvidia Corp. | Stock | Yahoo Finance |
| sWTI | Crude Oil WTI | Commodity | Yahoo Finance |
| sGOLD | Gold Futures | Commodity | Yahoo Finance |
| sSILVER | Silver Futures | Commodity | Yahoo Finance |
| sNATGAS | Natural Gas Futures | Commodity | Yahoo Finance |
| sGBPUSD | GBP/USD | Forex | Yahoo Finance |

All synth tokens are **ERC-20** with 18 decimals, matching Arc's native USDC.

## Key Properties

- **No AMM pools** — Synth price is set by the oracle, not by supply/demand curves
- **No liquidity needed** — The vault holds USDC reserves to back all outstanding synths
- **USDC only** — Swaps are always USDC ↔ synth. No token-to-token swaps.
- **Oracle-gated** — Only authorized keepers can push prices. Anyone can read them.

## Smart Contracts

| Contract | Address | Role |
|----------|---------|------|
| AchRWAOracle | `0x76398cfa526D4a76EaEC0c4709d6B7C966E5ABdB` | Price oracle & pair registry |
| RWAVault | `0xb8dc1f767167b567227326D8849175a188A0e78C` | Buy/redeem vault |

## Fees & Reserve

- **Fee**: 0.3% (30 BPS) on buy and redeem
- **Fees are separate** from reserve — never mixed
- **Reserve backs redemptions** — vault must have sufficient USDC to honor all outstanding synth positions
- **Owner can withdraw fees** but cannot touch the reserve

## Using AchRWA on AchSwap

### Buying (USDC → Synth)

1. Go to the Swap page
2. Select USDC as the input token
3. Select an RWA token (e.g. sAAPL) as the output
4. Enter the USDC amount
5. Review the quote (synth amount, fee, price)
6. Click Buy and confirm the transaction

### Redeeming (Synth → USDC)

1. Go to the Swap page
2. Select an RWA token (e.g. sAAPL) as the input
3. USDC is automatically selected as the output
4. Enter the synth amount
5. Review the quote (USDC amount, fee, price)
6. Click Redeem and confirm the transaction

:::note
No token approval is needed for redemptions. The vault checks your synth balance directly.
:::

:::caution
RWA tokens **cannot** be used for liquidity provision. They are not backed by AMM pools — only by the vault reserve. The Add Liquidity page filters out RWA tokens automatically.
:::
