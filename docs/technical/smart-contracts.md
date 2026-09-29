---
sidebar_position: 1
---

# Smart contracts

AchSwap's Arc Mainnet deployment has two parts: its own V2/V3 liquidity contracts and the swap aggregator. The frontend manifest is the address source for the app; the [address reference](/technical/contract-addresses) records those contracts and the aggregator's seven active adapters.

## AchSwap pools

The **V2 factory** creates constant-product pairs and the **V2 router** handles ordinary swaps and liquidity. LP shares are fungible tokens.

The **V3 factory** creates concentrated-liquidity pools. The **SwapRouter** executes swaps, the **Quoter02** provides off-chain quotes via calls, and the **NonfungiblePositionManager** owns NFT positions. AchSwap V3 uses a **legacy SwapRouter with a deadline**, not SwapRouter02. The migrator supports V2-to-V3 position migration.

## Aggregator

The **AchQuoteEngine** quotes the registered adapters and returns route data. The **AchExecutionRouter** executes the selected route and enforces its minimum output and fee ceiling. The **AchFeeController** supplies the current protocol fee and recipient; the **AchVault** credits protocol fees. Separate periphery contracts support Arc native-USDC input and mixed-DEX multi-hop execution.

Adapters are connected to Uniswap V2/V3/V4, AchSwap V2/V3, Synthra V3, and UnitFlow V3. An adapter can be registered even when no pool for a requested pair is initialized or sufficiently liquid. A route is only executable if the current quote and transaction checks pass.

## Arc USDC

The ERC-20 USDC predeploy at `0x3600000000000000000000000000000000000000` has 6 decimals. Native USDC uses 18-decimal transaction units, representing the same balance. The aggregator's native adapter converts between those scales; ordinary routers and pool positions use the ERC-20 representation. The routers' WETH placeholder is an unsupported contract, so ETH-path router methods are not used on Arc.

## Gasless

**AchSponsoredExecutorV3** runs gasless swaps. The user signs one Permit2 witness that binds the whole swap. An allowlisted relayer submits it and pays the gas. The executor pulls the exact input through Permit2, calls the allowlisted KyberSwap, LI.FI or AchSwap router with the signed calldata, and enforces the minimum on the user's actual balance increase. Inputs are limited to USDC, EURC and cirBTC; output tokens are not restricted. See [gasless architecture](/technical/gasless).

AchSwap's own V4 liquidity is not deployed on Arc Mainnet. Uniswap V4 is an independent registered aggregator source. See [fees](/technical/fee-structure) and [smart routing](/achswap/smart-routing).
