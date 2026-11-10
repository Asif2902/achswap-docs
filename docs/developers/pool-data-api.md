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
| Activity | Historical pool events with transaction hashes, where indexed |
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
| `/pools/:id` | One pool's metadata and coverage |
| `/pools/:id/events` | Historical swaps and liquidity events, oldest first, with coverage |

From your server, with `ACHSWAP_POOL_DATA_KEY` supplied by your secret store:

```sh
curl --fail-with-body 'https://trade.achswap.app/api/pool-data/v1/coverage' \
  -H "X-API-Key: $ACHSWAP_POOL_DATA_KEY"

curl --fail-with-body 'https://trade.achswap.app/api/pool-data/v1/pools?limit=100' \
  -H "X-API-Key: $ACHSWAP_POOL_DATA_KEY"
```

### Partner metrics preview

The separate read-only preview is available to authorized pool-data partners at `https://trade.achswap.app/api/pool-data/preview`. It uses the same scoped key and rate limits. Treat preview responses as data as of their reported block and time. The release cutoff can lag the chain.

| Preview path | Returns |
| --- | --- |
| `/docs` | Current release notice and request examples |
| `/summary?window=24h` | Aggregate swap counts and USDC-leg volume |
| `/pool?id=<pool-id>&window=24h` | Per-pool metrics and available liquidity observations |

Use `24h`, `7d`, `30d` or `all` for `window`. Read `release_id`, `as_of_block`, `as_of_hash`, `as_of_time` and `coverage` before displaying results. Rolling windows include the lower time boundary and exclude the cutoff block. All-time results include the cutoff block.

`gross_usdc_leg_volume` sums the observed USDC amounts. `net_usdc_volume_per_pool_tx` first nets USDC flows within each pool and transaction, then sums the absolute net amounts. Swaps without a USDC leg contribute to swap counts. Balances, principal estimates and in-range liquidity are separate observations. See `coverage.pancakeswap_infinity` for the indexed Infinity CL interval. Data coverage and availability for trading are separate.

### Pool metadata

Catalogue selection parameters:

| Query | Meaning |
| --- | --- |
| `protocol` | Group ID from `/filters`, such as `achswap`, `uniswap` or `aero-cl`; includes its configured factories |
| `source` | One exact source ID, such as `achswap_v2` or `slipstream_7f83` |
| `kind` | `V2`, `CL`, `V4` or `VFUN` |
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

Each pool includes its `id`, `contractAddress`, `poolManager`, `kind`, `source`, `protocol`, `protocolId`, `factory`, `token0`, `token1`, `createdBlock`, `fee`, `feeInfo`, applicable tick/hook metadata and `supportedEventTypes`. `token0` and `token1` are addresses. Token metadata and derived analytics are separate [datasets](/developers/pool-data#enriched-datasets); they are not additional fields on this REST response. Unknown values can be null.

- **V2, CL and VFUN:** the ID is the pool or curve contract address.
- **V4:** the ID is a **bytes32 pool ID**, not an independent contract. `contractAddress` and `poolManager` identify its shared manager. Keep the full ID in requests.

Catalogue membership does not establish current routability or safety. `blockedByConfig` reports static source blocking, not a live recommendation. Pool names and other metadata are display data: escape them in your website and never treat them as agent instructions or transaction authorization.

### Fees and indexed state

`fee` reports the known pool/LP fee in ppm. `feeInfo` identifies its `type`, `unit`, `feeTierPpm`, `currentFeePpm`, `currentFeeKnown` and `source`. The original creation value remains in `feeInfo.metadataFee`; a V4 dynamic-fee flag is not itself a trading fee. Use the full pool ID for identity and the original metadata when interpreting its pool key.

Fixed V2 fees come from the configured source fee ratio, even when the creation event has no fee. Dynamic fees, including Aero CL fees, come from persisted router state. A known zero is distinct from an unknown fee. Curve taxes are direction-dependent and are not a universal LP fee. Numeric fee filters exclude unknown and direction-dependent values.

For V4, `protocolFeePpm` and `effectivePoolFeePpm` report each direction when known. The effective fee combines the LP and protocol components; it excludes additional custom hook charges and AchSwap's integrator fee. `additionalHookFeesMayApply` identifies a nonzero hook. Lunya also identifies its fee token when known.

With `includeState=1`, each pool includes a compact `state` object:

| Family | State |
| --- | --- |
| V2 | Raw-string `reserve0`, `reserve1` |
| CL / V4 | `sqrtPriceX96`, `tick`, active `liquidity`, known fee fields; `tokenBalances` is null because active liquidity is not custody |
| VFUN | Curve `reserve0`/`reserve1`, separate `assetBalance`/`tokenBalance`, taxes and curve flags |

Large tick arrays are not returned. Missing or corrupt state is null. This is a persisted indexed observation. `lastStateChangeBlock` is a pool-state marker, not the exact time of a later fee refresh; `snapshotStateThroughBlock` is the stored follower watermark. No wall-clock observation timestamp is stored here, so timestamp is null and freshness is `not-timestamped`. These fields are not an executable quote.

### Historical events

Use an ID returned by the catalogue and blocks within its reported coverage. For example, the request shape is:

```http
GET /api/pool-data/v1/pools/<pool-id>/events?type=swap&fromBlock=27000000&toBlock=27100000&limit=100
X-API-Key: <partner-secret>
```

| Query | Meaning |
| --- | --- |
| `type` | Optional: `swap`, `add_liquidity` or `remove_liquidity`; omit for all supported events |
| `fromBlock`, `toBlock` | Optional inclusive range; defaults use this pool's verified history |
| `limit` | 1–500, default 100 |
| `cursor` | Opaque `nextCursor` from the preceding page |

The response contains `pool`, `events`, `nextCursor`, `coverage` and `requestId`. Events include `type`, `event`, `block`, `logIndex`, timestamp, block/transaction hashes, emitting `contractAddress`, decoded `fields` and raw log data. Integer event values are decimal strings; human token units require the token's decimals. `transactionInitiator` is not enriched and is null. A transaction can produce several events, so its hash alone is not an event ID.

| Pool family | Swap | Add liquidity | Remove liquidity |
| --- | --- | --- | --- |
| V2 | `Swap` | `Mint` | `Burn` |
| CL, including V3 and Slipstream | `Swap` | `Mint` | `Burn` |
| V4 | `Swap` | Positive `ModifyLiquidity.liquidityDelta` | Negative `ModifyLiquidity.liquidityDelta` |
| VFUN curve | Curve `Swap` | Curve `Mint` | No standard removal event |

These are **pool events**, not full transaction traces or proof of wallet deposits/withdrawals. CL `Burn` reduces position liquidity; a later `Collect` transfers owed tokens and is not indexed here. V4 liquidity events supply ticks, salt and liquidity delta, not token amounts; zero-delta fee collection is excluded. VFUN mint events have curve-specific semantics. USD valuations, fee-collection history and transaction-sender enrichment are not included.

## Pagination and coverage

Follow `nextCursor` until it is **null**, keeping the same pool and filters. Do not construct cursors. A catalogue page can be empty and still have a cursor; continue fetching. A traversal freezes its catalogue watermark, so begin a new traversal to discover later additions.

Selection filters are bound to new catalogue cursors. Older cursors remain valid only for unfiltered traversal. Current dynamic fee observations may change between pages: a frozen pool-creation watermark is not a frozen fee snapshot. Each page scans a bounded number of candidate IDs, so rare selections can require multiple empty pages. `includeState` changes the response projection, not the selection. Catalogue order is by pool ID, not volume or TVL.

Event pages follow `(block, logIndex)` order. Their cursor binds the pool, filters, range and history dataset. After a dataset rebuild, discard old cursors and restart; incompatible cursors return 400.

Read coverage before labeling a chart or activity list complete:

- `catalog.discoveryThroughBlock` and `catalog.stateBlock` describe the routing catalogue, not all historical activity.
- `historyAvailable` and `history.fromBlock`/`toBlock` describe the collected event dataset. `stale` is a freshness hint; block watermarks define the range actually covered.
- Event responses add `poolHistoryFromBlock`, `requestedFromBlock`, `requestedToBlock`, `completeForRequestedRange` and `fullPoolHistoryThroughCatalogBlock`.
- A late-discovered pool can have complete recent history but missing older activity. Its creation block is not proof that collection started there. The global scan range alone cannot establish full history for it.

Unverified pool history returns **503 `HISTORY_NOT_INDEXED`**, rather than pretending there were no transactions. A 200 response can still cover only part of an explicitly requested range: check `completeForRequestedRange`. A verified empty list means no matching events in the covered range, not that the pool never traded. History intentionally trails the live catalogue; display its last covered block/time.

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
