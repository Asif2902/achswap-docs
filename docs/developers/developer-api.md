---
sidebar_position: 1
title: Developer API
---

# Developer API

The AchSwap Developer API gives your application AchSwap's best route on Arc Mainnet (chain 5042): exact-input quotes, and ready-to-sign swap transactions with an optional fee for you.

| | |
| --- | --- |
| Base URL | `https://trade.achswap.app/api/v1` |
| Endpoints | `POST /quote`, `POST /swap` |
| Format | JSON in, JSON out |
| Network | Arc Mainnet, chain id `5042` |
| Executes on | AchRouteExecutor `0x1B844738455b8060D12839331b35893526E9d314` |

## Get an API key

Email **[support@achswap.app](mailto:support@achswap.app)** with:

- your project's name and website;
- what you will use the API for, and roughly how many requests a day;
- a contact for technical and security notices.

You receive one key. Keep it secret and call the API from your server: responses carry no CORS headers, so browsers on other sites cannot read them. AchSwap stores only a hash of the key, so a lost key cannot be recovered; ask for a new one and the old one is revoked.

## Authentication

Send the key with every request, in either header:

```http
x-api-key: ach_dev_…
Authorization: Bearer ach_dev_…
```

## Tokens, decimals and amounts

Amounts are whole-number strings in the token's smallest unit.

| Token | Address | Decimals | As input |
| --- | --- | ---: | --- |
| USDC, native | `0x0000000000000000000000000000000000000000` (`0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` means the same) | 18 | Sent as the transaction value. No approval. |
| USDC, ERC-20 | `0x3600000000000000000000000000000000000000` | 6 | Approve the executor first |
| Any other token | its address | its own | Approve the executor first |

Native USDC and `0x3600…` are **one balance at two scales**: 1 USDC is `1000000000000000000` native or `1000000` ERC-20.

- **USDC to USDC is refused** (400): there is nothing to swap.
- **Gas** on Arc is paid in USDC from the same balance, so leave room for it when spending a whole balance.
- **Native output** is paid as native USDC. The recipient, and your fee recipient when there is a fee, must be able to receive it.
- **Checksums.** Mixed-case addresses must carry a valid checksum; all-lowercase is accepted.

## Fees

| Fee | Rate | Paid in | To |
| --- | --- | --- | --- |
| AchSwap fee | 0.25% (reported live in every quote) | the output token | AchSwap |
| Your fee | `feeBps`, 0 to 100 (1%) | the output token, in the same transaction | your `feeRecipient` |

- `amountOut` and `minAmountOut` are already net of both fees, and the minimum is enforced on what the recipient actually receives.
- `feeRecipient` is required when `feeBps` is above 0. It cannot be the zero address or the executor.

## POST /quote

| Field | Required | Meaning |
| --- | --- | --- |
| `tokenIn`, `tokenOut` | yes | Token addresses (see above) |
| `amountIn` | yes | Input in tokenIn's smallest unit |
| `feeBps` | no | Your fee, 0 to 100 (default 0) |
| `feeRecipient` | with `feeBps` > 0 | Receives your fee |
| `slippageBps` | no | 0 to 2000 (default 50); sets `minAmountOut` |
| `chainId` | no | `5042` if sent |

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
    "protocolBps": 25, "protocolAmount": "2223955",
    "partnerBps": 30, "partnerAmount": "2668746", "partnerRecipient": "0x…"
  },
  "priceImpactBps": 5,
  "gasEstimate": "256000",
  "route": [{ "shareBps": 10000, "hops": [{ "dex": "Aero CL", "pool": "0x…", "tokenIn": "0x3600…", "tokenOut": "0xbEf5…" }] }],
  "requestId": "req_…"
}
```

- `amountOut`: what the recipient receives at the quoted price, after both fees.
- `priceImpactBps`: the route's output against reference prices, before fees, in signed basis points; `null` when a token has no reference price.
- `route`: one entry per split, with each hop's DEX, pool and tokens.

Quotes are indicative; a swap request prices again.

## POST /swap

Everything in a quote request, plus:

| Field | Required | Meaning |
| --- | --- | --- |
| `sender` | yes | The address that sends the transaction: it pays `tokenIn` and receives any refund |
| `recipient` | no | Receives `tokenOut` (default: `sender`) |
| `deadline` | no | Unix seconds, in the future and at most an hour ahead (default: 20 minutes) |

The response is everything in a quote, plus:

```json
{
  "sender": "0x…", "recipient": "0x…", "deadline": 1790000000,
  "tx": { "to": "0x1B844738455b8060D12839331b35893526E9d314", "data": "0x…", "value": "0", "gas": "645291" },
  "approval": { "token": "0x3600000000000000000000000000000000000000", "spender": "0x1B844738455b8060D12839331b35893526E9d314", "amount": "100000000" },
  "simulated": true
}
```

To execute:

1. If `approval` is not `null` and the sender's allowance for the spender is below `amount`, send `approve(spender, amount)` on `token` first.
2. Sign and send `tx` from `sender`: `to`, `data`, `value`, and `gas`.

Before the transaction is returned, it is simulated from the sender. `simulated: false` means the check could not run; the transaction is still protected by `minAmountOut` and the deadline, but estimate its gas yourself. A transaction that would revert is answered with `409 SIMULATION_FAILED` instead: request a new quote.

## Errors

Every error is `{ "error": { "code", "message", "reason"? }, "requestId" }`; the same id is in the `X-Request-Id` header. Quote it when you contact support.

| HTTP | `code` | When |
| --- | --- | --- |
| 400 | `INVALID_REQUEST` | A field is missing or invalid; the message names it |
| 401 | `UNAUTHORIZED` | Missing, invalid or revoked key |
| 404 | `NOT_FOUND`, `API_DISABLED` | Unknown path, or the API is temporarily switched off |
| 405 | `METHOD_NOT_ALLOWED` | Not a POST |
| 409 | `SIMULATION_FAILED` | The swap would revert. `reason`: `Slippage`, `Expired`, `Paused`, `StaleFeeConfig`, `InvalidConfig`, `InvalidRoute`, `InvalidValue`, `UnsupportedToken`, `NativeTransferFailed`, or a revert string |
| 413 | `INVALID_REQUEST` | Body above 16 KB |
| 422 | `NO_ROUTE` | No route for this pair and amount |
| 429 | `RATE_LIMITED`, `CONCURRENCY_LIMITED` | Over your key's limit, or too many requests in flight; see `Retry-After` |
| 502 | `INTERNAL` | The route could not be prepared; retry |
| 503 | `OVERLOADED`, `UNAVAILABLE` | Busy or briefly unavailable; retry after `Retry-After` |
| 504 | `TIMEOUT` | Routing took too long; retry |

## Limits

| Limit | Value |
| --- | --- |
| Requests per key | Set on your key (60 a minute unless agreed otherwise), reported in `X-RateLimit-Limit` and `X-RateLimit-Remaining` |
| Requests in flight per key | 2 |
| Request body | 16 KB |

Need more? Email [support@achswap.app](mailto:support@achswap.app).

## Example

```bash
curl -s https://trade.achswap.app/api/v1/quote \
  -H "x-api-key: $ACHSWAP_KEY" \
  -H "content-type: application/json" \
  -d '{"tokenIn":"0x3600000000000000000000000000000000000000","tokenOut":"0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1","amountIn":"1000000","feeBps":30,"feeRecipient":"0xYourFeeAddress"}'
```

## Support

Questions, a new key, higher limits or a security report: **[support@achswap.app](mailto:support@achswap.app)**.
