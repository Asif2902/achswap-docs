---
sidebar_position: 2
description: "Automatic mode lets your AI assistant swap, add liquidity and bridge from your agent wallet without asking each time, within limits you sign. Setup, deposits, limits, gas, stopping it and what protects your funds."
---

# Automatic mode and the agent wallet

In Automatic mode your AI assistant trades for you without asking each time: you ask, it does it and tells you the result. It trades from your **agent wallet**, a separate smart account that your own wallet owns, and only within the limits you sign for that AI app. AchSwap never holds a key to it: you can withdraw, stop an AI app or revoke everything at any time.

## The agent wallet

- **Yours.** It is a smart account (MetaMask's Delegation Framework) whose owner is your wallet. Its address is derived from your wallet's, so it is always the same one.
- **Separate.** The assistant can only use what you deposit there. Your main wallet is never touched.
- **Shown everywhere.** Its address, what it holds and its status appear on the sign-in page and on the **Agent wallet** page in the app (**More → Agent wallet**).
- **Created when needed.** It exists on chain from its first automatic transaction; you can deposit to its address before that.

## Turn it on

1. In your AI app, connect AchSwap (see [AI assistants](/ai/ai-assistants#connect)) and choose **Automatic**.
2. Set the limits for this AI app:

   | Limit | Default |
   | --- | --- |
   | Per trade | $500 |
   | Per day, all your AI apps together | $2,000 |
   | Slippage | 1% (0.5%, 2%, 3% or your own, up to AchSwap's 3% cap) |
   | Tokens | AchSwap's verified tokens only |
   | Active for | 30 days (or 7, or 90) |

3. Sign in with your wallet. The page shows your agent wallet.
4. **The first time only:** press **Set up agent wallet** and sign four permissions (trading, liquidity, bridges, gas). They are free signatures, not transactions. You can also do this on the Agent wallet page.
5. Sign your limits, a short text message. You go back to your AI app in Automatic mode.

Every signature on the way is free; nothing is sent. Smart-contract wallets can't own an agent wallet: sign in with Manual instead. EIP-7702 wallets work.

## Fund it

On the **Agent wallet** page, press **Deposit**, pick a token with the usual token picker (search, or paste an address to import one) and an amount. Your wallet sends it. Keep a little USDC there too: the gas of automatic transactions is repaid from it (see [gas](#gas)).

**Withdraw** works the same way: pick one of the agent wallet's tokens and an amount, or **MAX**. Your wallet signs and sends the withdrawal itself, straight back to your wallet; AchSwap is not involved.

## What it can do

- **Swaps** through AchSwap's router. The output always goes back to the agent wallet.
- **Liquidity** on AchSwap V2 (add, remove) and V3 (open a position in a range, withdraw, collect fees). Positions and withdrawals belong to the agent wallet.
- **Bridges** from Arc through LI.FI's Across, Polymer and LayerSwap bridges, always to **your own wallet's address** on the other chain. Refunds come back to the agent wallet. Bridges into Arc stay in Manual mode.

Before anything is sent, AchSwap checks it against your limits and the price: a swap whose price impact is above your slippage, or a bridge whose guaranteed output falls short of its fees and your slippage, is refused. The assistant gets the reason and tells you.

Each automatic transaction appears on the Agent wallet page under **Recent automatic transactions**, as a sentence ("Swapped 25 USDC for 21.462 EURC") with its status and explorer link.

## Gas

AchSwap's relayer pays each transaction's gas, then takes **exactly that amount** back from the agent wallet's USDC: the gas used times the gas price, which is what Arc charges. Nothing is added. It collects in batches, once about 0.05 USDC is owed, because a collection is itself a transaction.

| Transaction | Gas | About |
| --- | --- | --- |
| Approval (when needed) | ~418,000 | 0.008 USDC |
| Swap | ~658,000 | 0.013 USDC |
| Liquidity | ~530,000–842,000 | 0.011–0.017 USDC |
| Bridge | ~1,410,000 | 0.028 USDC |

The gas permission lets the relayer take back at most **1 USDC a day**, about 40 swaps. If that is used up, automatic transactions wait for the next day. An agent wallet set up when the allowance was lower is offered one signature to raise it.

## Fees

Automatic mode adds no fee. The trade's normal fees apply, as in the app: AchSwap's 0.25% on its swap routes, and on bridges AchSwap's 0.5% with LI.FI's and the bridge's fees. See [fees](/technical/fee-structure#automatic-mode).

## Stop it

- **One AI app, or all:** on the Agent wallet page, **Stop** next to an app (or **Stop all**). It takes one free signature and works at once: that app is back to Manual.
- **From the chat:** ask the assistant to switch back to Manual. It can switch to Manual, never to Automatic.
- **Everything, on chain:** **Revoke on chain** at the bottom of the Agent wallet page disables the agent wallet's permissions with transactions from your own wallet. No AchSwap server can undo it. Your funds stay in the agent wallet; withdraw them whenever you like.
- **Expiry:** each AI app's Automatic mode ends when its period does (7, 30 or 90 days).

## What protects your funds

The chain enforces the permissions you signed, on every transaction:

- funds can only go to AchSwap's contracts, back to the agent wallet, to your own wallet on another chain (bridges), to the two fee wallets of a LI.FI bridge, and up to 1 USDC a day of gas to AchSwap;
- only the allowed contracts and functions can be called, approvals only to AchSwap's contracts and LI.FI;
- only AchSwap's relayer can use the permissions, and only until they expire.

AchSwap's servers enforce the rest: your per-trade and daily limits, slippage, verified tokens and price checks. These are not on chain. If AchSwap's relayer key or servers were compromised, trades inside the fences above could be made at bad prices, up to what the agent wallet holds; the funds still could not be sent to anyone else.

An assistant in Automatic mode acts without asking you first, so text it reads, such as a token's name or a web page, could try to steer it into a trade. Your limits, verified tokens only and the price checks bound what that can cost. **Deposit only what you are willing to let the assistant trade.**

The permissions in detail are in [agent wallet permissions](/technical/agent-wallet).

## If something goes wrong

- **"Your agent wallet is not set up yet":** sign in again with Automatic and press **Set up agent wallet**, or set it up on the Agent wallet page.
- **"Keep at least … USDC in the agent wallet for this transaction's gas":** deposit a little USDC.
- **"Today's gas allowance of the agent wallet is used":** automatic transactions resume within 24 hours.
- **"Over the $… per-trade limit" or the daily limit:** ask for a smaller trade, or sign in again with higher limits.
- **"Automatic mode needs a wallet with its own key":** your wallet is a smart-contract wallet; use Manual mode.
