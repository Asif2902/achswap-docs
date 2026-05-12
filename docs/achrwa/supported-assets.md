---
sidebar_position: 2
---

# Supported Assets

AchRWA currently supports 10 synthetic tokens tracking real-world asset prices. All tokens are ERC-20 with 18 decimals and backed 1:1 by USDC reserves in the vault.

## Stocks

| Token | Underlying | Symbol | Pair ID | Oracle Frequency |
|-------|-----------|--------|---------|-----------------|
| Synth Apple Inc. | Apple Inc. (AAPL) | sAAPL | 1 | ~60 seconds |
| Synth Alphabet Inc. | Alphabet Inc. (GOOGL) | sGOOGL | 2 | ~60 seconds |
| Synth Microsoft Corp. | Microsoft Corp. (MSFT) | sMSFT | 6 | ~60 seconds |
| Synth Tesla Inc. | Tesla Inc. (TSLA) | sTSLA | 8 | ~60 seconds |
| Synth Nvidia Corp. | Nvidia Corp. (NVDA) | sNVDA | 9 | ~60 seconds |

## Commodities

| Token | Underlying | Symbol | Pair ID | Oracle Frequency |
|-------|-----------|--------|---------|-----------------|
| Synth Crude Oil WTI | WTI Crude Oil Futures | sWTI | 3 | ~60 seconds |
| Synth Gold | Gold Futures (GC=F) | sGOLD | 4 | ~60 seconds |
| Synth Silver | Silver Futures (SI=F) | sSILVER | 5 | ~60 seconds |
| Synth Natural Gas | Natural Gas Futures (NG=F) | sNATGAS | 7 | ~60 seconds |

## Forex

| Token | Underlying | Symbol | Pair ID | Oracle Frequency |
|-------|-----------|--------|---------|-----------------|
| Synth GBP/USD | British Pound / US Dollar | sGBPUSD | 10 | ~60 seconds |

## Token Details

All synth tokens share these properties:

- **Decimals**: 18 (matches Arc native USDC)
- **Backing**: USDC held in the RWAVault contract
- **Price source**: AchRWAOracle (authorized keepers push prices)
- **Buy**: Send USDC → receive synth at oracle price (0.3% fee)
- **Redeem**: Send synth → receive USDC at oracle price (0.3% fee)
- **No AMM pools**: Price is set by oracle, not by market forces

## Price Oracle

Prices are fetched from public financial data APIs and submitted on-chain by authorized keeper services. The oracle updates approximately every 60 seconds.

Each asset has:
- **maxStaleness**: Maximum time before a price is considered stale (60–180 seconds)
- **maxDeviation**: Maximum allowed price change per submission (guards against manipulation)

| Asset | maxStaleness | maxDeviation |
|-------|-------------|-------------|
| sAAPL | 120 seconds | 50% |
| sGOOGL | 120 seconds | 50% |
| sMSFT | 120 seconds | 50% |
| sTSLA | 120 seconds | 50% |
| sNVDA | 120 seconds | 50% |
| sWTI | 180 seconds | 50% |
| sGOLD | 180 seconds | 50% |
| sSILVER | 180 seconds | 50% |
| sNATGAS | 180 seconds | 50% |
| sGBPUSD | 120 seconds | 50% |

## Trading Limits

| Parameter | Value |
|-----------|-------|
| Max single transaction | 10,000,000 USDC |
| Fee rate | 0.3% (30 BPS) |
| Slippage protection | User-configurable |

## Restrictions

- **No liquidity provision**: RWA tokens cannot be added to AMM pools
- **USDC only**: RWA tokens can only be swapped against USDC
- **Oracle-gated pricing**: Swaps fail if the oracle price is stale
- **No token-to-token**: RWA tokens cannot be swapped against other RWA tokens or non-USDC tokens
