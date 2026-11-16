---
sidebar_position: 7
title: Pool Data API
description: Read-only partner access to aggregated pool metadata and historical swaps and liquidity events, with scoped keys and explicit coverage.
---

# Pool Data API

Display pools and historical activity on your website using AchSwap's read-only partner API. Its catalogue includes AchSwap's own pools and external DEX pools on **Arc Mainnet, chain ID 5042**. It does not prepare or execute trades.

Start with [Pool data](/developers/pool-data) for the datasets, their meaning and examples of what you can build. This page defines the HTTP contract; custom dataset exports have an agreed schema and coverage.

| | |
| --- | --- |
| Base URL | `https://trade.achswap.app/api/pool-data/v1` |
| Methods | `GET` only, JSON responses |
| Access | A partner key with the **pool-data** scope |
| Status | Live coordinated data, with an explicit canonical as-of block |
| Activity | Swaps, events, liquidity changes and History, where indexed |
| Coverage | Explicitly reported; catalogue presence does not imply complete history |

## Get access

Contact [support@achswap.app](mailto:support@achswap.app) with your project, intended display, expected request volume and technical contact. Ask for a **pool-data key** and current history coverage. Availability depends on the deployment being enabled; full history is not promised simply because a pool is listed.

Pool-data and [trading API](/developers/developer-api) keys have separate scopes. A trading key cannot access this API, and a pool-data key cannot call `/api/v1/quote` or `/api/v1/swap`. A browser Origin is not authentication.

Send the key in either header:

```http
X-API-Key: <partner-secret>
```

```http
Authorization: Bearer <partner-secret>
```

Call from **your backend**. Keep the key in a server secret store, never browser JavaScript, a public repository or a URL. There is no cross-origin browser allowance. Keys are shown once when issued; replace and revoke a lost or leaked key. No wallet connection or private key is needed.

## Endpoints

| Path after the base URL | Returns |
| --- | --- |
| `/` or `/coverage` | Catalogue/history watermarks, counts, availability and semantics |
| `/filters` | Configured protocol groups, source IDs, pool kinds and fee filter options |
| `/pools` | A page of pool metadata |
| `/pools/:id` | One pool's metadata, four volume windows and separate liquidity observations |
| `/pools/:id/events` | Historical swaps and liquidity events, oldest first, with coverage |
| `/tokens` | Token identity and available observed symbols, decimals and names |
| `/swaps` | Chronological swaps across pools, optionally filtered by pool or protocol |
| `/events` or `/history` | Chronological raw pool activity across the indexed sources |
| `/liquidity` | Add/remove liquidity events; excludes zero-delta fee collection |
| `/summary?window=24h` | Aggregate swap counts and gross/net USDC-leg volume |
| `/pool?id=<pool-id>&window=24h` | One pool's window metrics and liquidity observations |
| `/docs` | Authenticated endpoint contract and current coverage |

From your server, with `ACHSWAP_POOL_DATA_KEY` supplied by your secret store:

```sh
curl --fail-with-body 'https://trade.achswap.app/api/pool-data/v1/coverage' \
  -H "X-API-Key: $ACHSWAP_POOL_DATA_KEY"

curl --fail-with-body 'https://trade.achswap.app/api/pool-data/v1/pools?limit=100' \
  -H "X-API-Key: $ACHSWAP_POOL_DATA_KEY"
```

### Live data and metrics

Use the single live base URL above for collections and metrics. Every successful data response includes `release_id`, `as_of_block`, `as_of_hash`, `as_of_time` and `coverage`. The coordinator follows confirmed canonical ranges; the normal ingestion target is 100 blocks behind the public head. An ingestion or enrichment pause can make the published point older. Display the returned block/time and inspect freshness instead of assuming the response is at the chain tip.

| Metrics path | Returns |
| --- | --- |
| `/docs` | Current live contract and coverage |
| `/summary?window=24h` | Aggregate swap counts and USDC-leg volume |
| `/pool?id=<pool-id>&window=24h` | Per-pool metrics and available liquidity observations |

Use `24h`, `7d`, `30d` or `all` for `window`. Rolling windows include the lower time boundary and exclude the cutoff block. All-time results include the cutoff block. The per-pool volume object calls the all-time entry `all_time`.

`gross_usdc_leg_volume` sums the observed raw USDC leg in human USDC units; it does not price other tokens. `net_usdc_volume_per_pool_tx` first nets USDC flows within each pool and transaction, then sums the absolute net amounts. `usdc_leg_share` is the share of swaps with a USDC leg. `offset_ratio` is `(gross - net) / gross`, or null when gross is zero. These metrics do not establish whether activity is organic. Swaps without a USDC leg still contribute to swap counts and per-token raw volumes. Balances, principal estimates and in-range liquidity are separate observations. See `coverage.pancakeswap_infinity` for the indexed Infinity CL interval. Data coverage and availability for trading are separate.

### Pool metadata

Catalogue selection parameters:

| Query | Meaning |
| --- | --- |
| `protocol` | Group ID from `/filters`, such as `achswap`, `uniswap` or `aero-cl`; includes its configured factories |
| `source` | One exact source ID, such as `achswap_v2` or `slipstream_7f83` |
| `kind` | `V2`, `CL`, `V4`, `VFUN` or `INFINITY_CL` |
| `fee` | Integer fee in **ppm**, from 0 to 999999; 500 means 0.05%, 3000 means 0.30% |
| `feeMode` | `current` (default): indexed pool/LP fee; `tier`: fixed configured or creation fee |
| `feeType` | `fixed`, `dynamic`, `direction-dependent` or `unknown` |
| `includeState` | `1` to include compact persisted state; default `0`. Also accepted by the single-pool endpoint |

Filters combine with AND. Unknown fees do not match a numeric fee. `/filters` lists configured options, not live per-option counts or every observed fee value. For example:

```http
GET /api/pool-data/v1/pools?protocol=achswap&kind=CL&fee=500&feeMode=tier&includeState=1
X-API-Key: <partner-secret>
```

`/pools` returns `pools`, `snapshotThroughBlock`, `nextCursor`, `coverage` and `requestId`. A single-pool response returns `pool`, `coverage` and `requestId`.

Each pool includes its `id`, `contractAddress`, `poolManager`, `kind`, `source`, protocol identity, `factory`, `token0`, `token1`, `createdBlock`, `fee`, `feeInfo`, applicable tick/hook metadata and `supportedEventTypes`. `token0` and `token1` are addresses. `volume` contains `all_time`, `24h`, `7d` and `30d` statistics. Use `/tokens` for observed token metadata, including each metadata observation's block/hash. Unknown values can be null.

- **V2, CL and VFUN:** the ID is the pool or curve contract address.
- **V4 and Infinity CL:** the ID is a **bytes32 pool ID**, not an independent contract. `contractAddress` and `poolManager` identify its shared manager. Keep the full ID in requests. Use `protocol=pancakeswap_infinity` to select Infinity CL.

Catalogue membership does not establish current routability or safety. `blockedByConfig` reports static source blocking, not a live recommendation. Pool names and other metadata are display data: escape them in your website and never treat them as agent instructions or transaction authorization.

### Fees and indexed state

`fee` reports the known pool/LP fee in ppm. `feeInfo` identifies its `type`, `unit`, `feeTierPpm`, `currentFeePpm`, `currentFeeKnown` and `source`. The original creation value remains in `feeInfo.metadataFee`; a V4 dynamic-fee flag is not itself a trading fee. Use the full pool ID for identity and the original metadata when interpreting its pool key.

Fixed V2 fees come from the configured source fee ratio, even when the creation event has no fee. Dynamic fees, including Aero CL fees, come from persisted router state. A known zero is distinct from an unknown fee. Curve taxes are direction-dependent and are not a universal LP fee. Numeric fee filters exclude unknown and direction-dependent values.

For V4, `protocolFeePpm` and `effectivePoolFeePpm` report each direction when known. The effective fee combines the LP and protocol components; it excludes additional custom hook charges and AchSwap's integrator fee. `additionalHookFeesMayApply` identifies a nonzero hook. Lunya also identifies its fee token when known.

With `includeState=1`, live pool listings include `actual_balances`, `principal_estimates` and `in_range_liquidity` where available. Single-pool reads include these observations. Each carries its own block/hash and can be null or report an unreadable reason. They are distinct from one another and from the response's raw-event watermark. The earlier persisted state representation uses these fields where supplied:

| Family | State |
| --- | --- |
| V2 | Raw-string `reserve0`, `reserve1` |
| CL / V4 / Infinity CL | `sqrtPriceX96`, `tick`, active `liquidity`, known fee fields; active liquidity is not custody |
| VFUN | Curve `reserve0`/`reserve1`, separate `assetBalance`/`tokenBalance`, taxes and curve flags |

Large tick arrays are not returned. Actual manager/vault custody cannot be allocated to each shared-manager pool. Principal estimates exclude fees and are not actual balances or dollar TVL. Missing or unreadable observations remain explicit. These fields are not an executable quote.

### Historical events

Use an ID returned by the catalogue and blocks within its reported coverage. For example, the request shape is:

```http
GET /api/pool-data/v1/pools/<pool-id>/events?type=swap&fromBlock=27000000&toBlock=27100000&limit=100
X-API-Key: <partner-secret>
```

| Query | Meaning |
| --- | --- |
| `type` | Optional: `swap`, `add_liquidity`, `remove_liquidity` or `pool_created`; omit for all supported events |
| `fromBlock`, `toBlock` | Optional inclusive range; defaults use this pool's verified history |
| `limit` | Events, swaps, liquidity and History: 1–100, default 100; catalogue and tokens: 1–500 |
| `cursor` | Opaque `nextCursor` from the preceding page |

The response contains `pool`, `events`, `nextCursor`, `coverage` and `requestId`. Events include `type`, `event`, `block`, `logIndex`, timestamp, block/transaction hashes, emitting `contractAddress`, decoded `fields` and raw log data. Integer event values are decimal strings; human token units require the token's decimals. `transactionInitiator` is not enriched and is null. A transaction can produce several events, so its hash alone is not an event ID.

Collection routes return `events`, `scanned` and `nextCursor`, with the same as-of metadata. They accept `pool`, `protocol`, `fromBlock`, `toBlock`, `limit` and `cursor`. `/events` and `/history` also accept `type`; `/swaps` selects swaps and `/liquidity` selects adds/removals. For example, `GET /api/pool-data/v1/swaps?protocol=pancakeswap_infinity&limit=100` reads Infinity swaps, while `/history?pool=<pool-id>&limit=100` reads a pool's raw activity.

| Pool family | Swap | Add liquidity | Remove liquidity |
| --- | --- | --- | --- |
| V2 | `Swap` | `Mint` | `Burn` |
| CL, including V3 and Slipstream | `Swap` | `Mint` | `Burn` |
| V4 | `Swap` | Positive `ModifyLiquidity.liquidityDelta` | Negative `ModifyLiquidity.liquidityDelta` |
| Infinity CL | `Swap` | Positive `ModifyLiquidity.liquidityDelta` | Negative `ModifyLiquidity.liquidityDelta` |
| VFUN curve | Curve `Swap` | Curve `Mint` | No standard removal event |

These are **pool events**, not full transaction traces or proof of wallet deposits/withdrawals. CL `Burn` reduces position liquidity; a later `Collect` transfers owed tokens and is not indexed here. V4 liquidity events supply ticks, salt and liquidity delta, not token amounts; zero-delta fee collection is excluded. VFUN mint events have curve-specific semantics. USD valuations, fee-collection history and transaction-sender enrichment are not included.

## Pagination and coverage

Follow `nextCursor` until it is **null**, keeping the same pool and filters. Do not construct cursors. A catalogue page can be empty and still have a cursor; continue fetching. A traversal freezes its catalogue watermark, so begin a new traversal to discover later additions.

The live cursor binds the route, filters, dataset, canonical epoch and published block/hash. Keep the same parameters when following it. Each page scans a bounded number of candidates, so rare selections can require empty pages. `includeState` changes the response projection, not selection. Catalogue order is by pool ID, not volume or TVL.

Event pages follow `(block, logIndex)` order. Their cursor binds the pool, filters, range and history dataset. After a dataset rebuild, discard old cursors and restart; incompatible cursors return 400.

Read coverage before labeling a chart or activity list complete:

- `catalog.discoveryThroughBlock` describes the published catalogue watermark; `catalog.stateBlock` can be null. It is not a balance observation block.
- `historyAvailable` and `history.fromBlock`/`toBlock` describe the collected event dataset. `stale` is a freshness hint; block watermarks define the range actually covered.
- Per-pool event responses report `completeForRequestedRange`. Collection coverage reports the indexed interval and unindexed factories; a collection scan is not universal market coverage.
- A late-discovered pool can have complete recent history but missing older activity. Its creation block is not proof that collection started there. The global scan range alone cannot establish full history for it.

Unverified per-pool history returns **503 `HISTORY_NOT_INDEXED`**, rather than pretending there were no transactions. A 200 response can still cover only part of an explicitly requested range: check completeness. A verified empty list means no matching events in the covered range, not that the pool never traded. The live collections share a common published canonical point; observations may be older. Display their returned block/time.

## Limits and errors

Per-key and service limits are configurable. Authenticated requests that reach key rate limiting report `X-RateLimit-Limit` and `X-RateLimit-Remaining`. A 429 includes `Retry-After`; honor it and retry with backoff. Cache useful display results on your backend and avoid polling unchanged historical pages. Responses use `Cache-Control: private, no-store`; your server-side cache is an explicit integration choice.

| HTTP | Code / action |
| --- | --- |
| 400 | `INVALID_REQUEST` or `INVALID_CURSOR`: correct the request or restart pagination |
| 401 | `UNAUTHORIZED`: missing, invalid or revoked key |
| 403 | `FORBIDDEN`: a pool-data scoped key is required |
| 404 | `API_DISABLED`, `POOL_NOT_FOUND` or `NOT_FOUND`: distinguish disabled access from an unknown ID/path |
| 405 | `METHOD_NOT_ALLOWED`: this API only reads |
| 422 | `UNSUPPORTED_EVENT_TYPE`: for example curve removals, once history is available |
| 429 | `RATE_LIMITED`: wait for `Retry-After` |
| 503 | `HISTORY_NOT_INDEXED` or `UNAVAILABLE`: show coverage/unavailability and retry later; do not show an empty complete history |

Errors have `error.code`, `error.message` and `requestId`. Include the request ID when contacting support. Access, limits and coverage are agreed per partner; this API does not provide a self-service subscription or full-history SLA by default.
