---
sidebar_position: 1
---

# Smart contracts

AchSwap on Arc Mainnet has four groups of contracts:

- its own V2 and V3 liquidity;
- the swap executor and its adapters, which execute every AchSwap route;
- the gasless executor;
- a helper for paying with native USDC.

Each one is source-verified on [arc.etherscan.io](https://arc.etherscan.io). Addresses are in the [address reference](/technical/contract-addresses).

## AchSwap V2 and V3

The **V2 factory** creates constant-product pairs, and the **V2 router** handles swaps and liquidity. LP shares are fungible tokens.

The **V3 factory** creates concentrated-liquidity pools with fee tiers of 0.01%, 0.05%, 0.3% and 1%. The other V3 contracts:

- The **SwapRouter** executes swaps. It is a legacy SwapRouter that requires a deadline, not SwapRouter02.
- The **QuoterV2** returns quotes through calls.
- The **NonfungiblePositionManager** owns positions as NFTs.
- The **migrator** moves V2 positions to V3.

AchSwap's own V4 contracts are not deployed on Arc Mainnet. Uniswap V4 is an independent protocol that AchSwap routes through.

## Swap execution

**AchRouteExecutor** executes every AchSwap route in one transaction:

- It takes an exact-input plan of up to 8 branches and 32 steps, with up to 8 steps per branch. Each step names an adapter and a pool.
- It moves tokens straight between pools through five **execution adapters**, without any third-party router:
  - native USDC conversion;
  - V2 pairs;
  - V3 and Slipstream pools;
  - Uniswap V4 pools, including hooked pools;
  - Lunya pools.
- It measures what every step actually produced and charges **0.25%** once, on the final output. The fee goes straight to the AchSwap treasury Safe; there is no fee vault.
- It pays the recipient and requires the recipient's real balance increase to reach their minimum. Otherwise the whole transaction reverts.
- It refunds this call's residuals and holds nothing between transactions.

The executor does not discover routes. AchSwap's [routing engine](/technical/routing-engine) computes them, and anyone can encode one. The interface, route encoding, adapter payloads and safety rules are on the [swap execution](/technical/swap-execution) page.

## Gasless

**AchSponsoredExecutorV3** runs gasless swaps:

1. The user signs one Permit2 witness that binds the whole swap.
2. An allowlisted relayer submits it and pays the gas.
3. The executor pulls the exact input through Permit2 and calls an allowlisted target (KyberSwap, LI.FI or AchRouteExecutor) with the signed calldata.
4. The executor checks the minimum against the user's actual balance increase.

Inputs are limited to USDC, EURC and cirBTC. Output tokens are not restricted. See [gasless architecture](/technical/gasless).

## Native USDC helper

**AchArcNativeUsdcAdapter** adds liquidity to AchSwap's own V2 and V3 contracts, and swaps on them, with USDC paid from the native balance. This saves the separate approval transaction.

## Arc USDC

The ERC-20 USDC at `0x3600000000000000000000000000000000000000` has 6 decimals. Native USDC uses 18-decimal units and is the same balance. AchRouteExecutor accepts and pays either form: adapter 1 converts between them at exactly 10¹², and the executor treats both as one balance. Pools and ordinary routers use the ERC-20 form. The V2/V3 routers' WETH placeholder is an unsupported contract, so their ETH-path methods are not used on Arc.

## What the owners can and cannot do

| Contract | The owner can | The owner cannot |
| --- | --- | --- |
| AchRouteExecutor | Pause execution. Disable an adapter. Add an adapter after a 2-day delay. Lower the fee at once, or raise it after a 2-day delay, up to 1%. Change the fee recipient after a 2-day delay, and only if the new recipient accepts. | Move user funds. Apply a new fee to a plan built under the old one (the plan carries the fee version). Point an existing adapter id at different code. Renounce ownership. |
| Execution adapters | Deny a Uniswap V4 hook (adapter 4 only). | Change factories, fees, callback selectors or the PoolManager. Call an adapter at all: only the executor can. |
| AchSponsoredExecutorV3 | Curate the input tokens, targets, spenders and relayers. Pause. | Change a signed swap, or pull more than the signed amount. |

## Verification

All live contracts are verified on [arc.etherscan.io](https://arc.etherscan.io) with exact source matches and constructor arguments. The executor and its adapters were compiled with solc 0.8.24 (via-IR, optimizer 200 runs, EVM cancun). Their deployed runtime bytecode matches the verified sources.

See [fees](/technical/fee-structure) and [smart routing](/achswap/smart-routing).
