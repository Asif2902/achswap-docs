---
sidebar_position: 1
---

# AchSwap on Arc Mainnet

AchSwap is a decentralized exchange for token swaps and V2/V3 liquidity on **Arc Mainnet (chain ID 5042)**. Its swap screen compares AchSwap aggregator routes with LI.FI same-chain quotes. The aggregator can combine liquidity across registered DEXs; a quoted route can still change as pool state changes.

Start with [network setup](/getting-started/network-setup), then [swap](/achswap/swap) or [add liquidity](/achswap/add-liquidity). The [contract address reference](/technical/contract-addresses) lists deployed contracts and all seven active adapters.

Arc uses USDC for gas. The same USDC balance is exposed as a 6-decimal ERC-20 at `0x3600000000000000000000000000000000000000` and as an 18-decimal native currency. Pools and ordinary router calls use the ERC-20 form; the aggregator's native-USDC path can accept `msg.value`.

AchSwap's own V4 liquidity and gasless swap features are not deployed on this network. The registered **Uniswap V4** routing adapter is a separate integration; a registered adapter alone does not imply an available pool.
