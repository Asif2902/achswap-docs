---
sidebar_position: 5
---

# Glossary

**Adapter:** A contract that lets the AchSwap aggregator quote and execute through a particular DEX. Registered adapters and indices are in [contract addresses](/technical/contract-addresses).

**Aggregator:** AchSwap's route search and execution system, which can split trades and combine supported DEXs over multiple hops.

**Allowance:** An ERC-20 token holder's permission for a specified spender to transfer up to an approved amount.

**AMM:** Automated market maker; pool contracts price swaps against supplied liquidity.

**Chain ID:** The network identifier. Arc Mainnet uses `5042`.

**Concentrated liquidity:** V3 liquidity restricted to a selected price range.

**Fee tier:** A pool's swap fee rate. V3 pools for the same pair can have different tiers.

**Gas:** The network fee for executing a transaction, paid in native USDC on Arc.

**Impermanent loss:** The change in a liquidity position's value relative to holding its original tokens, caused by price movement.

**LP token:** Fungible token representing a share of an AchSwap V2 pool.

**Minimum received:** The least output a swap will accept under its slippage setting; execution reverts below it.

**NFT position:** The nonfungible ownership record for an AchSwap V3 liquidity position.

**Price impact:** The estimated effect of a trade on the available pool price. It is distinct from slippage tolerance.

**Route:** The quoted sequence of token hops and DEX sources used to execute a swap.

**Source mask:** A bitmask selecting which registered aggregator adapter slots are eligible.

**Tick:** A discrete V3 price boundary used to define a position's range.
