---
sidebar_position: 3
---

# Fees

## AchSwap router

Routes from AchSwap's router execute on `AchRouteExecutor`, which charges **0.25% once on the final output**: once per swap, however many splits and hops the route uses. The fee goes to the AchSwap treasury Safe `0x0dbd33291b0bc85e75465d0d7F261b4cF758BCf0`. Fee increases are delayed by two days on chain, and the executor caps its fee at 1%. The quoted net output already accounts for it.

## AchSwap aggregator (legacy path)

The on-chain **base aggregator fee** was **25 basis points (0.25%)** when checked on 16 September 2026. The `AchFeeController` can change it, and eligible accounts may have a lower effective rate via `feeBpsFor(account)`. The controller's configured maximum is 100 basis points (1.00%); check the current controller and the quote before trading.

The execution router deducts the effective fee from **actual gross output**, then credits it to the AchVault for the controller's fee recipient. The on-chain recipient at the check was `0x5820cdcEE868F395eB26fA9b00123f4b7530DC11`; a transfer to the Safe `0x0dbd33291b0bc85e75465d0d7F261b4cF758BCf0` was started on 30 September 2026 and completes when the Safe accepts it. A multi-hop aggregator route can incur the fee on each executed leg. The displayed net quote should account for the applicable fee.

The protocol fee is separate from DEX pool trading fees and network gas.

## LI.FI

LI.FI is a distinct provider. The frontend config sets an **AchSwap integrator fee of 0.25% for LI.FI same-chain swaps** and **0.30% for LI.FI bridge transfers**, in addition to route-specific costs shown by LI.FI. Review the live quote; the provider and exact route determine the total.

## KyberSwap

KyberSwap is a distinct provider. The frontend config sets an **AchSwap integrator fee of 0.25% for KyberSwap swaps**, in addition to route-specific costs shown by KyberSwap. Review the live quote; the provider and exact route determine the total.

## Liquidity and gas

V2 and V3 pools charge their own trading fees, which support liquidity providers. A V3 pool's fee tier is selected per pool. Gas is paid in USDC on Arc Mainnet and varies by transaction and current network conditions. A failed transaction can still consume gas.

See [contract addresses](/technical/contract-addresses) for the controller and vault.
