---
sidebar_position: 3
---

# Network setup

AchSwap's mainnet deployment is on **Arc Mainnet**, chain ID **5042** (`0x13b2`).

| Wallet field | Value |
| --- | --- |
| Network name | Arc Mainnet |
| Chain ID | `5042` |
| RPC URL | `https://niorfun.com/api/rpc` |
| Currency symbol | USDC |
| Block explorer | [explorer.arc.io](https://explorer.arc.io) |

The RPC above is configured in the current AchSwap frontend and returned chain ID `5042` when checked on 14 September 2026. Wallets that support Arc may add the network automatically; otherwise enter these fields manually and verify the chain ID before transacting.

Arc's gas currency uses 18-decimal native units. The tradable USDC ERC-20 is [`0x3600000000000000000000000000000000000000`](https://explorer.arc.io/address/0x3600000000000000000000000000000000000000) with **6 decimals**. They reflect the same balance at different decimal scales. Do not add a separate wrapped-USDC token for this deployment.
