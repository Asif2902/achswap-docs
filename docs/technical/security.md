---
sidebar_position: 9
title: Security
description: Trust assumptions, approvals, gasless authorization, verification status and known limitations.
---

# Security

This page sets out what AchSwap's contracts enforce, what you are trusting when you use AchSwap, and what is outside AchSwap's control. It describes the contracts live on Arc Mainnet (chain ID `5042`). Addresses are in the [contract reference](/technical/contract-addresses).

## Audit and verification status

| | Status |
| --- | --- |
| Independent third-party audit | **None published.** AchSwap's contracts have had internal security reviews by the AchSwap team. An internal review is not an independent audit. |
| Source verification | Every live AchSwap contract except one is source-verified on [ArcScan](https://arc.etherscan.io): you can read the code that runs and check it matches the deployed bytecode. The exception is the Virtuals adapter (adapter 6), [`0x4166…c106`](https://arc.etherscan.io/address/0x416660F95772Eb502E1B3E18025477EAF551c106), which is live but **not yet verified** (checked 10 October 2026). |

Source verification shows you what the code is. It says nothing about whether the code is safe. Decide for yourself how much to trust any smart contract.

## What the swap contracts enforce

For an AchSwap route, the [route executor](/technical/swap-execution) guarantees, in code:

- **It only spends your input.** It pulls tokens from the address that calls it, and only the input amount of that call.
- **Your minimum is enforced on what you actually receive.** The executor measures the recipient's balance before and after, after all fees. Below your minimum, the whole transaction reverts.
- **One fee, capped.** 0.25% of the final output, paid straight to the AchSwap treasury Safe in the same transaction. The contract caps it at 1%. An increase waits two days, and a transaction built under the old fee reverts instead of paying the new one.
- **Nothing is held.** There is no vault and no balance between transactions; leftovers of a call are refunded in that call.
- **Changes are delayed.** New adapters and fee increases take effect two days after they are scheduled, so they are visible on chain before they apply. The owner can pause execution or disable an adapter immediately.

KyberSwap and LI.FI routes execute on those providers' own contracts. Their minimums are enforced by their contracts, not AchSwap's.

## Approvals

An approval lets a contract move a token from your wallet, up to an amount. On AchSwap:

| Action | Spender you approve | Amount the app asks for |
| --- | --- | --- |
| Swap on an AchSwap route | AchRouteExecutor `0x1B84…d314` | The swap's input |
| Swap on a KyberSwap route | KyberSwap's router | The swap's input |
| Swap on a LI.FI route | LI.FI's contract | The swap's input |
| First gasless swap with a token | Permit2 `0x0000…8BA3` | Unlimited (the largest amount Permit2 accepts), once per token |
| Add liquidity | AchSwap's V2 router or V3 position manager | The deposit |

The swap page has an **Enable unlimited approval** switch, off by default. With it on, swap approvals are for an unlimited amount, so later swaps of that token skip the approval step; the trade-off is that the spender can move any amount of that token while the approval stands.

USDC needs no approval on AchSwap routes: it can be paid from your native balance.

An approval stays in place after the swap. Review and revoke approvals you no longer need from your wallet or an explorer's approval tool. Approving Permit2 lets anyone with a valid **signature from you** move that token through Permit2, so only sign Permit2 messages on sites you trust, and read what they authorize.

## Gasless authorization

A gasless swap is authorized by one Permit2 signature that covers the whole swap: token and amount in, the executor as spender, the target contract, the token out, your minimum, the recipient, any value, and a hash of the exact call. See [gasless architecture](/technical/gasless#the-signature) for the signed structure.

- **The relayer cannot change the trade.** The executor rebuilds the signed data from the order it receives. A changed field makes Permit2 reject the signature.
- **One use only.** Each signature carries a Permit2 nonce that can be used once.
- **Expiry.** The signature carries a deadline. The contract refuses an expired order, and AchSwap's relay refuses deadlines more than three hours ahead.
- **Restricted reach.** The executor only pulls allowlisted input tokens and only calls allowlisted targets (KyberSwap, LI.FI, AchRouteExecutor) through allowlisted relayers.
- **Your minimum on your balance.** The executor checks your actual balance increase against the signed minimum.

The relayer can choose **not** to submit a signed order. Until the deadline passes, a signed order could still be submitted. To cancel one, invalidate its nonce on Permit2 (`invalidateUnorderedNonces`), or wait for it to expire.

## What the owners can and cannot do

| Contract | The owner can | The owner cannot |
| --- | --- | --- |
| AchRouteExecutor | Pause. Disable an adapter. Add an adapter after a 2-day delay. Lower the fee at once, or raise it after a 2-day delay, up to 1%. Change the fee recipient after a 2-day delay, with the new recipient's acceptance. | Move user funds. Apply a new fee to a transaction built under the old one. Point an existing adapter id at different code. Renounce ownership. |
| Execution adapters | Deny a Uniswap V4 hook (adapter 4). | Change factories, fees or callback settings. Call an adapter directly: only the executor can. |
| AchSponsoredExecutorV3 | Curate input tokens, targets, spenders and relayers. Pause. Recover tokens or native USDC left in the contract. | Change a signed swap, or pull more than the signed amount. |

The executors hold nothing between transactions, so the gasless executor's recovery functions only reach tokens sent to it by mistake.

Contract ownership currently sits with AchSwap's deployer address, not a multisig. The fee recipient is the AchSwap treasury Safe.

## Simulation and its limits

AchSwap simulates transactions before showing them: the router executes each AchSwap route as an `eth_call`, the Developer API simulates `/swap` transactions from the sender, and the gasless relay simulates every order before submitting it.

Simulation reflects the chain at one block. It cannot promise the result of a transaction mined later: if the pools move, the transaction pays a different amount, or reverts if that is below your minimum. A simulation can also fail to run (the API then says `simulated: false`). Your on-chain minimum is the protection that always applies.

## External dependencies

AchSwap relies on services it does not control:

| Dependency | What it affects |
| --- | --- |
| Arc Mainnet and its RPC endpoints | Every quote and transaction. |
| KyberSwap and LI.FI | Their quotes, routes and contracts. Their routes can fill through DEXs AchSwap does not index. |
| LI.FI's bridges | Bridge transfers, timing and refunds. |
| DEX pools and Uniswap V4 hooks | Liquidity and prices. A hook can change fees during a swap; AchSwap can deny a hook from its own routes. |
| Token contracts | A token can pause, block or tax transfers. AchSwap's router refuses tokens it can't settle exactly. |
| DEX Screener | Market data on the Explore page. |

## Reporting a vulnerability

Email **[support@achswap.app](mailto:support@achswap.app)** with the subject "Security". Please report privately and give the team time to respond before disclosing. Don't include private keys or seed phrases.
