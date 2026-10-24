---
sidebar_position: 8
description: "How Automatic mode's agent wallet works on chain: MetaMask Delegation Framework v1.3.0 on Arc, the four permissions and their caveats, what AchSwap checks off chain, and the trust model."
---

# Agent wallet permissions

[Automatic mode](/ai/automatic-mode) trades from an **agent wallet**: a smart account owned by the user's wallet, built on MetaMask's Delegation Framework v1.3.0. The user signs permissions (delegations) from the agent wallet to AchSwap's relayer. Each permission lists exactly what may be done; the relayer redeems it through MetaMask's DelegationManager, which checks every condition (caveat) on every call.

## The contracts

The agent wallet is a `HybridDeleGator` created by MetaMask's `SimpleFactory` at an address derived from the owner's address. These contracts are MetaMask's, not AchSwap's; AchSwap deployed none of them.

| Contract | Address |
| --- | --- |
| DelegationManager | [`0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3`](https://arc.etherscan.io/address/0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3) |
| SimpleFactory | [`0x69Aa2f9fe1572F1B640E1bbc512f5c3a734fc77c`](https://arc.etherscan.io/address/0x69Aa2f9fe1572F1B640E1bbc512f5c3a734fc77c) |
| HybridDeleGator (implementation) | [`0x48dBe696A4D990079e039489bA2053B36E8FFEC4`](https://arc.etherscan.io/address/0x48dBe696A4D990079e039489bA2053B36E8FFEC4) |
| LogicalOrWrapperEnforcer | [`0xE1302607a3251AF54c3a6e69318d6aa07F5eB46c`](https://arc.etherscan.io/address/0xE1302607a3251AF54c3a6e69318d6aa07F5eB46c) |
| AllowedTargetsEnforcer | [`0x7F20f61b1f09b08D970938F6fa563634d65c4EeB`](https://arc.etherscan.io/address/0x7F20f61b1f09b08D970938F6fa563634d65c4EeB) |
| AllowedMethodsEnforcer | [`0x2c21fD0Cb9DC8445CB3fb0DC5E7Bb0Aca01842B5`](https://arc.etherscan.io/address/0x2c21fD0Cb9DC8445CB3fb0DC5E7Bb0Aca01842B5) |
| AllowedCalldataEnforcer | [`0xc2b0d624c1c4319760C96503BA27C347F3260f55`](https://arc.etherscan.io/address/0xc2b0d624c1c4319760C96503BA27C347F3260f55) |
| ValueLteEnforcer | [`0x92Bf12322527cAA612fd31a0e810472BBB106A8F`](https://arc.etherscan.io/address/0x92Bf12322527cAA612fd31a0e810472BBB106A8F) |
| ERC20PeriodTransferEnforcer | [`0x474e3Ae7E169e940607cC624Da8A15Eb120139aB`](https://arc.etherscan.io/address/0x474e3Ae7E169e940607cC624Da8A15Eb120139aB) |
| TimestampEnforcer | [`0x1046bb45C8d673d4ea75321280DB34899413c069`](https://arc.etherscan.io/address/0x1046bb45C8d673d4ea75321280DB34899413c069) |
| RedeemerEnforcer | [`0xE144b0b2618071B4E56f746313528a669c7E65c5`](https://arc.etherscan.io/address/0xE144b0b2618071B4E56f746313528a669c7E65c5) |

Their source is not verified on ArcScan. They sit at the same addresses as MetaMask's deployments on Ethereum, where it is. On 24 October 2026 their Arc bytecode was compared with Ethereum's: identical for the factory and every enforcer; for the DelegationManager and HybridDeleGator, identical except the chain ID and the EIP-712 domain separator derived from it, which each deployment fixes for its own chain.

## The permissions

Every permission allows no value transfer, can be redeemed only by AchSwap's listed relayers, and expires after a year. The three trading permissions are each a list of actions (LogicalOrWrapperEnforcer): a redemption names one action, and the chain checks all of that action's caveats.

| Permission | Action | Allowed, and nothing else |
| --- | --- | --- |
| Trading | swap | `AchRouteExecutorV2.execute`, paying the agent wallet, with no partner fee |
| Trading | approve | `approve(spender, amount)` on a token, the spender AchRouteExecutorV2, AchSwap's V2 router, the V3 position manager or LI.FI's Arc diamond |
| Liquidity | V2 add / remove | The V2 router's `addLiquidity` / `removeLiquidity`, to the agent wallet |
| Liquidity | V3 mint / collect | The position manager's `mint` / `collect`, to the agent wallet |
| Liquidity | V3 decrease | `decreaseLiquidity`, which the position manager allows only on the agent wallet's own positions. `increaseLiquidity` is not allowed: it accepts any position |
| Bridges | Across, Polymer, LayerSwap | LI.FI's `swapAndStartBridgeTokensVia{AcrossV4,PolymerCCTP,LayerSwap}` in the layout LI.FI builds from Arc: the receiver the owner's wallet, no destination call, one source step whose fees go only to LI.FI's and AchSwap's fee wallets, refunds to the agent wallet |
| Gas | transfer | USDC `transfer` to AchSwap's gas wallet only, at most 1 USDC per day |

A bridge whose calldata differs from the pinned layout reverts on chain; AchSwap refuses it before sending. Every action was tested on Arc Mainnet state with real calls and LI.FI's real calldata (an `eth_simulateV1` simulation, nothing sent): each one works, and paying anyone else, a partner fee, a changed refund or fee recipient, a destination call, another LI.FI function, another redeemer, `increaseLiquidity` and anything after a revoke all revert.

## What AchSwap checks off chain

The chain fences where funds can go and what can be called. It does not check prices or the user's limits; AchSwap's API does, before anything is sent:

- the AI app's session: signed by the owner, not stopped, not expired;
- the limits the owner signed: per trade, per 24 hours across all their AI apps, slippage, verified tokens only;
- swaps: built from AchSwap's router plan and refused when the price impact is above the slippage; the minimum received is enforced by the executor;
- bridges: LI.FI's quote through the three covered bridges, checked byte by byte against the bridge permission, and refused when LI.FI's guaranteed output is worth less than the input minus its fees and the slippage;
- liquidity: each step decoded and checked (recipients, minimums against the pool, the pool's price against the market);
- gas: enough USDC in the agent wallet and room in the day's gas allowance.

Transactions then go out one at a time, each simulated first, the next only after the last is confirmed.

## Gas

The relayer pays each transaction's gas and takes back exactly the receipt's gas used times its effective gas price, in USDC, through the gas permission. It collects once about 0.05 USDC is owed (or a smaller leftover after a week without transactions), and never more than the day's allowance.

## Trust model

- **Whatever AchSwap's servers do,** funds cannot leave the agent wallet except to AchSwap's contracts, the owner's own wallet (bridges), the two bridge fee wallets and the gas wallet (at most the daily gas allowance), and nothing works after the owner revokes.
- **A compromised relayer key or API server** could send transactions inside those fences at bad prices, up to what the agent wallet holds. The limits and price checks are AchSwap's, not the chain's.
- **The AI app** acts without asking in Automatic mode, so text it reads (a token's name, a web page) could try to steer it. The limits, verified tokens only by default and the price checks bound what that can cost.
- **The owner** can withdraw, stop an AI app or revoke every permission at any time, with their own wallet. Revoking disables the permissions in the DelegationManager; no AchSwap server can undo it.

See [security](/technical/security#automatic-mode) for the rest of AchSwap's security model.
