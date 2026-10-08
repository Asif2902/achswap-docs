---
sidebar_position: 2
---

# How to earn XP

| Source | XP | When it is added |
|---|---|---|
| Swaps | 1 per step of the daily ladder | Daily, after 00:00 UTC |
| Bridges | 1.2 per step, on a ladder of their own | Daily, after 00:00 UTC |
| Liquidity | 0.5 per step a day, × up to 1.75 for holding | Daily, after 00:00 UTC |
| Daily GM | 1 a day, +20 on every 30th day in a row | At once |
| Tasks | The task's reward (25 for most) | At once |
| First username | 20, once | At once |
| Referrals | 10% of your friends' swap, bridge and liquidity XP | Daily, after 00:00 UTC |

## The daily ladder

Swaps, bridges and liquidity are not paid per dollar. Each UTC day, your total climbs a doubling ladder, and every step reached earns XP:

| Day's total | Steps | | Day's total | Steps |
|---|---|---|---|---|
| $1 | 1 | | $1,000 | 10 |
| $2 | 2 | | $10,000 | 14 |
| $10 | 4 | | $100,000 | 17 |
| $100 | 7 | | $524,288 or more | 20 (the top) |

Your first dollars count the most, so a new user sees progress on day one, and a hundred times the money earns only about seven more steps. Splitting a trade into smaller ones earns nothing extra: what counts is the day's total.

## Swaps and bridges

- **Swaps** earn 1 XP per step of the day's swap total.
- **Bridges** earn 1.2 XP per step on a ladder of their own, so a wallet that both swaps and bridges earns more than one that puts everything into either.
- **What counts:** swaps made on AchSwap, whichever route fills them (AchSwap's router, KyberSwap or LI.FI, gasless swaps included), and bridges made through AchSwap's bridge. A swap or bridge counts only when it paid AchSwap's fee; trades made on other sites do not.
- **Genesis:** swaps and bridges on 16 to 19 September 2026 (UTC), Arc Mainnet's first days, earn 1.5 times (bridges 1.8 times).
- **History:** everything since Arc Mainnet's launch on 16 September 2026 counts, once. A transaction recorded late (a bridge that completes after it starts, for example) is added by the next daily distribution and never counted twice.

Example: $60 and $40 of swaps in one day make $100, 7 steps: 7 XP. $50 of bridges the same day reaches 6 steps on the bridge ladder: 7.2 XP.

## Liquidity

| Rule | |
|---|---|
| Pools | AchSwap V2 and V3 pools on Arc of **USDC/EURC**, **USDC/Circle BTC**, **USDC/Gold** (XAUM) and **USDC/WETH**. Other pools earn no XP |
| Rate | Your liquidity in those pools, added up, climbs the same ladder: 0.5 XP a day per step. $200 earns 4 XP a day, $1,000 earns 5, $1,000,000 earns 10 |
| Minimum hold | 24 hours. Liquidity starts earning only after it has been held 24 hours, and only for the time held after that |
| Holding boost | × 1.00 from 24 hours, × 1.25 from 7 days, × 1.50 from 14 days, × 1.75 from 30 days |
| V3 positions | Earn only while in range. Out of range, they keep their age but earn nothing |
| Checked | Every 30 minutes; each check pays a 48th of the day's rate |

How holding time is counted:

- **Adding to a position:** the added liquidity is new and waits its own 24 hours. It never borrows the age of what was already there.
- **Removing part of a position:** what you added most recently goes first, so what stays keeps its age.
- **Removing and adding back within 30 minutes:** counted as new liquidity; it starts again.
- **Moving a position to another wallet** (an LP token transfer, a V3 NFT transfer): it starts again in the new wallet.
- **Several positions:** they share one ladder, so splitting the same liquidity across positions earns nothing extra.

Liquidity held for 6 hours and then removed earns nothing. Held for 30 hours, it earns for the last 6.

## Daily GM

Say GM once per UTC day on the Tasks page for 1 XP. Every 30th day in a row adds 20 XP, so 30 days in a row earn 50 XP, and every 30 days after that earn 50 again, for as long as the streak lasts. Missing a day resets the streak. GM resets at 00:00 UTC.

## Tasks

| Task | XP | How it is checked |
|---|---|---|
| Set a username | 20, once | Your first username |
| Post about AchSwap | 25 | **Post on X** opens X with the text filled in. Post it (you may add to it), then paste the link to your post. The post must be public and contain the text. Each post, and each X account, counts once per task |
| Join Telegram | 25 | Join the channel, then sign in with Telegram on the page so membership can be checked |
| Join Discord | 25 | Connect Discord and join the server; membership is checked |
| Limited tasks | As shown | Tasks added by the AchSwap team, each with its own reward and check. Some have an end time: the card counts down, and the task closes at that moment |

Each task pays once per wallet. Its XP is added the moment it is verified.

## Referrals

- **Your link:** the Invite page shows your invite link. A friend who opens it and connects a wallet is tied to you, once and for good. A wallet has one referrer, and you cannot refer yourself.
- **What you earn:** 10% of the XP your friends earn from swaps, bridges and liquidity. Not from their GM, tasks or own referrals.
- **Weekly limit:** up to 2,500 referral XP per UTC week (Monday to Sunday), across everyone you invite. XP above it is not paid or carried over.
- **Confirmation:** a referral is confirmed when your friend first earns swap, bridge or liquidity XP.

## Who does not earn

AchSwap's own wallets (the deployer and the gasless relayers) earn no XP of any kind and are not on the leaderboard. AchSwap's contracts never earn either.

The bridge multiplier, the liquidity rate and boosts, and the referral share and weekly limit are settings AchSwap can change. Changes apply from the next distribution and are shown on the Quests page.
