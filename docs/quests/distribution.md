---
sidebar_position: 3
---

# When XP is added

There is nothing to claim. XP goes straight into your total, your level and your rank.

| Source | Added |
|---|---|
| Daily GM, tasks, first username | The moment they are done |
| Swaps, bridges, liquidity, referrals | Every day shortly after 00:00 UTC, for the UTC day that just ended |

Swaps, bridges and liquidity wait for the end of the day because they are counted on the day's total ([the daily ladder](/quests/earning-xp#the-daily-ladder)). Until then, the Overview shows them as **Next distribution**: what the next daily distribution will add for you, worked out with the same calculation. **Last distribution** shows when the most recent one ran.

## The daily distribution

Every day at 00:05 UTC, AchSwap adds the day that just ended to every wallet: its swaps, bridges, liquidity and referral shares. If a day was missed (for maintenance, for example), the next distribution adds every missed day, in order. Nothing is lost by waiting, and nothing is added twice: every award is recorded once, under its own day and source.

Your **XP history** on the Overview lists every award: its date, its source and its XP.

## Counted once

- Each swap and bridge counts once, however often it is read or re-checked. A transaction recorded late is added by the next distribution.
- Each task, each GM and each referral share is paid once.
- Liquidity XP is counted every 30 minutes and added once for each day.

## Points from the earlier program

XP replaced the earlier Points program. Task and GM points from it were carried over as XP. Its liquidity and volume points came from the test network and were not; swaps and bridges on Arc Mainnet are counted again from the volume record instead, from 16 September 2026, once.

## If XP is missing

1. **Check the timing.** Swaps, bridges, liquidity and referrals are added after the UTC day ends, by the distribution that runs shortly after 00:00 UTC. Tasks and GM are added at once.
2. **Check the activity counts.** It must be made through AchSwap, with the same wallet, and (for swaps and bridges) pay AchSwap's fee. Liquidity must be in an [eligible pool](/quests/earning-xp#liquidity), held 24 hours, and in range for V3.
3. **Check the ladder.** XP comes per doubling step, so $1.50 of swaps earns the same as $1, and the next step comes at $2.
4. **Check the history.** The Overview's XP history lists every award by day and source, once the Quests page is open to you.

Still missing after the next distribution? Email [support@achswap.app](mailto:support@achswap.app) with your wallet address, the transaction hash, and the UTC date. Never send a seed phrase or private key, or sign a message for anyone who says they need it to "check" your XP. See [troubleshooting](/help/troubleshooting#why-hasnt-my-xp-appeared).

## Rule changes

| Date | Change |
| --- | --- |
| 2026-10-08 | Seven badge tiers, one badge per level. Daily GM pays 1 XP, plus 20 on every 30th day in a row. |
| 2026-10-06 | XP tiers on profiles; invite links can use your username. |
| 2026-10-05 | Liquidity earns in full whether or not the wallet also swaps. Liquidity must be held a strict 24 hours before it earns. XP is distributed by the daily distribution only; there is nothing to claim. Profile pictures. |
| 2026-10-04 | XP program V2: one doubling ladder for swaps, bridges and liquidity; 20 levels; task and GM XP added at once. Replaced the earlier Points program. |

The bridge multiplier, the liquidity rate and holding boosts, and the referral share and weekly limit are settings AchSwap can change. A change applies from the next distribution and is listed here.

## Questions

### I did a task. When do I get the XP?

At once. Refresh the page if your total has not changed.

### I swapped today. Why has my XP not changed?

Swaps, bridges and liquidity are added after the UTC day ends, by the daily distribution shortly after 00:00 UTC. Until then they show as **Next distribution** on the Overview.

### Why did my liquidity earn nothing?

Check that the pool is one of the [eligible pairs](/quests/earning-xp#liquidity), that the liquidity has been held 24 hours, and, for V3, that the position is in range. Liquidity added to a position waits its own 24 hours.

### Why did my post not verify?

The post must be public, contain the task's text, and not have been used for the task before, by you or another wallet. Paste the link to the post itself (`x.com/<name>/status/…`). If X cannot be reached, the page says so: try again shortly.

### Does a bigger trade earn proportionally more?

No. The daily ladder doubles: $100 is 7 steps, $1,000 is 10 and $100,000 is 17. Using swaps, bridges and liquidity together earns the most.
