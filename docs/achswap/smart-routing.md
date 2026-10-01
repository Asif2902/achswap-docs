---
sidebar_position: 3
---

# Smart routing

Every swap is quoted by AchSwap's own router and by LI.FI and KyberSwap. The app shows and executes whichever route leaves you the most **net output** after all fees. No router can use liquidity it cannot see, so the result is the best of these three, not a guarantee of the best price anywhere.

## AchSwap's router

AchSwap's router covers the pools of every supported DEX on Arc. When you ask for a quote, it:

- checks direct pools and routes through deep intermediate tokens such as USDC, EURC and cirBTC, up to three hops;
- splits a trade across several pools and routes when the split pays more, including different DEXs in one trade;
- prices every candidate with the same integer math the pools themselves use;
- simulates the finished route as the real transaction before showing it, and shows it only if the result matches the quote to the unit.

The amount you see is what the contract pays out if the pools do not move before you sign.

AchSwap's router does not route tokens with transfer taxes or transfer restrictions. LI.FI or KyberSwap may still quote them.

Quotes normally take a fraction of a second. The first quote for a token the router has not seen before can take a second or two.

## What executes

An AchSwap route executes in **one transaction** on the `AchRouteExecutor` contract:

- Every split and hop runs atomically. If any part fails, the whole swap reverts and you keep your tokens.
- The AchSwap fee is **0.25% of the final output, charged once**, not per hop or per split. It goes straight to the AchSwap treasury Safe in the same transaction.
- You receive at least the minimum set by your slippage tolerance, measured on your actual balance, or the swap reverts.
- USDC can be paid directly from your balance, with no approval transaction.
- Gasless swaps work on AchSwap routes too, for USDC, EURC and cirBTC inputs. See [gasless](/achswap/gasless).

How the contract executes a route is described in [swap execution](/technical/swap-execution).

## Liquidity sources

| Source | Status |
| --- | --- |
| Uniswap V2, V3 and V4, including V4 pools with hooks | Live |
| AchSwap V2 and V3 | Live |
| Synthra V3 and UnitFlow V3 | Live |
| Slipstream pools, including Aero CL (four factories) | Live |
| Lunya concentrated and constant-product pools | Live |
| Other V2 and V3 forks with liquidity | Live |

A source contributes only when it has a pool with usable liquidity for your trade. New sources are added through the route executor's two-day security delay.

## Route details

In **Trade details**, the routing map shows each split, its share of your input, and the pools on its path. To see it, turn on **Detailed route** in your account menu. Routes and amounts can change whenever the quote refreshes, so always review the current quote right before signing.

Technical details are in [routing engine](/technical/routing-engine).
