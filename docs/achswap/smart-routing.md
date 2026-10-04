---
sidebar_position: 3
---

# Smart routing

Every swap is quoted by AchSwap's own router and by LI.FI and KyberSwap. The app shows and executes the route expected to leave you the most, after all fees and the network cost: see [how the best route is chosen](#how-the-best-route-is-chosen). No router can use liquidity it cannot see, so the result is the best of these three, not a guarantee of the best price anywhere.

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
| Slipstream pools: Aero CL (two factories), Archery, Topaz | Live |
| Lunya concentrated and constant-product pools | Live |
| DyorSwap, Architex, SushiSwap V3, Bugle, FlutchPad | Live |

A source contributes only when it has a pool with usable liquidity for your trade. New sources are added through the route executor's two-day security delay.

## How the best route is chosen

The three providers do not produce their quotes the same way, so the app does not simply take the largest number. It compares what each route is **expected to deliver** to your wallet:

1. **Start from the quote.** Each provider's quoted output already has the pool fees and the AchSwap fee (0.25%) taken off.
2. **Take off the network cost.** On Arc, gas is paid in USDC from the same wallet, so a route that needs more gas leaves you with less. Each route's own gas estimate is priced at Arc's current gas price, converted into the token you receive, and subtracted from its quote.
3. **Take 0.12 bp off KyberSwap's quote.** AchSwap's quote is exact for the moment it was made: before it is shown, its route is simulated against the live contracts, and the quote is what that simulation paid out. KyberSwap's quote comes from KyberSwap's own model. When AchSwap measured KyberSwap's transactions in October 2026, they delivered 0.10–0.12 bp less than their quotes on every route checked, so 0.12 bp is taken off KyberSwap's quote to compare like with like. LI.FI's quote is used as it is.
4. **The highest wins.** The route expected to deliver the most is used. If another provider comes out ahead of AchSwap's verified quote by 0.3 bp or less, AchSwap's route is used: a difference that small is within the margin of error of an estimated quote, while AchSwap's has already been checked on chain.

A basis point (bp) is 0.01%, so 0.12 bp is 0.0012% and 0.3 bp is 0.003%. Both values are settings and may change as new measurements come in.

Gas matters most on small trades. On a swap of a dollar or two, a route that needs much more gas can cost more in gas than its better price earns. On a large trade, gas is a tiny share of the amount, and the better price wins.

That is why a provider can quote a higher amount and still not be the best route. For example, on a swap of 1 USDC for EURC, KyberSwap quoted 0.886963 EURC and AchSwap's router 0.886684 EURC: KyberSwap's number was about 0.03% higher. But KyberSwap's route needed more gas, and on a trade this small the extra gas was worth about 0.07% of it. After the network cost, AchSwap's route was expected to deliver about 0.04% more, so it was marked **Best** and KyberSwap showed **−0.04%**.

Some routes are left out before the comparison: a KyberSwap or LI.FI route through a token that takes a fee on transfers, or through a DEX that AchSwap has blocked. If such a route is the only one, it is shown with a warning. Exact-output trades are quoted only by AchSwap's router, so there is nothing to compare.

## Route details

Next to the exchange rate, the app shows the logo of the provider that found the route, followed by the logos of every DEX the route trades on. Protocols without a published logo show their initials.

Open **Trade details** to see the exchange rate, price impact, minimum received, slippage and the **network cost**: the route's gas estimate at Arc's current gas price.

Turn on **Detailed route** in your account menu to also see the route and every provider's quote.

**The route** is shown as **Text** or as a **Map** (one at a time):

- Each split with its share of your input, and every hop's DEX, pool fee and pool address.
- A shield marks a pool that was checked:
  - On AchSwap routes, the executor resolves every pool on chain from a known factory.
  - On KyberSwap and LI.FI routes, each pool is checked against AchSwap's index of known factories. A warning marks a pool from a factory AchSwap does not track.
  - LI.FI does not name its pools, so the app finds them by simulating LI.FI's exact transaction.

**You receive, after gas** lists what the routes of AchSwap's router, KyberSwap and LI.FI each leave you for the same trade once their gas is paid: the figure the routes are ranked by.

- Under each amount: the provider's own quote, the route's gas in USDC, and for KyberSwap the 0.12 bp taken off its quote.
- **Best** marks the route the app uses.
- The percentage next to another provider is how far behind it is. See [how the best route is chosen](#how-the-best-route-is-chosen).
- If a provider did not quote, it says why (for example, LI.FI needs a connected wallet).

For an exact-output trade, the list shows the input each provider quoted instead.

Routes and amounts can change whenever the quote refreshes, so always review the current quote right before signing.

Technical details are in [routing engine](/technical/routing-engine).
