---
sidebar_position: 1
---

# Swap tokens

1. Open the Arc Mainnet version of AchSwap and connect your wallet on [Arc Mainnet](/getting-started/network-setup). Check that the chain ID is 5042.
2. Choose the input and output tokens, and enter an amount.
3. Review the estimated output, minimum received, price impact and route before confirming.

Your wallet may ask for an ERC-20 approval for the route's spender. Keep some USDC for gas.

Every quote compares three providers: AchSwap's own router, LI.FI same-chain swaps and KyberSwap. The app shows the one that leaves you the most after all fees. AchSwap's router covers:

- Uniswap V2, V3 and V4 (including V4 pools with hooks);
- AchSwap V2 and V3;
- Synthra, UnitFlow, Slipstream (including Aero CL) and Lunya;
- several other V2 and V3 forks.

Only pools with usable liquidity contribute. LI.FI and KyberSwap are separate routing providers. The winning route reflects the quotes available at that moment, so it can change on refresh.

## Paying with USDC

USDC on Arc is both the gas currency and an ERC-20 token. AchSwap routes can take USDC straight from your balance, so a swap from USDC needs no approval transaction.

## Exact output

Enter an amount in the **To** field to set exactly how much you want to receive. Only AchSwap's router quotes exact output; KyberSwap and LI.FI only quote exact input. The swap spends the quoted input plus your slippage tolerance and guarantees at least the amount you entered. If the price holds, you receive slightly more. See [exact output](/technical/routing-engine#exact-output).

## Route details

Open **Trade details** under the quote for the exchange rate, minimum received, price impact and fees. To see the routing map there, turn on **Detailed route** in your account menu. The map shows each split, its share of your input, and every pool on its path with its DEX. You can drag it, and zoom with the controls, the scroll wheel or a pinch. The setting only affects what is displayed and never changes a quote.

## Settings

The swap settings panel controls:

- slippage tolerance;
- transaction deadline;
- quote refresh interval;
- an optional recipient address.

High price impact means the trade is large relative to the available liquidity. Check the route and the minimum received: a higher slippage tolerance does not create liquidity or improve the quoted price.

See [smart routing](/achswap/smart-routing), [gasless swaps](/achswap/gasless), [fees](/technical/fee-structure) and [contract addresses](/technical/contract-addresses).
