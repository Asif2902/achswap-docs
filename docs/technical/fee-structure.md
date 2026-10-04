---
sidebar_position: 6
---

# Fees

## AchSwap routes

A route from AchSwap's router executes on `AchRouteExecutor`, which charges **0.25% of the final output, once per swap**, however many splits and hops the route uses. The fee is paid in the same transaction to the AchSwap treasury Safe `0x0dbd33291b0bc85e75465d0d7F261b4cF758BCf0`. There is no fee vault and nothing accrues in the contract.

```text
protocolFee = grossOut × 25 / 10000      (rounded down)
you receive = grossOut − protocolFee
```

`grossOut` is the output the route actually produced, measured on chain. The quoted amount already deducts the fee, and your minimum received applies after it.

On-chain limits:

- The contract caps the protocol fee at **1%**.
- An increase only takes effect two days after it is scheduled. A decrease takes effect immediately.
- Every fee or recipient change bumps the fee-configuration version. A transaction built under the old version reverts instead of paying the new fee, so you always pay the fee your quote showed.

Integrators who call the executor directly may add their own **partner fee** of up to 1%, which is paid to their address in the same way. The AchSwap app does not add one.

## LI.FI

LI.FI is a separate provider. The app adds an **AchSwap integrator fee of 0.25% on LI.FI same-chain swaps** and **0.50% on LI.FI bridge transfers**, on top of the route's own costs shown by LI.FI. Review the live quote, because the provider and route determine the total.

## KyberSwap

KyberSwap is a separate provider. The app adds an **AchSwap integrator fee of 0.25% on KyberSwap swaps**, on top of the route's own costs shown by KyberSwap.

## Comparing providers

The swap screen compares every provider by what its route is expected to deliver: **net output after all fees**, less the route's network cost. A route with a better headline number but a higher fee or more gas does not win by mistake. See [how the best route is chosen](/achswap/smart-routing#how-the-best-route-is-chosen).

## Gasless swaps

Gasless mode adds no fee of its own. The route's normal fees apply, and the relayer pays the gas.

## Pool fees and gas

Each pool charges its own trading fee, which goes to its liquidity providers (on some protocols, partly to the protocol):

- 0.30% for V2 pairs;
- the fee tier for V3 pools;
- the pool's current fee for V4, Slipstream and Lunya pools.

Every quote already includes these fees. Gas is paid in USDC on Arc Mainnet and varies with the transaction and network conditions. A failed transaction can still consume gas.

See [swap execution](/technical/swap-execution) and [contract addresses](/technical/contract-addresses#swap-execution).
