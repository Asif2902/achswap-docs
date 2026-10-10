---
sidebar_position: 9
---

# Analytics

The **Analytics** page at [trade.achswap.app/analytics](https://trade.achswap.app/analytics) shows how much has been traded through AchSwap. Every figure is counted from records you can check yourself. Nothing is estimated or projected: a day without trades shows zero.

## What's on the page

**Total volume through AchSwap.** Everything swapped and bridged since the first recorded trade, with the number of trades and wallets.

For the period you pick (7D, 30D, 90D or All):

| Figure | What it counts |
| --- | --- |
| **Volume** | The USD value of swaps and bridges together. |
| **Swaps** | Swaps made through AchSwap, and their value. |
| **Bridges** | Bridge transfers made through AchSwap, and their value. |
| **Wallets** | Distinct wallets that made at least one trade. |

Each figure shows the change against the previous period of the same length, for example the last 30 days against the 30 before.

Below the totals:

- **Daily activity**, as a chart of swap and bridge volume per UTC day.
- **Most traded pairs**, by swap volume.
- **Bridge routes**, by the chains funds moved between.

A **Live** dot next to the update time means the figures are current. **Delayed** means the latest records are more than 15 minutes old.

## How trades are counted

**Swaps** are counted when:

- they settle on AchSwap's route executor or gasless executor on Arc, which you can see on the explorer; or
- they were placed on AchSwap and filled by KyberSwap or LI.FI, recognised by the AchSwap fee they carry.

Swaps made directly on other DEXs, or through other apps, are not counted, even when they use the same pools.

**Bridges** are counted from LI.FI's record of each transfer made through AchSwap's bridge. Transfers that were refunded are left out.

**USD values** are fixed when each trade is recorded: USDC at $1, other tokens at their market price at that moment. A trade is never revalued later, so a token's later price moves don't change past volume. A trade whose token has no market price counts as a trade with no volume.

**Days** are UTC days. Each trade is counted once, on the day it happened.

## Privacy

The page shows totals only. Wallets are counted, and no addresses are listed.

## How this differs from pool figures

A [pool page](/achswap/pools) shows the volume of one AchSwap pool, including trades routed into it from other apps. The Analytics page shows trades made through AchSwap, whichever pools they used. The two measure different things, so their numbers don't add up to each other.
