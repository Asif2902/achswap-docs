---
sidebar_position: 3
title: Arc Mainnet network setup
sidebar_label: Network setup
description: "Add Arc Mainnet (chain ID 5042) to your wallet: RPC URL, block explorers, and how USDC works as both an ERC-20 token and the gas currency."
---

# Network setup

AchSwap runs on **Arc Mainnet**. Most wallets add it automatically when the app asks. If yours doesn't, add it with these values:

| Wallet field | Value |
| --- | --- |
| Network name | Arc Mainnet |
| Chain ID | `5042` (`0x13b2`) |
| RPC URL | `https://rpc.mainnet.arc.io` |
| Currency symbol | USDC |
| Block explorer | [explorer.arc.io](https://explorer.arc.io) |

Check the chain ID before you transact. A network with the right name but a different chain ID is not Arc Mainnet.

Arc has two block explorers: [explorer.arc.io](https://explorer.arc.io) (Blockscout) and [ArcScan](https://arc.etherscan.io). Both show transactions and balances. AchSwap's contract sources are verified on ArcScan, which is why these docs link there.

## How USDC works on Arc

Arc uses USDC to pay network fees. That makes USDC special in two ways.

**It is both a token and gas.** The USDC you trade is the same balance your fees are paid from. Spend all of it and you can't pay for your next transaction. Keep a little back.

**It shows up in two forms.** The same balance can be read as:

| Form | Address | Decimals | Used by |
| --- | --- | --- | --- |
| ERC-20 | `0x3600000000000000000000000000000000000000` | 6 | Pools, approvals, most contracts |
| Native currency | none (sent as transaction value) | 18 | Gas, plain transfers |

These are two views of one balance, not two tokens. For example, 2.5 USDC is `2500000` in the ERC-20 form and `2500000000000000000` in the native form. Sending from either one lowers the same balance.

What this means in practice:

- Don't add a "wrapped USDC" token for Arc. There isn't one to add.
- If your wallet shows USDC twice, both entries are the same money.
- AchSwap routes accept USDC in either form, which is why a USDC swap needs no approval.

## Getting funds onto Arc

If your assets are on another chain, use the [Bridge](/achswap/bridge) to move them to Arc. Bridging USDC to Arc gives you both something to trade and the gas to trade with.

## Common tokens

| Token | Address | Decimals |
| --- | --- | --- |
| USDC | `0x3600000000000000000000000000000000000000` | 6 |
| EURC | `0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1` | 6 |
| cirBTC | `0x171A4217b86A807A64eB94757Db6849fb4bDbAA0` | 8 |

The full list, with the protocol contracts, is in the [contract reference](/technical/contract-addresses#tokens).
