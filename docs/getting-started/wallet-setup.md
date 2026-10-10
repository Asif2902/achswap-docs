---
sidebar_position: 2
description: Connect a wallet to AchSwap on Arc, understand token approvals and Permit2, and check what you sign. AchSwap never asks for your seed phrase.
---

# Wallet setup

AchSwap has no accounts. Your wallet is your identity: it holds your tokens, signs your trades, and is how the Quests page knows your XP.

## Connecting

Click **Connect Wallet** in the app. You can use:

| Option | Good for |
| --- | --- |
| **Browser wallet** (MetaMask, or any wallet that injects into the browser) | Desktop, if you already use one. |
| **WalletConnect** | Mobile wallets: scan the QR code with your wallet app. |
| **Bitget Wallet** | Bitget users, desktop or mobile. |

For the Bridge, you can also connect a Solana wallet (Phantom, Backpack or Solflare) when Solana is the source or destination.

Once connected, check that your wallet is on **Arc Mainnet, chain ID 5042**. [Network setup](/getting-started/network-setup) lists the values if you need to add it by hand.

## Approvals, in plain terms

Before a contract can move a token out of your wallet, you have to give it permission. That permission is an **approval**: a transaction that says "this contract may spend up to this much of this token".

- When you sell a token on AchSwap, your wallet asks for an approval if the swap contract's allowance is too low. By default the app approves exactly the amount of the swap, so the next swap asks again. Turn on **Enable unlimited approval** on the swap page to approve once per token and spender instead; the trade-off is a standing approval. See [approvals](/technical/security#approvals).
- **USDC needs no approval** on AchSwap routes. The router takes it straight from your balance.
- KyberSwap and LI.FI routes need their own approvals, to their own contracts.
- [Gasless swaps](/achswap/gasless) use a one-time approval to Permit2 per token, then a signature for each swap.

Your wallet shows the token, the spender's address and the amount. Check the spender against the [contract reference](/technical/contract-addresses) if you're unsure. You can review and revoke old approvals at any time with an approval-management tool that supports Arc, or by sending an `approve(spender, 0)` transaction for the token.

### Smart-contract wallets

Some wallets are smart contracts, or ordinary wallets upgraded with EIP-7702. They check signatures with their own code, and a few reject valid signatures. On the Bridge, AchSwap detects these wallets and asks for an approval transaction instead of a signature, which works with every wallet.

## Before you sign anything

Make it a habit to check, in the wallet window itself:

1. **The site.** The request should come from `trade.achswap.app`.
2. **The network.** Arc Mainnet, chain ID 5042.
3. **The action.** A swap, an approval or a signature, and the token and amount it names.
4. **The recipient.** Your own address, unless you set another one on purpose.

AchSwap never asks for your seed phrase or private key. Nobody from AchSwap will message you first asking you to sign something.

## Keep some USDC for gas

Every transaction on Arc pays its fee in USDC from the same balance you trade with. Keep a few cents of USDC in your wallet. When you use **MAX** on USDC, the app leaves a small amount for gas so the transaction doesn't fail.
