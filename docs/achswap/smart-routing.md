---
sidebar_position: 2
---

# Smart routing

Every swap is quoted by AchSwap's own router and by LI.FI and KyberSwap. The app shows, and executes, whichever route leaves you the most **net output** after all fees. No router can use liquidity it cannot see, so the result is the best of these three, not a universal guarantee.

## AchSwap's router

AchSwap keeps an index of every liquidity pool on Arc, currently around 270,000, and updates their prices and liquidity every block from on-chain events. When you ask for a quote, the router:

- checks direct pools and routes through deep intermediate tokens such as USDC, EURC and cirBTC, up to three hops;
- splits a trade across several pools and routes when the split pays more, including different DEXs in one trade;
- prices every candidate with the same integer math the pools themselves use;
- runs the finished route as a simulation of the real transaction before showing it, and only shows it if the result matches the quote to the unit. The amount you see is what the contract produces if the pools do not move before you sign.

Tokens with transfer taxes or transfer restrictions are not routed by AchSwap's router; LI.FI or KyberSwap may still quote them.

Quotes normally take a fraction of a second. The first quote for a token the router has not loaded yet can take a second or two.

## What executes

An AchSwap route executes in **one transaction** on the `AchRouteExecutor` contract:

- Every split and hop runs atomically. If any part fails, the whole swap reverts and you keep your tokens.
- The AchSwap fee is **0.25% of the final output, charged once**, not per hop or per split. It goes to the AchSwap treasury Safe.
- You receive at least the minimum set by your slippage tolerance, or the swap reverts.
- USDC can be paid directly from your balance, with no approval transaction.
- Gasless swaps work on AchSwap routes too, for USDC, EURC and cirBTC inputs. See [gasless](/achswap/gasless).

## Liquidity sources

| Source | Status |
| --- | --- |
| Uniswap V2, V3, V4 (hookless) | Live |
| AchSwap V2, V3 | Live |
| Synthra V3, UnitFlow V3 | Live |
| Aerodrome-style Slipstream pools (four factories) | Activating 2 October 2026 |
| Uniswap V4 pools with hooks (e.g. launchpad tokens) | Activating 2 October 2026 |
| Other V2 and V3 forks with liquidity | Activating 2 October 2026 |
| Lunya pools | Activating 2 October 2026 |

The sources marked "Activating" are already deployed. The route executor enforces a two-day security delay before new execution adapters can be used; from then on the router includes them automatically. A source only contributes when it actually has a pool with usable liquidity for your pair.

## Route details

The route map in trade details shows each split, its share of your input, and the pools on its path. Routes and amounts can change whenever the quote refreshes. Always review the current quote right before signing.

Technical details are in [routing engine](/technical/routing-engine).
