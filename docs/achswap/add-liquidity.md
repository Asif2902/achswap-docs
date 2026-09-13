---
sidebar_position: 3
---

# Add liquidity

AchSwap supports **V2** and **V3** liquidity on Arc Mainnet. Select a token pair in the app's Liquidity page, check the pool and fee tier, review the amounts and price range, and confirm any approval and position transaction in your wallet.

## V2

V2 deposits both tokens into a constant-product pool. The pool's current reserve ratio determines the deposit ratio for an existing pool. Your LP tokens represent your share; when you remove liquidity, you receive your underlying tokens and accrued value from trading fees. A new pool needs an initial price set by the first deposit, so review the ratio carefully.

## V3

V3 deposits liquidity within a price range and mints an NFT position. Select an available fee tier, review the current price and tick-aligned range, then supply the amounts the range requires. An in-range position can contain both tokens. A range entirely on one side of the current price can be **one-sided**; the position manager must receive the correct nonzero token amount and appropriate transaction value. Do not force a second token amount into a one-sided position.

A V3 position earns swap fees only while price is inside its range. Fees are collected through position management, and moving a range requires managing or recreating the position. Narrower ranges increase exposure to price moving out of range. No APR is guaranteed.

The app also has a V2-to-V3 migration flow; review the destination fee tier and range before confirming. See [V2 versus V3](/achswap/v2-vs-v3), [concentrated liquidity](/achswap/concentrated-liquidity), and [pool contracts](/technical/contract-addresses).
