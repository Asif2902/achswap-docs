---
sidebar_position: 7
description: "Answers to common questions about AchSwap on Arc: USDC, routing, quotes, fees, gasless swaps, contracts, bridging, liquidity and XP."
---

# Frequently asked questions

For step-by-step help with a failed swap, approval, gasless swap, bridge, liquidity position or missing XP, see [troubleshooting](/help/troubleshooting).

### Which network does this documentation cover?

**Arc Mainnet**, chain ID **5042**. See [network setup](/getting-started/network-setup).

### Why does USDC appear as both native and ERC-20?

Arc exposes the same balance in two forms: an 18-decimal gas currency, and a 6-decimal ERC-20 at `0x3600000000000000000000000000000000000000`. Pools and ordinary router calls use the ERC-20 form. AchSwap routes accept either, so you can pay USDC straight from your balance without an approval. See [network setup](/getting-started/network-setup).

### Which DEXs does AchSwap route through?

- Uniswap V2, V3 and V4 (including V4 pools with hooks);
- AchSwap V2 and V3;
- Synthra V3 and UnitFlow V3;
- Slipstream pools: Aero CL (two factories), Archery and Topaz;
- Lunya;
- DyorSwap, Architex, SushiSwap V3, Bugle and FlutchPad;
- Virtuals launch curves.

A pool still needs usable liquidity for your pair. See [smart routing](/achswap/smart-routing) and the [factory list](/technical/contract-addresses#configured-factories).

### Why did my quote change?

Pool reserves, active liquidity and the routes that providers return all change over time. A refresh can find a better path or lose an earlier one. Review the current output and route before signing.

### Can I trust the quoted amount?

An AchSwap quote is shown only after its exact transaction has been simulated against the live contracts and produced the quoted amount to the unit. If pools move before your transaction is mined, you receive the new amount, or the transaction reverts if that falls below your minimum. See [routing engine](/technical/routing-engine#verification).

### Why is AchSwap's route best when another provider quotes more?

The app compares what each route is expected to deliver, not the headline numbers. Each route's network cost is taken off its quote: gas on Arc is paid in USDC from your wallet, so a route that needs more gas leaves you with less. KyberSwap's quote also loses the 0.12 bp its transactions were measured to deliver below it. On small trades the gas difference often decides. The percentage next to each other provider shows how far behind it is after these adjustments. See [how the best route is chosen](/achswap/smart-routing#how-the-best-route-is-chosen).

### What does Fee APR on a pool page mean?

The pool page is built but not live yet. Once it is, Fee APR is the pool's trading fees from the last 24 hours, multiplied by 365 and divided by the pool's current TVL. It shows what liquidity has earned recently, not what it will earn: one busy day makes it high, a quiet day low. It also leaves out price movement between the two tokens, which can outweigh fees. See [pools](/achswap/pools#stats).

### My V3 position doesn't show up. How do I find it?

Make sure the wallet that created it is connected. If it still doesn't appear, open **My Positions** and use **Import Position by Token ID** with the position's NFT ID, which you can find in the transaction that created it. See [remove liquidity](/achswap/remove-liquidity#find-your-positions).

### Why don't the Analytics figures match a pool's volume?

They count different things. (The pool page and the new Analytics page are built but not live yet.) A pool page counts every swap through that pool, including trades routed into it from other apps. The Analytics page counts trades made through AchSwap, across every pool and provider they used. See [analytics](/achswap/analytics#how-this-differs-from-pool-figures).

### Why does AchSwap not route my token?

The route executor requires every transfer to move exactly the requested amount. Tokens with transfer taxes, rebasing balances or transfer restrictions cannot meet that rule, so AchSwap does not route them. KyberSwap or LI.FI may still offer a quote.

### What is the AchSwap fee, and where does it go?

AchSwap routes charge 0.25% of the final output, once per swap, however many hops or splits the route uses. It is paid in the same transaction to the AchSwap treasury Safe. See [fees](/technical/fee-structure).

### How does exact output work?

When you enter the amount to receive, AchSwap's router finds the smallest input that reaches it. The swap then spends that input plus your slippage tolerance and guarantees at least the requested amount. If the price holds, you receive slightly more. Only AchSwap's router offers exact output. See [exact output](/technical/routing-engine#exact-output).

### Does AchSwap have gasless swaps on Arc Mainnet?

Yes. With gasless mode on, swaps from USDC, EURC or cirBTC through KyberSwap, LI.FI or AchSwap's router need one signature, and a relayer pays the gas. The first gasless swap of a token needs a one-time Permit2 approval. See [gasless swaps](/achswap/gasless).

### Are the contracts verified?

Almost all. Every live AchSwap contract is source-verified on [ArcScan](https://arc.etherscan.io) except the Virtuals adapter (adapter 6), which is live but not yet verified (checked 10 October 2026). Source verification is not an audit: see [security](/technical/security#audit-and-verification-status). See [contract addresses](/technical/contract-addresses).

### Does AchSwap have V4 liquidity on Arc Mainnet?

AchSwap's own V4 liquidity contracts are not deployed on Arc Mainnet. AchSwap routes through Uniswap V4 pools, which belong to Uniswap.

### Can I bridge to and from Arc?

Yes. The Bridge uses LI.FI, which routes to and from Arc through several bridges. A route has to exist for the exact chains, tokens and amount: if none appears, try another amount or token. Same-chain Arc swaps are separate.

### Why did my transaction revert?

Common causes:

- the price moved below your minimum output;
- the deadline expired;
- the balance or allowance was too low;
- liquidity was insufficient.

Refresh the quote and inspect the wallet transaction before you raise slippage.

### How do I earn XP?

Swap, bridge, provide liquidity in USDC/EURC, USDC/Circle BTC, USDC/Gold or USDC/WETH pools, say GM daily, complete tasks and invite friends. Task and GM XP is added at once; swaps, bridges and liquidity every day after 00:00 UTC. There is nothing to claim. XP is counted and added daily already; the Quests page where you see it is not public yet. XP is not a token and has no monetary value. See [Quests and XP](/quests/overview) and [how to earn XP](/quests/earning-xp).

### Is there an API for developers?

Yes: the [Developer API](/developers/developer-api) returns AchSwap quotes and ready-to-sign swap transactions on Arc, with an optional fee for your application. Email [support@achswap.app](mailto:support@achswap.app) for a key.

### How do I contact AchSwap?

Email [support@achswap.app](mailto:support@achswap.app), or reach us on [X](https://x.com/AchProtocol) and [Telegram](https://t.me/AchProtocol).
