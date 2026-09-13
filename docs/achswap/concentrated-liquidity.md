---
sidebar_position: 8
---

# Concentrated liquidity

An AchSwap V3 position supplies liquidity between a lower and an upper price. The pool price moves across discrete **ticks**; the selected fee tier determines the allowed tick spacing. The app aligns the chosen range to valid ticks when it creates a position.

While the current price is **inside** the range, both assets can be held and the position can earn a share of swap fees. When price moves **outside** the range, the position becomes mostly one asset and stops earning swap fees until price returns. A one-sided deposit is possible when the selected range lies entirely on one side of the current price.

A narrow range concentrates liquidity but requires closer monitoring and may move out of range quickly. A wider range is less concentrated. Fee income can be offset by adverse price movement relative to holding the tokens separately.

To change a range, manage or withdraw the existing position and create a new one with the desired bounds. Review the token amounts and current price again before submitting. See [add liquidity](/achswap/add-liquidity) and [remove liquidity](/achswap/remove-liquidity).
