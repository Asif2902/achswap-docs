---
sidebar_position: 1
description: "Connect AchSwap to Claude, ChatGPT, Cursor or another AI app: sign in with your wallet, ask for swaps, bridges and liquidity, and approve each transaction in your wallet (Manual) or let it trade within your limits (Automatic)."
---

# AI assistants

AchSwap works inside AI apps that support remote MCP servers, such as Claude, ChatGPT and Cursor. Once connected, your assistant can read your balances and positions on Arc, look up tokens, prices and pools, and prepare swaps, bridges and liquidity changes for you. AchSwap never holds your keys.

There are two ways it can trade, and you choose one each time you sign in:

| | Manual | [Automatic](/ai/automatic-mode) |
| --- | --- | --- |
| Who sends a transaction | Your wallet, after you approve it | AchSwap's relayer, from your agent wallet |
| Your approval | For every transaction | Once, for the limits you sign |
| Funds used | Your connected wallet | Your agent wallet, only what you deposit |
| Wallets | Any, smart-contract wallets included | A wallet with its own key (EIP-7702 is fine) |

## Connect

1. In your AI app, add a custom connector (or MCP server) with this address:

   ```
   https://trade.achswap.app/mcp
   ```

2. The app opens AchSwap's sign-in page. Choose **Manual** or **Automatic**.
3. Choose a wallet: any browser wallet AchSwap finds, or **WalletConnect** for a phone wallet (QR code, or the wallet's own link on a phone).
4. Sign the sign-in message. It is free and is not a transaction. You go back to your AI app, connected.

In **Automatic**, the page also shows your agent wallet and asks for a few more free signatures. See [Automatic mode](/ai/automatic-mode#turn-it-on).

## What you can ask

- "What's in my wallet?" — your balances on Arc, with their value.
- "Swap 50 USDC to EURC." — a quote from AchSwap's router, then a transaction.
- "Bridge 20 USDC from Base to Arc." — a LI.FI route to the same address on the other chain.
- "Add 100 USDC to the USDC/EURC pool, ±5%." — V2 in the pool's ratio, or V3 in a price range; also removing a share of a position and collecting V3 fees.
- "Show my positions." — your V2 shares and V3 positions, their range and uncollected fees.
- "What's trending on Arc?" — market data from DEX Screener: moves, volume, liquidity and a token's pools, with risk notes. This is data, not advice, and trading still goes through the steps below.

In apps that show them, answers come with AchSwap's cards: the balances, the quote and its route, the transaction's steps, a chart.

## Approving a transaction (Manual)

When you ask for a trade, the assistant prepares it and shows a card: what you pay and receive, the minimum you accept, the fees and each step (an approval for exactly the amount when needed, then the trade).

1. Press **Approve in wallet** on the card. Apps without cards give a signing link instead.
2. Your wallet asks you to confirm. A phone wallet gets the request by WalletConnect. A browser wallet opens AchSwap's signing page, which sends every step as one confirmation when the wallet supports batches, otherwise one step after the other.
3. The assistant follows the transaction until it is confirmed.

Safeguards on every transaction:

- **Fresh price.** A prepared transaction expires after 10 minutes. If its price is more than 30 seconds old when you approve, it is rebuilt; if you would get less or pay more, the card changes and you approve again.
- **Checked steps.** Each step is simulated from your wallet before it reaches it, and can only call AchSwap's executor, V2 router or V3 position manager, or LI.FI. Approvals are for exactly the amount, never unlimited, and never a Permit2 signature.
- **Your address only.** Everything a step pays out goes to the wallet that signs; a bridge pays the same address on the other chain.
- **At most five** prepared transactions are open at once, and one is sent per wallet at a time.

Your wallet's own confirmation is the final check: nothing is sent without it.

## More than one wallet

Ask the assistant to **link another wallet**: it gives you a link where that wallet connects and signs. Ask it to **use** a wallet to switch which one it trades with. A phone wallet's other accounts are listed after you switch to them in the wallet.

## Disconnecting

Remove AchSwap's connector in your AI app to end its access. In Manual mode it can never send anything without your wallet's confirmation anyway. To stop Automatic mode, see [stopping it](/ai/automatic-mode#stop-it).

What AchSwap stores for a sign-in, and for how long, is in the [privacy policy](https://trade.achswap.app/privacy).
