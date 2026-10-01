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

The route appears when **Detailed route** is on, as text or as a map. The page always lists what each provider quoted for the same trade, and the network cost from the winning route's own gas estimate at the current gas price.

## Price impact

Price impact compares the route's output, valued at reference prices, with its input, before the AchSwap fee. Pool fees, hook fees and depth count toward it; the AchSwap fee is shown separately. Each token's reference price comes from its deepest route to USDC through pools whose state is their real price, so a small, stale or custom-curve pool cannot distort it.

The same definition applies to every provider: KyberSwap's and LI.FI's outputs are measured against the same reference prices, so the figure means the same thing whichever route wins. A negative value means the route pays more than the reference price. Only when a token has no reference price does the page fall back to comparing the trade with a smaller quote for the same pair.

## API

Integrators use one endpoint, `POST /api/quote`. It compares AchSwap's router with KyberSwap and LI.FI and returns the best net output. Calls from other origins need an API key, sent as `Authorization: Bearer <key>` or `x-quote-token: <key>`.

```json
{
  "chainId": 5042,
  "tokenIn": "0x3600000000000000000000000000000000000000",
  "tokenOut": "0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1",
  "amountIn": "1000000",
  "slippageBps": 50,
  "sources": ["achswap", "kyber", "lifi"],
  "wallet": "0x…"
}
```

| Request field | Notes |
| --- | --- |
| `chainId` | `5042` |
| `tokenIn`, `tokenOut` | ERC-20 addresses. For USDC, use `0x3600…0000`; the API does not accept the native `address(0)`. |
| `tradeType` | `EXACT_IN` (default) or `EXACT_OUT` |
| `amountIn` | Exact input in base units, for `EXACT_IN` |
| `amountOut` | Requested output in base units, for `EXACT_OUT` |
| `slippageBps` | 0 to 2000 |
| `sources` | Any of `achswap`, `kyber` and `lifi` (default: all three). `EXACT_OUT` requires `["achswap"]`. |
| `wallet` | Required when `lifi` is included, because LI.FI calldata is specific to an address |

| Response field | Meaning |
| --- | --- |
| `provider` | `AchSwap`, `KyberSwap` or `LiFi`: whichever gives the best net output |
| `amountOut` | Net output after every fee. For `EXACT_OUT`, the guaranteed minimum, which is the requested amount. |
| `amountIn` | The input the transaction spends. For `EXACT_OUT`, this is the quoted input plus slippage. |
| `amountInQuoted` | `EXACT_OUT` only: the smallest input that reaches the target at the quote's block |
| `expectedAmountOut` | `EXACT_OUT` only: the transaction's expected output |
| `fees.feeBpsCharged` | The protocol fee in bps |
| `priceImpact` | AchSwap routes only |
| `route` | The winning route. An AchSwap route carries its `executionPlan` (the executor call) and a `branches` breakdown of splits and hops. |
| `quoteId` | Pass this to `/api/quote/build`. It is valid for about 10 seconds. |
| `noRoute`, `incomplete` | No route was found, or a provider did not answer in time |

`POST /api/quote/build` takes `{ quoteId, wallet, recipient?, slippageBps }` and returns the transaction:

- `to`, `data` and `value`;
- the `approvalAddress` to approve first, if any (there is none for native USDC input);
- `minAmountOut` and `deadline`;
- for AchSwap routes, `expectedAmountOut` and a `simulation` of that exact transaction from the wallet.

For `EXACT_IN`, the AchSwap minimum is the quoted output less `slippageBps`. For `EXACT_OUT`, the minimum is the requested amount.

| Status | Meaning |
| --- | --- |
| `400` | Invalid parameters, or the slippage or wallet differs from the quote |
| `409` | The route no longer executes. Request a new quote. |
| `410` | The quote expired. Request a new quote. |
| `429` | Too many requests. Retry after the `Retry-After` delay. |
