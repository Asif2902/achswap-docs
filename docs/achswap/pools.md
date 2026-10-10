---
sidebar_position: 5
---

# Pools

:::info Status, 10 October 2026
The **pool page** described below (charts, depth, order book and trade costs for each pool) is built but **not yet live** on trade.achswap.app. The pool list on the Liquidity page is live. This page will describe the live behaviour once the pool page is released.
:::

A pool holds two tokens that traders swap against. Liquidity providers deposit those tokens and earn a fee from every swap. AchSwap has its own **V2** and **V3** pools on Arc. AchSwap's router also trades through other DEXs' pools, but this page is about AchSwap's own.

## The pool list

The **Liquidity** page lists every AchSwap pool with its all-time volume, number of swaps, version and fee tier. Search by token name, symbol or address, and filter by version.

- Click a row to open that pool's page.
- Click **Add** to go straight to depositing into it.

## The pool page

Each pool has its own page at `trade.achswap.app/liquidity/pool/<pool address>`. Use the ⇅ button next to the pair name to flip which token is priced in which. USDC, then EURC, is the default quote token, so EURC/USDC shows the EURC price in USDC.

**Swap** and **Add liquidity** sit at the top of the page, so you can act on what you see.

### Stats

| Figure | What it means |
| --- | --- |
| **Pool balances** | How much of each token the pool holds right now, and how its value splits between the two. |
| **TVL** | Total value locked: the pool's two balances at current market prices. A token without a market price is listed and not counted. |
| **24H volume** | The value of all swaps through this pool in the last 24 hours. |
| **24H fees** | What those swaps paid to liquidity providers: volume × the fee tier. |
| **Fee APR** | The last 24 hours of fees, annualised, over today's TVL. A rough guide, not a forecast. One busy day can make it look high, and a quiet one low. |
| **All-time volume** | Every swap since the pool was created, with its total fees. |

Fee APR only counts trading fees. It leaves out price movement, which can matter more. If one token falls against the other, the value of your deposit can drop by more than the fees earned. Read [concentrated liquidity](/achswap/concentrated-liquidity) before relying on it.

### Charts

The chart card has four tabs.

**Price.** The pool's own price after every swap, as a stepped line, because the price only changes when someone trades. Pick 24H, 7D, 30D or All. The figure next to the price is the change over the period you picked.

**Volume.** Swap volume per hour (24H) or per UTC day (longer periods). Hover a bar for its fees and swap count.

**Liquidity.** How much liquidity sits at each price. Each bar is a price range. The highlighted bar holds the current price, and only that range earns fees right now. Bars below it hold the quote token, ready to buy as the price falls; bars above it hold the base token, ready to sell as it rises. Zoom with the − and + buttons. A V2 pool spreads its liquidity evenly across every price, so its chart is flat.

**Depth.** How much it takes to move the price. The red side (asks) shows how much of the base token you could buy before the price rises to each level. The teal side (bids) shows how much you could sell before it falls to each level. Hover anywhere and the chart marks the same move both ways: for example, what it takes to move the price +2% and −2%, with the price, amount and USD value at each. Use the zoom buttons to look from ±1% out to ±50%.

A steep, tall depth chart means a deep pool: large trades barely move the price. A shallow one means even small trades move it a lot.

### The order book

Next to the depth chart is an order-book-style ladder: asks (red) above, bids (teal) below, with the spread between them.

A pool has no orders. Each row shows what the pool would trade within one small price step (0.01%), at that step's average price with the fee included. The faint bar behind each row shows its size. The ladder opens centred on the spread. Scroll up for higher prices, down for lower ones.

**Spread** is the gap between the best price to buy and the best price to sell at a tiny size. For a pool it's roughly one fee each way, so a 0.30% pool has a spread of about 0.60%.

### Cost by trade size

A table of what a trade of $1, $10, $100 and so on up to $1,000,000 would cost against the pool's current state:

- **Buy**: how far above the current price you would pay.
- **Sell**: how far below it you would receive.
- **Round trip**: the cost of buying and selling straight back.

These are exact calculations against the pool's live state, fees included. Sizes that would move the price more than 25% are left out. This table covers this one pool only. A real swap is routed across every pool on Arc and usually does better.

### Transactions

The latest swaps, deposits and withdrawals, with the time, type, value, amounts and the wallet that made each one. Click the time to open the transaction on the explorer, or the wallet to see its other activity.

## Before adding liquidity

Check these on the pool page:

- **The token addresses**, under Links. Anyone can create a token with a familiar name.
- **TVL and volume.** A pool with little volume earns little, however high its fee tier.
- **The current price** against the market price elsewhere. A pool whose price is far from the market will be arbitraged as soon as it has liquidity, at the first depositor's expense.
- **Where the liquidity sits** (Liquidity tab), if you plan a V3 range.

Then follow [add liquidity](/achswap/add-liquidity). V2 pools give you LP tokens; V3 positions are NFTs with their own price range. See [V2 versus V3](/achswap/v2-vs-v3).
