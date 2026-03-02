---
sidebar_position: 1
---

# Introduction

Welcome to the AchSwap and AchMarket documentation. This guide covers everything you need to know about our decentralized ecosystem on ARC Testnet.

## What is AchSwap?

**AchSwap** is a modern decentralized exchange (DEX) that combines the best of Uniswap V2 and V3 mechanics. Built on ARC Testnet, it provides:

- **Smart Routing**: Automatically finds the best swap rates across V2 and V3 pools
- **Concentrated Liquidity**: Earn more fees with targeted liquidity positions
- **Cross-Chain Bridging**: Move USDC between chains via Circle's CCTP

## What is AchMarket?

**AchMarket** is a decentralized prediction market platform where users can:

- **Create Markets**: Set up prediction markets on any real-world event
- **Trade Outcomes**: Buy and sell shares based on event outcomes
- **Resolve Markets**: Market creators resolve markets with proof
- **Earn Fees**: Platform earns 0.25% on resolved markets only

## Key Features

### For AchSwap
| Feature | Description |
|---------|-------------|
| Token Swap | Exchange tokens with smart routing |
| V2 Pools | Classic AMM liquidity pools |
| V3 Pools | Concentrated liquidity positions |
| Cross-Chain | Bridge USDC via CCTP |

### For AchMarket
| Feature | Description |
|---------|-------------|
| Market Creation | Create prediction markets |
| Trading | Buy/sell outcome shares |
| LMSR Pricing | Dynamic pricing based on volume |
| Resolution | Resolve with proof, claim winnings |

## Network Information

Both applications run on **ARC Testnet**:

| Parameter | Value |
|-----------|-------|
| Network Name | ARC Testnet |
| Chain ID | 5042002 (hex: 0x4CEC52) |
| RPC URL | https://arc-testnet.drpc.org/ |
| Explorer | https://testnet.arcscan.app |
| Native Token | USDC |

## Getting Started

1. **Set up your wallet** - Install MetaMask or use RainbowKit
2. **Switch to ARC Testnet** - Add the network to your wallet
3. **Get USDC** - Use the bridge to transfer USDC from other testnets
4. **Start trading** - Swap tokens or create/participate in prediction markets

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      ARC Testnet                            │
│                    (Chain ID: 5042002)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐│
│  │    AchSwap v3      │    │       AchMarket             ││
│  │                    │    │                             ││
│  │ • Swap Router      │    │ • PredictionMarketFactory  ││
│  │ • V2 Factory       │    │ • PredictionMarket         ││
│  │ • V3 Factory       │    │ • LMSR Math                ││
│  │ • Position Manager │    │                             ││
│  └─────────────────────┘    └─────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Support

- GitHub: [github.com/Asif2902](https://github.com/Asif2902)
- Documentation: [docs.achswap.com](https://docs.achswap.com)
