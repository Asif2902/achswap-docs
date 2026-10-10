---
sidebar_position: 1
---

# AchSwap on Arc

AchSwap is a decentralized exchange on **Arc Mainnet** (chain ID 5042). You can swap tokens, provide liquidity, bridge assets to and from Arc, and earn XP for using it. You keep custody the whole time: every action is a transaction or a signature from your own wallet.

## What you can do

| | |
| --- | --- |
| [Swap](/achswap/swap) | Trade any two tokens on Arc. Each quote compares AchSwap's own router with KyberSwap and LI.FI and uses whichever leaves you the most. |
| [Gasless swaps](/achswap/gasless) | Pay with USDC, EURC or cirBTC by signing once. A relayer pays the network fee. |
| [Liquidity](/achswap/add-liquidity) | Deposit into AchSwap V2 or V3 pools and earn a share of every swap's fee. |
| [Pools](/achswap/pools) | Look up any AchSwap pool: price history, volume, liquidity, depth and recent trades. |
| [Bridge](/achswap/bridge) | Move tokens between Arc and other chains, Solana included, through LI.FI. |
| [Explore](/achswap/explore) | Browse and search Arc tokens by price, volume and liquidity. |
| [Quests and XP](/quests/overview) | Earn XP for swaps, bridges, liquidity and a daily GM, level up, and climb the leaderboard. |
| [Analytics](/achswap/analytics) | See how much has been traded through AchSwap, day by day. |
| [Developer API](/developers/developer-api) | Get AchSwap quotes and ready-to-sign swap transactions in your own app. |

## How a swap finds its price

AchSwap's router reads the pools of every supported DEX on Arc and looks for the route that pays the most. It can split one trade across several pools and chain up to three hops. Before a quote is shown, the exact transaction is simulated against the live contracts, so the amount you see is what the contract would pay at that moment.

It covers:

- Uniswap V2, V3 and V4, including V4 pools with hooks;
- AchSwap V2 and V3;
- Synthra, UnitFlow, Slipstream (Aero CL, Archery, Topaz) and Lunya;
- DyorSwap, Architex, SushiSwap V3, Bugle and FlutchPad;
- Virtuals launch curves, for tokens that have not yet moved to a regular pool.

An AchSwap route settles in one transaction on the `AchRouteExecutor` contract, which takes a single 0.25% fee from the output. See [smart routing](/achswap/smart-routing) for how routes are compared and [fees](/technical/fee-structure) for every fee in one place.

## USDC is also gas

Arc pays network fees in USDC, so the USDC in your wallet is both a token you can trade and the balance your fees come from. The same balance shows up in two forms: a 6-decimal ERC-20 at `0x3600000000000000000000000000000000000000` and an 18-decimal native currency. They are not two separate tokens. When you spend all your USDC, the app keeps a little back so the transaction can still pay its fee. [Network setup](/getting-started/network-setup) explains this in more detail.

## Where to start

1. [Set up your wallet](/getting-started/wallet-setup) and [add Arc](/getting-started/network-setup).
2. Follow the [quick start](/getting-started/quick-start) for your first swap.
3. Read [add liquidity](/achswap/add-liquidity) before depositing into a pool.

Building on AchSwap? Start with the [Developer API](/developers/developer-api). Every contract address is in the [contract reference](/technical/contract-addresses).
