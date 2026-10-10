---
sidebar_position: 2
title: API reference
---

# API reference

Both endpoints take a JSON body and the [API key](/developers/developer-api#authentication) in a header. Base URL: `https://trade.achswap.app/api/v1`.

## Tokens, decimals and amounts

All amounts are **whole-number strings in the token's smallest unit**. For a 6-decimal token, `"1500000"` is 1.5 tokens. Send strings, not JSON numbers: numbers are only accepted up to 2^53, and token amounts often exceed that.

| Token | Address | Decimals | As input |
| --- | --- | ---: | --- |
| USDC, native | `0x0000000000000000000000000000000000000000` (`0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` means the same) | 18 | Sent as the transaction's value. No approval. |
| USDC, ERC-20 | `0x3600000000000000000000000000000000000000` | 6 | Approve the executor first. |
| EURC | `0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1` | 6 | Approve the executor first. |
| cirBTC | `0x171A4217b86A807A64eB94757Db6849fb4bDbAA0` | 8 | Approve the executor first. |
| Any other token | its address | its own | Approve the executor first. |

Native USDC and `0x3600…` are **one balance at two scales**. 1 USDC is `1000000000000000000` as native and `1000000` as the ERC-20. Quoting the same value either way gives the same output.

- **USDC to USDC is refused** with 400: there's nothing to swap.
- **Native input dust.** A native amount that isn't a whole 6-decimal unit has the leftover refunded to the sender.
- **Gas** on Arc is paid in USDC from the same balance. When a user spends their whole USDC balance, leave room for gas.
- **Native output** is paid as native USDC. The recipient, and your fee recipient when there is a fee, must be able to receive it. A contract without a payable `receive` fails simulation with `NativeTransferFailed`.
- **Addresses** may be all-lowercase or correctly checksummed. Mixed case with a wrong checksum is refused, to catch typos.
- **Unsupported tokens.** Tokens with transfer taxes, rebasing balances or transfer restrictions can't be routed and get `422 NO_ROUTE`.

## Fees

| Fee | Rate | Paid in | To |
| --- | --- | --- | --- |
| AchSwap fee | 0.25% today, reported in every response | the output token | AchSwap |
| Your fee | `feeBps`, 0 to 100 (up to 1%) | the output token, in the same transaction | your `feeRecipient` |

Both fees are taken from the route's actual output:

```text
protocolAmount = floor(grossAmountOut × protocolBps / 10000)
partnerAmount  = floor(grossAmountOut × feeBps / 10000)
amountOut      = grossAmountOut − protocolAmount − partnerAmount
```

`amountOut` and `minAmountOut` are already net of both fees, and the minimum is enforced on what the recipient actually receives. The 1% cap on your fee is enforced by the contract.

If AchSwap's fee changes between your quote and the user's transaction, the transaction reverts with `StaleFeeConfig` rather than charging a fee the quote didn't show.

## POST /quote

Prices a trade. Nothing is built or simulated for a particular sender.

### Request

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `tokenIn` | address | yes | Token you pay. See the table above. |
| `tokenOut` | address | yes | Token you receive. |
| `amountIn` | string | yes | Input, in `tokenIn`'s smallest unit. |
| `feeBps` | integer | no | Your fee, 0 to 100. Default 0. |
| `feeRecipient` | address | when `feeBps` > 0 | Receives your fee. Can't be the zero address or the executor. |
| `slippageBps` | integer | no | 0 to 2000. Default 50 (0.5%). Sets `minAmountOut`. |
| `chainId` | integer | no | Must be `5042` if sent. |

### Response

1000 USDC to EURC with a 30 bps fee and 1% slippage:

```json
{
  "chainId": 5042,
  "tokenIn": "0x3600000000000000000000000000000000000000",
  "tokenOut": "0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1",
  "amountIn": "1000000000",
  "amountOut": "884689432",
  "minAmountOut": "875842537",
  "slippageBps": 100,
  "grossAmountOut": "889582133",
  "fees": {
    "token": "0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1",
    "protocolBps": 25,
    "protocolAmount": "2223955",
    "partnerBps": 30,
    "partnerAmount": "2668746",
    "partnerRecipient": "0x7Da3…4100"
  },
  "priceImpactBps": 5,
  "gasEstimate": "256000",
  "route": [
    {
      "shareBps": 10000,
      "hops": [
        { "dex": "Aero CL", "pool": "0x…", "tokenIn": "0x3600…", "tokenOut": "0xbEf5…21c1" }
      ]
    }
  ],
  "requestId": "req_5f2c…"
}
```

| Field | Meaning |
| --- | --- |
| `amountOut` | What the recipient receives at the quoted price, after both fees. |
| `minAmountOut` | The least the recipient will receive: `amountOut` less `slippageBps`. The transaction reverts below this. |
| `grossAmountOut` | The route's output before fees. |
| `fees` | Both fees, in `tokenOut`'s smallest unit. `partnerRecipient` is `null` with no fee. |
| `priceImpactBps` | The route's output against market reference prices, before fees, in basis points. Negative when the route beats the reference. `null` when a token has no reference price. |
| `gasEstimate` | Estimated gas units. Treat it as a guide. `/swap` returns the simulated figure. |
| `route` | One entry per split. `shareBps` is that split's share of the input; `hops` lists each pool in order, with its DEX. A Uniswap V4 pool's `pool` is its 32-byte pool ID. |
| `requestId` | Quote it to support. Also in the `X-Request-Id` header. |

Quotes are indicative: prices move. `/swap` prices the trade again.

## POST /swap

Everything `/quote` takes, plus who sends and who receives. Returns everything `/quote` returns, plus the transaction.

### Request

All `/quote` fields, plus:

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `sender` | address | yes | The address that sends the transaction. It pays `tokenIn` and receives any refund. |
| `recipient` | address | no | Receives `tokenOut`. Default: `sender`. Can't be the zero address or the executor. |
| `deadline` | integer | no | Unix seconds. Must be in the future and at most one hour ahead. Default: 20 minutes from now. |

### Response

The `/quote` fields, plus:

```json
{
  "sender": "0x…",
  "recipient": "0x…",
  "deadline": 1790000000,
  "tx": {
    "to": "0x1B844738455b8060D12839331b35893526E9d314",
    "data": "0x…",
    "value": "0",
    "gas": "645291"
  },
  "approval": {
    "token": "0x3600000000000000000000000000000000000000",
    "spender": "0x1B844738455b8060D12839331b35893526E9d314",
    "amount": "100000000"
  },
  "simulated": true
}
```

| Field | Meaning |
| --- | --- |
| `tx.to` | Always the AchRouteExecutor. |
| `tx.data` | The encoded `execute(...)` call, with `minAmountOut`, the deadline and your fee built in. |
| `tx.value` | The native USDC to send, in 18-decimal units. `"0"` unless the input is native USDC. |
| `tx.gas` | A gas limit: the simulated gas plus headroom. `null` when `simulated` is false. |
| `approval` | For ERC-20 input: the allowance the sender needs on `token` for `spender`. `null` for native input. |
| `simulated` | `true` when the exact transaction was simulated from the sender and succeeded. |

### Executing it

1. If `approval` isn't `null`, read the sender's allowance of `approval.token` for `approval.spender`. If it's below `approval.amount`, send `approve(spender, amount)` and wait for it to confirm.
2. Send `tx` from `sender`, with `to`, `data`, `value` and `gas` exactly as returned.

The API simulates the transaction from the sender before returning it, filling in the balance and allowance the sender will have, so the check works before the approval is sent.

- `simulated: false` means the check couldn't run at that moment. The transaction is still protected by `minAmountOut` and the deadline, but `gas` is `null`: estimate it yourself.
- A transaction that would revert isn't returned. You get `409 SIMULATION_FAILED` with a `reason` instead. See [errors](/developers/errors-and-limits).

Call `/swap` right before your user signs, not when you first show a price. A transaction built minutes earlier is more likely to revert on price movement.

## Contracts

| Contract | Address |
| --- | --- |
| AchRouteExecutor (spender and `tx.to`) | `0x1B844738455b8060D12839331b35893526E9d314` |
| USDC (ERC-20) | `0x3600000000000000000000000000000000000000` |

The executor is source-verified. See [swap execution](/technical/swap-execution) for what `execute` does on chain, and the [contract reference](/technical/contract-addresses) for everything else.
