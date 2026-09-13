---
sidebar_position: 2
---

# Smart routing

The AchSwap aggregator compares quotes from seven registered adapters on Arc Mainnet. Its route search can use direct pools, split input among multiple sources, or combine different DEXs over multiple hops. The chosen executable route aims for the best **final net output** among routes that return a usable quote; no router can guarantee the best price across liquidity it cannot see or quote.

For example, one leg may use Uniswap V3 while the next uses AchSwap V2 and UnitFlow V3 as a split. This is a routing capability, not a promised route for a particular token pair. Liquidity and quoted output determine the result.

The app compares the aggregator result with a separate LI.FI quote in normal mode. Direct AchSwap V2/V3 quotes can also be enabled in Developer mode. LI.FI's execution and fee path are separate from AchSwap's aggregator. In Developer mode, disabling **Deep route search** skips the more expensive split and mixed-DEX exploration; it can return a quicker but inferior quote.

The expanded [route map](/achswap/swap) shows the quoted token hops, DEX/version, and split percentages. Percentages within a leg are input shares for that leg. Routes and amounts can change when quotes refresh or pool state moves. Always review the current quote immediately before signing.

| Index | Source | Mask |
| ---: | --- | ---: |
| 0 | Uniswap V2 | 1 |
| 1 | Uniswap V3 | 2 |
| 2 | Uniswap V4 | 4 |
| 3 | AchSwap V2 | 8 |
| 4 | AchSwap V3 | 16 |
| 5 | Synthra V3 | 32 |
| 6 | UnitFlow V3 | 64 |

These are the registered source slots, not a claim that every source has an active pool for every pair. AchSwap's own V4 pools are not deployed; the Uniswap V4 adapter is an independent source. Addresses and the verified on-chain registry are in [contract addresses](/technical/contract-addresses).
