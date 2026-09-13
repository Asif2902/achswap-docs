---
sidebar_position: 5
---

# Pools

A pool holds two tokens that traders swap against. AchSwap's own Arc Mainnet liquidity interface supports **V2 pools** and **V3 concentrated-liquidity pools**. Pools and liquidity from other DEXs may be available to the aggregator through its registered adapters, but their positions are not AchSwap V2/V3 positions.

Before adding liquidity, inspect the token addresses, reserves or active liquidity, V3 fee tier, and current price. A pool contract existing does not guarantee a safe price for your trade or sufficient depth for a given amount. Newly created pools need their initial price set carefully.

V2 LP ownership is represented by LP tokens. V3 positions are NFTs with individual ranges and accrued fees. See [add liquidity](/achswap/add-liquidity) and [V2 versus V3](/achswap/v2-vs-v3).
