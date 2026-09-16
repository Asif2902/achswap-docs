---
sidebar_position: 1
---

# Swap tokens

Open the Arc Mainnet version of AchSwap, connect your wallet on [Arc Mainnet](/getting-started/network-setup), choose the input and output tokens, and enter an amount. Verify chain ID 5042, then review the estimated output, minimum received, price impact, and route before confirming. An ERC-20 approval may be required for the selected spender. Keep USDC for gas.

Normal mode compares the AchSwap aggregator, LI.FI same-chain swap, and KyberSwap quotes. The aggregator searches registered Uniswap, AchSwap, Synthra, and UnitFlow sources; only pools with usable liquidity can contribute. LI.FI and KyberSwap are separate routing providers. The selected route is based on the quotes available at that moment, so it may change on refresh.

Tap or click **Aggregator** on the quote row to expand the route map. It displays actual quoted hops and input splits, including DEX and version. You can drag the map and zoom with the controls, scroll wheel, or pinch. A route is shown only when quote data provides it.

You can enter a desired output in the **To** field for exact-output quoting. LI.FI does not provide exact-output quotes in this app. The input estimate and route are refreshed before execution; the transaction can revert if execution no longer meets the quoted limits.

## Settings

The swap settings panel controls slippage, deadline, recipient, and quote refresh interval. In **Profile → Developer mode**, you can enable or disable direct AchSwap V2/V3 quotes, aggregator routes, LI.FI, and KyberSwap. **Deep route search** checks split and mixed-DEX hops; turning it off can speed quotes but may produce a worse price. Normal mode keeps deep search enabled and compares only aggregator, LI.FI, and KyberSwap to limit extra RPC calls.

High price impact means the trade is large relative to available liquidity. Check the route and minimum received; a higher slippage tolerance does not create liquidity or improve the quoted price.

See [smart routing](/achswap/smart-routing), [fees](/technical/fee-structure), and [contract addresses](/technical/contract-addresses).
