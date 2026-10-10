---
sidebar_position: 8
---

import {RangeStates} from '@site/src/components/LiquidityDiagrams';

# Concentrated liquidity

An AchSwap V3 position supplies liquidity between a lower and an upper price. The pool price moves across discrete **ticks**; the selected fee tier determines the allowed tick spacing (1 tick for 0.01%, 10 for 0.05%, 60 for 0.30%, 200 for 1%, 2,000 for 10%). The app aligns the chosen range to valid ticks when it creates a position.

## What the position holds as the price moves

<RangeStates />

While the current price is **inside** the range, the position holds both tokens and earns a share of swap fees. As the price moves through the range, the position gradually converts one token into the other. When the price moves **outside** the range, the position holds only one token and stops earning swap fees until the price returns.

A **one-sided deposit** is possible when the selected range lies entirely on one side of the current price. It holds a single token, and the app asks for that token only.

## Choosing a range

A narrow range concentrates liquidity but requires closer monitoring and may move out of range quickly. A wider range is less concentrated. Fee income can be offset by adverse price movement relative to holding the tokens separately; a narrower range feels that effect more strongly. See [liquidity earnings and risks](/achswap/liquidity-earnings#v3-range-matters).

To change a range, withdraw the existing position and create a new one with the desired bounds. Review the token amounts and current price again before submitting. See [add liquidity](/achswap/add-liquidity) and [remove liquidity](/achswap/remove-liquidity).
