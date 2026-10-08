---
sidebar_position: 8
---

# Glossary

**Adapter:** A contract that the route executor calls to trade on one kind of pool. Each adapter has a numeric id (1–5), and its configuration is fixed at deployment. See [swap execution](/technical/swap-execution#adapters).

**Allowance:** An ERC-20 holder's permission for a spender to transfer up to an approved amount.

**AMM:** Automated market maker: a pool contract that prices swaps against the liquidity supplied to it.

**Branch:** One independent path from the input token to the output token within a route. A route can split its input across up to eight branches.

**Chain ID:** The network identifier. Arc Mainnet uses `5042`.

**Concentrated liquidity:** V3-style liquidity restricted to a chosen price range.

**Exact input / exact output:** For exact input, you fix the amount you pay. For exact output, you fix the amount you receive, and the input is computed.

**Fee configuration version:** A counter on the route executor that increases with every fee or fee-recipient change. Each swap carries the version it was quoted under and reverts if the version has changed.

**Fee tier:** A V3 pool's swap fee rate. Pools for the same pair can have different tiers.

**Gas:** The network fee for executing a transaction, paid in native USDC on Arc.

**GM:** The daily check-in on the Quests page: 1 XP per UTC day, and 20 more on every 30th day in a row. See [how to earn XP](/quests/earning-xp#daily-gm).

**Hook:** A contract attached to a Uniswap V4 pool that runs code during swaps or liquidity changes.

**Impermanent loss:** How much a liquidity position's value changes compared with simply holding its original tokens, caused by price movement.

**LP token:** A fungible token representing a share of an AchSwap V2 pool.

**Minimum received:** The least output a swap will accept under its slippage setting. The swap reverts below it.

**Net output:** What you receive after every fee: the pool fees and the AchSwap or integrator fee.

**NFT position:** The nonfungible ownership record for an AchSwap V3 liquidity position.

**Partner fee:** An optional fee of up to 1% that an integrator calling the route executor directly can add for themselves.

**Permit2:** The canonical Uniswap contract that verifies signed token permissions. Gasless swaps use it.

**Price impact:** How much less the route pays than market reference prices, before the AchSwap fee: the trade's effect on the price plus pool and hook fees. Negative when the route pays more than the reference. It is distinct from slippage tolerance.

**Relayer:** An allowlisted wallet that submits gasless swaps and pays their gas.

**Route:** The sequence of pools and tokens a swap trades through, including any splits.

**Slippage tolerance:** How far below the quote the output may fall before the swap reverts.

**Step:** One swap within a branch: an adapter id, the token it outputs, and the data that identifies the pool.

**Tick:** A discrete V3 price boundary used to define a position's range.

**Timelock:** A mandatory delay before a contract change takes effect. On the route executor, adding an adapter, raising the fee and changing the fee recipient each wait two days.

**XP:** Points for using AchSwap, shown on the Quests page. They set your level (1 to 20) and your leaderboard rank. See [Quests and XP](/quests/overview).
