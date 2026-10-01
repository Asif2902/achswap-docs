---
sidebar_position: 1
---

# AchSwap on Arc Mainnet

AchSwap is a decentralized exchange for token swaps and V2/V3 liquidity on **Arc Mainnet (chain ID 5042)**. Its swap screen compares AchSwap's own router with LI.FI same-chain and KyberSwap quotes, and executes whichever leaves you the most after fees.

AchSwap's router covers the pools of every supported DEX on Arc:

- Uniswap V2, V3 and V4, including hooked pools;
- AchSwap V2 and V3;
- Synthra, UnitFlow, Slipstream and Lunya;
- DyorSwap, Architex, ACTFUN, SushiSwap V3, Bugle and FlutchPad.

It splits and chains trades across them, and every quote is simulated against the live contracts before you see it. A route executes in one transaction on `AchRouteExecutor`, which charges a single 0.25% fee on the output.

Start with [network setup](/getting-started/network-setup), then [swap](/achswap/swap) or [add liquidity](/achswap/add-liquidity). The [contract address reference](/technical/contract-addresses) lists every deployed contract. [Swap execution](/technical/swap-execution) explains how routes settle on chain.

Arc uses USDC for gas. The same USDC balance appears as a 6-decimal ERC-20 at `0x3600000000000000000000000000000000000000` and as an 18-decimal native currency. Pools and ordinary router calls use the ERC-20 form. AchSwap routes accept either, so USDC can be paid straight from your balance without an approval.

[Gasless swaps](/achswap/gasless) let you pay with USDC, EURC or cirBTC by signing once while a relayer pays the gas. AchSwap's own V4 liquidity contracts are not deployed on this network. Uniswap V4 pools are a separate protocol that AchSwap routes through.
