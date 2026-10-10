---
sidebar_position: 7
---

import {V2V3Comparison} from '@site/src/components/LiquidityDiagrams';

# V2 versus V3 liquidity

AchSwap has two kinds of pool. Both let you earn a share of trading fees; they differ in **where along the price curve your deposit works**.

<V2V3Comparison />

**V2 (constant product).** A V2 pool keeps the product of its two balances constant: `x × y = k`. Every trade moves the price along that curve, and your deposit backs every price from zero to infinity. Most of it sits at prices the market rarely visits, so each dollar earns a small share of fees, but the position never goes out of range and needs no upkeep.

**V3 (concentrated liquidity).** A V3 position works only between a minimum and maximum price that you choose. Because the same deposit covers a shorter stretch of the curve, it provides far more liquidity there and earns more fees per dollar while the price is inside. When the price leaves the range, the position holds one token only and earns nothing until the price returns. See [concentrated liquidity](/achswap/concentrated-liquidity).

| | AchSwap V2 | AchSwap V3 |
| --- | --- | --- |
| Price coverage | Full range | Position-defined range |
| Fee tiers | 0.30% | 0.01%, 0.05%, 0.30%, 1%, 10% |
| Ownership | Fungible LP token | NFT position |
| Deposit | Both tokens at the pool ratio | One or both tokens, depending on range |
| Fees | Added to the pool; collected when you withdraw | Accrue to the position; collect any time |
| Out of range | Never | Earns nothing while outside |
| Management | Usually passive | Monitor price and range |

V2 is simpler to maintain. V3 lets you concentrate capital near a chosen price, but an out-of-range position stops earning swap fees and can end up holding mostly one token. Neither version guarantees a return; trading volume, fees and price movement determine the result. See [liquidity earnings and risks](/achswap/liquidity-earnings).

The app supports migration of a V2 position into V3. Migration does not preserve the same risk profile: choose and review the V3 range and fee tier before confirming. See [add liquidity](/achswap/add-liquidity#moving-a-v2-position-to-v3).

AchSwap's router can trade through Uniswap V4 pools, an independent protocol, but AchSwap's own V4 liquidity contracts are not deployed on Arc Mainnet.
