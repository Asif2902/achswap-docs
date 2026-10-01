---
sidebar_position: 7
---

# V2 versus V3 liquidity

| | AchSwap V2 | AchSwap V3 |
| --- | --- | --- |
| Price coverage | Full range | Position-defined range |
| Ownership | Fungible LP token | NFT position |
| Deposit | Both tokens at the pool ratio | One or both tokens, depending on range |
| Fees | Reflected in pool value | Accrue to the position and can be collected |
| Management | Usually passive | Monitor price and range |

V2 is simpler to maintain. V3 lets you concentrate capital near a chosen price, but an out-of-range position stops earning swap fees and can end up holding mostly one token. Neither version guarantees a return; trading volume, fees, and price movement determine the result.

The app supports migration of a V2 position into V3. Migration does not preserve the same risk profile: choose and review the V3 range and fee tier before confirming. See [add liquidity](/achswap/add-liquidity) and [concentrated liquidity](/achswap/concentrated-liquidity).

AchSwap's router can trade through Uniswap V4 pools, an independent protocol, but AchSwap's own V4 liquidity contracts are not deployed on Arc Mainnet.
