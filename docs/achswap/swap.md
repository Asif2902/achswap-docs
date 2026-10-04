---
sidebar_position: 1
---

# Swap tokens

1. Open the Arc Mainnet version of AchSwap and connect your wallet on [Arc Mainnet](/getting-started/network-setup). Check that the chain ID is 5042.
2. Choose the input and output tokens, and enter an amount.
3. Review the estimated output, minimum received, price impact and route before confirming.

Your wallet may ask for an ERC-20 approval for the route's spender. Keep some USDC for gas.

Every quote compares three providers: AchSwap's own router, LI.FI same-chain swaps and KyberSwap. The app shows the one expected to leave you the most, after all fees and the network cost: see [how the best route is chosen](/achswap/smart-routing#how-the-best-route-is-chosen). AchSwap's router covers:

- Uniswap V2, V3 and V4 (including V4 pools with hooks);
- AchSwap V2 and V3;
- Synthra, UnitFlow, Lunya, and the Slipstream DEXs Aero CL, Archery and Topaz;
- DyorSwap, Architex, SushiSwap V3, Bugle and FlutchPad.

Only pools with usable liquidity contribute. LI.FI and KyberSwap are separate routing providers. The winning route reflects the quotes available at that moment, so it can change on refresh.

## Paying with USDC

USDC on Arc is both the gas currency and an ERC-20 token. AchSwap routes can take USDC straight from your balance, so a swap from USDC needs no approval transaction.

## Exact output

Enter an amount in the **To** field to set exactly how much you want to receive. Only AchSwap's router quotes exact output; KyberSwap and LI.FI only quote exact input. The swap spends the quoted input plus your slippage tolerance and guarantees at least the amount you entered. If the price holds, you receive slightly more. See [exact output](/technical/routing-engine#exact-output).

## Route details

Next to the exchange rate, logos show which provider found the route and which DEXs it uses. Open **Trade details** under the quote to see:

- the exchange rate, price impact, minimum received and slippage;
- the network cost, estimated from the route's gas use at Arc's current gas price.

Turn on **Detailed route** in your account menu to also see:

- the route itself, shown as you choose:
  - **Text:** each split, and every hop's DEX, pool fee and pool, with a mark for each pool that was checked.
  - **Map:** an interactive map of the same route. Drag it, and zoom with the controls, the scroll wheel or a pinch.
- what the routes of AchSwap's router, KyberSwap and LI.FI each leave you after their gas, which one is best, and how far behind the others are. A provider can quote a higher amount and still not be best once its gas is paid: see [how the best route is chosen](/achswap/smart-routing#how-the-best-route-is-chosen).

Only one route view is shown at a time. These settings only affect what is displayed and never change a quote. See [smart routing](/achswap/smart-routing#route-details).

When you confirm a swap, **Show more** in the confirmation repeats the route and the network cost.

## Settings

The swap settings panel controls:

- slippage tolerance;
- transaction deadline;
- quote refresh interval;
- an optional recipient address.

Price impact is what the route pays against market reference prices, before the AchSwap fee, and it is measured the same way for every provider. High price impact means the trade is large relative to the available liquidity, or the route goes through high-fee pools. Check the route and the minimum received: a higher slippage tolerance does not create liquidity or improve the quoted price.

See [smart routing](/achswap/smart-routing), [gasless swaps](/achswap/gasless), [fees](/technical/fee-structure) and [contract addresses](/technical/contract-addresses).
