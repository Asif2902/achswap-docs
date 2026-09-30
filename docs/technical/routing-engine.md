---
sidebar_position: 2
---

# Routing engine

AchSwap's aggregator is split in two. An off-chain **router** discovers pools, keeps their state, and searches routes in memory. The on-chain **AchRouteExecutor** only executes the plan it is given, settles one fee and enforces the user's minimum.

## Router

| Stage | What happens |
| --- | --- |
| Discovery | Pool-creation events from every configured factory and the Uniswap V4 PoolManager are indexed into SQLite. Creation events from unknown factories are counted, so new liquidity sources show up automatically. |
| State | One log query per poll covers the whole chain. `Sync`, `Swap`, `Mint`, `Burn`, `Initialize`, `ModifyLiquidity` and `ProtocolFeeUpdated` update each pool exactly: reserves, price, active liquidity, and the full set of initialized ticks. Pools that existed before indexing are read once through a read-only lens. |
| Quote plugins | V2 constant product; a bit-exact port of Uniswap's V3 tick math, shared by V3 forks, Aero CL (Slipstream) and V4. Each pool uses its own fee: V2 fixed fees, V3 fee tiers, V4 LP and protocol fees, and Slipstream's current fee, which is re-read whenever the pool trades. V4 hooks that run during swaps are learned by simulation, as a normal wallet calling through the executor's adapter: a fixed fee on the input or the output, or a proven lower bound. |
| Transfer screen | Tokens that do not move exactly (transfer taxes, reflection, sell blocks) are never routed. Each token is test-sent out of and back into every pool (or the V4 PoolManager) a route would use, by simulation, because some tokens tax one pool and not another. |
| Optimizer | Candidate paths (direct, through one or two hub tokens), then a split allocation that simulates pools shared between branches in execution order and accounts for gas, including small slices into shallow pools when they pay. |
| Plan | Independent branches of typed steps for `AchRouteExecutor`: up to 8 branches and 32 steps. |
| Verification | Before a quote is returned, its exact `execute()` call runs as `eth_call` at the block the quote was computed on. The executor must reproduce the quoted amount to the unit. If it does not, the router corrects a stale fee or hook model, or excludes the hop responsible, and routes again. |
| Simulation | At build time the exact `execute()` call is run again as `eth_call` from the user's wallet. Missing funds or approvals are supplied with state overrides, so the check works before approval. |

Safety nets: the math is tested against on-chain quotes and must match to the unit. A verifier re-reads random pools every 30 seconds and repairs any drift. Log pages count only when the serving node has reached the requested block. Slipstream fees are re-read at the block of every swap in those pools, and a route uses a pool whose fee module reprices within a transaction only once. A quote is never higher than what the simulated transaction pays.

Price impact is the route's output valued at reference prices, before the AchSwap fee. Each token's reference price comes from its deepest route to USDC, so a small or stale pool cannot distort it.

## Executor

`AchRouteExecutor` (`0xcD1bc4f6A4448FeA4DE51410D3b571732FE55Af8`):

- pulls exactly `amountIn`, or takes native USDC as `msg.value`;
- executes each branch's steps through allowlisted adapters, measuring every step's output;
- charges the protocol fee once on the total measured output (currently 25 bps, to the Safe `0x0dbd33291b0bc85e75465d0d7F261b4cF758BCf0`). An optional partner fee is capped at 1% by the contract;
- reverts unless the recipient's actual balance increase meets `minNetAmountOut`;
- refunds only the residuals of the current call.

Adapters, their addresses and activation status are listed in [contract addresses](/technical/contract-addresses#route-executor).

## API

Integrators use one endpoint, `POST /api/quote`, which compares AchSwap's router with KyberSwap and LI.FI. Calls from other origins need an API key: `Authorization: Bearer <key>` or `x-quote-token: <key>`.

```json
{ "chainId": 5042, "tokenIn": "0x…", "tokenOut": "0x…", "amountIn": "1000000", "slippageBps": 50,
  "sources": ["achswap", "kyber", "lifi"], "wallet": "0x…" }
```

- `amountIn` is in the input token's base units.
- `sources` defaults to all three; `wallet` is required when `lifi` is included.
- The response names the winning `provider`, its `amountOut` (net of every fee), a `quoteId` and the route. An AchSwap route carries its `executionPlan` and a `branches` breakdown.

`POST /api/quote/build` with `{ quoteId, wallet, recipient?, slippageBps }` returns the transaction:

- `to`, `data` and `value`;
- the `approvalAddress` to approve first, if any;
- `minAmountOut` and `deadline`;
- for AchSwap routes, a `simulation` of that exact transaction from the wallet.

Quote IDs expire after about 10 seconds; request a new quote after that.
