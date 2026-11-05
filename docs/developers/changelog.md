---
sidebar_position: 5
title: Changelog
description: Changes to the AchSwap Developer API and its documentation.
---

# Changelog

Changes to the [Developer API](/developers/developer-api) and to these developer docs, newest first.

## Versioning

The version is part of each API's path: trading uses `/api/v1`, and pool data uses `/api/pool-data/v1`. Each has its own key scope and contract.

AchSwap has not published a formal deprecation schedule. What you can rely on today:

- **Additive changes** (a new optional request field, a new response field) can ship within `v1`. Write your client to ignore response fields it doesn't know.
- **Breaking changes** (a removed or renamed field, a changed meaning) are recorded here.
- **Error codes** are the stable thing to branch on. Error messages may be reworded.
- **On-chain values are live.** The AchSwap fee is reported in every response (`fees.protocolBps`): read it from the response, don't hard-code it.

If you depend on the API in production, email [support@achswap.app](mailto:support@achswap.app) so you can be told about changes directly.

## 5 November 2026 — Pool datasets, filters and fee semantics

The [pool data guide](/developers/pool-data) describes catalogue and activity reads, token metadata, custody observations, concentrated LP principal, nominal TVL and historical volume datasets. It distinguishes the REST response contract from custom exports and explains units, valuation methods and coverage.

The [Pool Data API reference](/developers/pool-data-api) includes `/filters`, protocol/source/kind/fee selection, fixed and dynamic fee semantics, filter-bound cursors and optional compact indexed state. For dynamic pools, `fee` is the known indexed pool/LP fee; the original creation value is `feeInfo.metadataFee`.

## 4 November 2026 — Pool Data API

A separate [read-only partner API](/developers/pool-data-api) exposes the aggregated pool catalogue and historical swaps/adds/removals with explicit per-pool coverage. It requires a pool-data scoped key, separate from trading keys.


## API

### 2026-10-20: new route executor

- `/swap` transactions now go to AchRouteExecutorV2 `0xF69036De0e32566CfF7C79c29229D441cdE3e48E`: `tx.to` and `approval.spender` changed. The same routes and output cost about 22% less gas. Request and response fields are unchanged.
- **Approve again:** an allowance given to the earlier AchRouteExecutor `0x1B844738455b8060D12839331b35893526E9d314` does not carry over. Use the `approval` object in each `/swap` response, as before.
- **Native USDC output:** both fees are now taken in whole 6-decimal units (`floor(gross / 10^12 × bps / 10000) × 10^12`). `fees` and `amountOut` in the response already reflect this.
- The `route` inside `tx.data` uses the executor's new packed encoding (see [swap execution](/technical/swap-execution#route-encoding)). Treat `tx.data` as opaque.

### 2026-10-02: v1 released

- `POST /api/v1/quote` and `POST /api/v1/swap` on Arc Mainnet (chain `5042`), exact input, AchSwap routes executed on AchRouteExecutor `0x1B844738455b8060D12839331b35893526E9d314`.
- API keys in `x-api-key` or `Authorization: Bearer`.
- Optional partner fee: `feeBps` (0 to 100) paid to `feeRecipient` in the output token, in the same transaction.
- `/swap` transactions are simulated from the sender before they are returned.

## Documentation

### 2026-10-20

- AchSwap routes execute on AchRouteExecutorV2; every AchSwap contract is source-verified (see [contract addresses](/technical/contract-addresses)).
- The Quests page, the pool page and the new Analytics page are live; their status notes are removed.
- [Gasless swaps](/achswap/gasless): only a swap that qualifies is gasless; any other swap goes through normally and you pay the gas, with no Permit2 request.
- [Verification](/technical/routing-engine#verification): the quote shown is what the simulated transaction paid, including when it pays up to 0.01% less than the router's estimate.

### 2026-10-10

- New pages: [API reference](/developers/api-reference), [code examples](/developers/examples), [errors and limits](/developers/errors-and-limits), this changelog.
- Request lifecycle and integration flow diagrams.
- Corrected: the swap page's tie margin between providers (see [smart routing](/achswap/smart-routing#how-the-best-route-is-chosen)).

### 2026-10-02

- First public Developer API page.
