---
sidebar_position: 3
---

# Routing engine

AchSwap's router finds the route, and the [route executor](/technical/swap-execution) executes it. The router runs off chain and has no part in settlement. The route it returns is an ordinary `execute()` call that anyone can decode and simulate.

## Liquidity sources

| Source | Pools | Adapter |
| --- | --- | ---: |
| Uniswap V2, AchSwap V2, DyorSwap and Architex | Constant product, 0.30% | 2 |
| Uniswap V3, AchSwap V3, Synthra V3 (two factories), UnitFlow V3, SushiSwap V3, Bugle and FlutchPad | Concentrated liquidity, every fee tier | 3 |
| Slipstream: Aero CL (two factories), Archery and Topaz | Concentrated liquidity with per-pool fees | 3 |
| Uniswap V4, including launchpad hooks (Aka.fun, o1 Launchpad, Minara.fun, Argus, Long.supply, Foci, Faze, Peach, FlutchPad) | Hookless and hooked pools | 4 |
| Lunya | Concentrated-liquidity and constant-product pools | 5 |
| Native USDC ↔ `0x3600` USDC | One balance, two interfaces | 1 |

The exact factory list is under [configured factories](/technical/contract-addresses#configured-factories). A source only contributes when it has a pool for the pair with usable liquidity.

## How a route is chosen

- **Paths.** The router considers direct pools and paths of up to three hops through liquid intermediate tokens such as USDC, EURC and cirBTC.
- **Exact pricing.** Every pool is priced with the same integer math the pool itself uses, including its own fee:
  - V2 fixed fees;
  - V3 fee tiers;
  - V4 LP and protocol fees;
  - the current fee of Slipstream and Lunya pools;
  - fees taken by V4 hooks during swaps.
- **Splits.** The input can be split across up to eight branches, over different pools and DEXs, when the split pays more after gas. When branches share a pool, the router prices it in the order the executor will trade it.
- **Fee.** The quoted amount is net of the 0.25% AchSwap fee.
- **Against KyberSwap and LI.FI.** The swap page then compares this quote with KyberSwap's and LI.FI's on what each route is expected to deliver: its quote less its network cost, and KyberSwap's also less the 0.12 bp its transactions were measured to deliver below its quotes. See [how the best route is chosen](/achswap/smart-routing#how-the-best-route-is-chosen).

## Verification

Before a quote is shown, its exact `execute()` call is simulated against the live contracts at the block the quote was computed on. The result must equal the quoted output to the unit. If it does not, the route is corrected or dropped; a quote that does not reproduce is never shown.

When you request the transaction, it is simulated again, this time from your wallet. Missing approvals or balances are supplied with state overrides, so the check also works before you approve.

As a result:

- A quote never shows more than the transaction would pay at the quote's block.
- If pools move before your transaction is mined, it pays the new amount, or reverts if that is below your minimum.

## Tokens that are not routed

The executor requires every transfer to move exactly the requested amount. Tokens with transfer taxes, reflection or rebasing balances, or transfer restrictions cannot settle, so AchSwap does not route them; KyberSwap or LI.FI may still quote them. Uniswap V4 pools whose hooks do not behave reproducibly are also not used.

## Exact output

When you specify the amount to receive:

1. The router finds the smallest input whose verified output reaches the requested amount.
2. The transaction is an exact-input swap at that input plus your slippage tolerance, with the requested amount as the on-chain minimum.
3. You spend the quoted input plus the slippage allowance and receive at least the requested amount. If the price holds, the extra input buys extra output, so you receive slightly more than you asked for.

Only AchSwap's router quotes exact output. KyberSwap and LI.FI quotes are exact input.

## Route transparency

The swap page shows the winning route, whoever found it:

- **AchSwap routes:** every split and hop with its protocol, pool fee and pool address. Each pool is one the executor resolves on chain from a configured factory.
- **KyberSwap routes:** every path KyberSwap reports, with each pool checked against AchSwap's index of known factories. A pool from an unknown factory is flagged.
- **LI.FI routes:** LI.FI's quote names only the venue it fills with. The pools are found by simulating LI.FI's exact transaction, then checked the same way. Nothing is signed or sent.

With **Detailed route** on, the page shows the route, as text or as a map, and what each provider's route leaves you for the same trade after its gas. The network cost, from the winning route's own gas estimate at the current gas price, is always shown.

## Price impact

Price impact compares the route's output, valued at reference prices, with its input, before the AchSwap fee. Pool fees, hook fees and depth count toward it; the AchSwap fee is shown separately. Each token's reference price comes from its deepest route to USDC through pools whose state is their real price, so a small, stale or custom-curve pool cannot distort it.

The same definition applies to every provider: KyberSwap's and LI.FI's outputs are measured against the same reference prices, so the figure means the same thing whichever route wins. A negative value means the route pays more than the reference price. Only when a token has no reference price does the page fall back to comparing the trade with a smaller quote for the same pair.

## API

Applications can request AchSwap routes and ready-to-sign transactions through the [Developer API](/developers/developer-api). To get a key, email [support@achswap.app](mailto:support@achswap.app).
