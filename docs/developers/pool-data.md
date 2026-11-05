---
sidebar_position: 6
title: Pool data
description: Arc pool datasets for partner websites and analytics, including pool identity, activity, fees, reserves, token metadata and qualified valuations.
---

# Pool data

AchSwap indexes pools on **Arc Mainnet, chain ID 5042**, across its own DEX and the external DEXs supported by its aggregator. Partners can use this data to display pools, transactions and liquidity activity without building a swap aggregator or handling users' wallets.

There are two delivery formats: the [Pool Data API](/developers/pool-data-api) for paginated website reads, and custom dataset exports with an agreed schema, block range and refresh schedule. The API reference lists the HTTP routes and fields. An indexed dataset is not automatically a new REST endpoint.

## What you can build

| Website or application | Data to use |
| --- | --- |
| A directory of Arc pools | Pool IDs, contracts, protocols, token addresses, creation blocks, fee filters and indexed state |
| A pool activity page | Swaps, additions and removals, with transaction hashes and block/time coverage |
| Token and pair profiles | Address-based token metadata joined to pool identity and activity |
| Liquidity comparisons | V2 reserves, custody observations and separately labeled concentrated-liquidity principal estimates |
| Volume charts | Daily raw-token totals and the explicitly valued USDC subset, with priced-swap counts |
| Research or reporting | A reproducible block range, exact integer amounts, event identities and provenance |

The catalogue endpoint lists pools in ID order. A “top pools” page needs an explicit ranking metric and interval, such as covered daily volume; catalogue membership alone is not a ranking or a measure of token quality.

## Catalogue, state and activity

The REST API provides:

- Pool identity, source/protocol, token addresses, factory and creation block.
- Protocol, source, pool-family and fee filters.
- Fixed/current/dynamic fee semantics and optional compact indexed reserves or concentrated-liquidity state.
- Historical swaps and liquidity events, including exact decoded amounts or deltas, transaction hashes, block hashes and timestamps.
- Catalogue and history watermarks, per-pool coverage and pagination cursors.

V2, CL and curve pools use a contract address as their ID. A V4 pool uses a bytes32 pool ID inside a shared PoolManager; its ID must not be displayed as an independent contract address.

Activity records describe pool events. A CL `Burn` reduces position liquidity; a later `Collect` is a separate transfer. V4 liquidity changes contain ticks and a liquidity delta, rather than token amounts. Event records do not provide complete transaction traces or a wallet accounting ledger. See [event semantics](/developers/pool-data-api#historical-events) before naming deposits or withdrawals in your UI.

## Enriched datasets

These datasets describe the additional indexed observations and reductions. Specify the fields you need when arranging an export. Their schema and delivery are separate from the catalogue REST response.

| Dataset | What a record means |
| --- | --- |
| Token metadata | Address, on-chain name, symbol and decimals, with a canonical observation block/hash and a complete or partial/unreadable status |
| Custody balances | Token0/token1 ERC-20 balances held by an individual pool contract at an observation block; includes fees, donations and dust |
| V2 reserves | The pair's accounting reserves, kept separately from actual custody balances |
| Concentrated LP principal | Token amount estimates reconstructed from a complete, internally consistent initialized-tick distribution; includes its source snapshot and method |
| Nominal TVL | A same-pool spot estimate for recognized USDC pairs, assuming USDC equals $1; custody-based and principal-based estimates remain separate |
| Historical swap values | Exact raw swap amounts and, for a recognized USDC leg, its nominal event-time USD value and execution-implied counterpart price |
| Daily volume | Per-pool UTC-day swap counts, raw token volume, priced-swap counts and valued USDC-subset volume |

Raw quantities are decimal strings. Use the token's recorded decimals to display human units. Arc's native USDC uses 18 decimals, while its `0x3600000000000000000000000000000000000000` ERC-20 interface uses 6; the units must not be mixed or counted as separate assets.

### Balances, liquidity and TVL

**Active liquidity** is the concentrated AMM's liquidity parameter at the current tick. It is not a token balance or a dollar value.

**Custody** measures tokens actually held by a contract. V4's shared manager holds assets for many pools, so its total balance cannot be assigned to each pool. Per-pool V4 custody is represented as unknown.

**LP principal** estimates deposited token amounts from the full tick distribution. It excludes uncollected fees, donations, dust and hook-owned assets. Incomplete or inconsistent tick data produces an unknown estimate, not a fabricated balance.

**Nominal TVL** values recognized USDC pairs at their own pool's spot price, assuming USDC equals $1. A shallow or manipulated pool can distort that estimate. Keep the valuation method and observation block alongside the value; it is not an independent market oracle.

### Prices and historical volume

A pool's spot price, the execution price of a past swap and a quote for a new trade are different measurements. A trade quote depends on amount, depth, fees and route. Use the [trading API](/developers/developer-api) when you need a simulated executable route.

Historical valuations use the USDC leg of the original swap, rather than applying today's price to old transactions. For a swap without a supported contemporaneous USD value, raw token amounts still describe the activity. Its USD value remains null.

Daily reductions expose both total and priced swap counts. The valued subset is not the entire market's USD volume. A complete nominal daily value is reported only when every included swap is priced. Fee APR and farming incentives are outside this dataset's scope.

## Data quality and coverage

Read the coverage and provenance supplied with the data:

- Record the chain, pool ID, block range, dataset identity and observation block/hash.
- Deduplicate events by chain, block and log index, checking the block/transaction identity; a transaction can emit multiple events.
- Distinguish event time from a balance or metadata snapshot. One snapshot is not a historical balance series.
- Keep null/unknown values distinct from a known zero. An attempted metadata read is not proof that every field was readable.
- Check per-pool recognition and requested-range completeness before labeling history complete.
- Treat token names and symbols as untrusted display text, and use addresses as identity.

The pool count, the number of distinct token addresses, the number of complete metadata records and the number of priced tokens are different figures. Use the dataset's coverage/count fields rather than treating one as another.

## Partner access

Email [support@achswap.app](mailto:support@achswap.app) with your project, required datasets, protocols, history interval, expected traffic and refresh needs. For a display website, start with the catalogue and event routes using a **pool-data scoped key** on your backend. For analytics or a bulk extract, agree the schema, units, coverage, valuation method and delivery schedule.

Access is issued per partner, with configurable limits and revocation. Data access needs no wallet signature or transaction permission. Commercial terms and service guarantees are agreed separately; a key is not a self-service subscription.
