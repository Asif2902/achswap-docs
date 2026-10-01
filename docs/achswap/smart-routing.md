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
| Slipstream pools: Aero CL, Archery, Topaz | Live |
| Lunya concentrated and constant-product pools | Live |
| DyorSwap, Architex, SushiSwap V3, Bugle | Live |
| Three unnamed Uniswap V2, Uniswap V3 and Slipstream forks | Live |

A source contributes only when it has a pool with usable liquidity for your trade. New sources are added through the route executor's two-day security delay.

## Route details

Next to the exchange rate, the app shows the logo of the provider that found the route, followed by the logos of every DEX the route trades on. Protocols without a published logo show their initials.

Open **Trade details** to see:

- **Route:** each split with its share of your input, and every hop's DEX, pool fee and pool address. A shield marks a pool that was checked:
  - On AchSwap routes, the executor resolves every pool on chain from a known factory.
  - On KyberSwap and LI.FI routes, each pool is checked against AchSwap's index of known factories. A warning marks a pool from a factory AchSwap does not track.
  - LI.FI does not name its pools, so the app finds them by simulating LI.FI's exact transaction.
- **Quoted by:** what AchSwap's router, KyberSwap and LI.FI each quoted for the same trade, which one is best, and how far behind the others are. If a provider did not quote, it says why (for example, LI.FI needs a connected wallet).
- **Network cost:** the route's gas estimate at Arc's current gas price.

Turn on **Detailed route** in your account menu for an interactive map of the same route. Routes and amounts can change whenever the quote refreshes, so always review the current quote right before signing.

Technical details are in [routing engine](/technical/routing-engine).
