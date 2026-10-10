---
sidebar_position: 1
title: Developer API
---

# Developer API

The AchSwap Developer API gives your application AchSwap's best route on Arc Mainnet. You send a token pair and an amount; it sends back a quote, or a ready-to-sign transaction that executes the swap. You can add your own fee on top, paid to your address in the same transaction.

| | |
| --- | --- |
| Base URL | `https://trade.achswap.app/api/v1` |
| Endpoints | [`POST /quote`](/developers/api-reference#post-quote) and [`POST /swap`](/developers/api-reference#post-swap) |
| Format | JSON in, JSON out |
| Network | Arc Mainnet, chain ID `5042` |
| Executes on | AchRouteExecutor `0x1B844738455b8060D12839331b35893526E9d314` |
| Trades | Exact input. The API doesn't offer exact-output or gasless swaps. |

## How a swap works

Your server talks to the API. Your user's wallet signs and sends the transaction. The API only **prepares** transactions: it never submits anything to the chain, and AchSwap never holds your user's funds or keys.

```mermaid
flowchart TD
  K["API key<br/>(kept on your server)"] --> Q
  subgraph prepare["AchSwap API: prepares, never submits"]
    Q["POST /api/v1/quote<br/>price, minimum, fees, route"] --> S["POST /api/v1/swap<br/>tx + approval, simulated from sender"]
  end
  subgraph submit["Your app and the user's wallet: submit"]
    A{"approval not null and<br/>allowance below approval.amount?"}
    A -->|Yes| AP["Send approve(spender, amount)<br/>and wait for its receipt"]
    A -->|No| TX
    AP --> TX["Send tx exactly as returned"]
    TX --> RC{"Receipt status"}
    RC -->|success| OK["Done: recipient got<br/>at least minAmountOut"]
    RC -->|reverted| RQ["Nothing swapped.<br/>Request a fresh /swap"]
  end
  S --> A
```

1. **Quote.** `POST /quote` returns the expected output, the minimum after slippage, the fees and the route. Use it to show your user a price.
2. **Build.** When the user is ready, `POST /swap` with their address as `sender`. The API prices the trade again, builds the transaction, and simulates it from the sender before returning it.
3. **Approve.** If the input is an ERC-20 token, the sender approves the executor for the input amount, unless the allowance is already enough.
4. **Send.** The user signs and sends the transaction. The executor runs the route and pays the recipient, or reverts if the output would fall below `minAmountOut`.

## Get an API key

Email **[support@achswap.app](mailto:support@achswap.app)** with:

- your project's name and website;
- what you'll use the API for, and roughly how many requests a day;
- a contact for technical and security notices.

You receive one key, issued for your project with its own rate limit.

### Keeping your key safe

- **Server only.** Call the API from your backend and keep the key in an environment variable or a secrets manager. Never put it in browser or mobile app code, a public repository, or a URL. Responses carry no CORS headers, so a browser on another site can't read them anyway.
- **Your users' keys are not involved.** The API never needs a private key. Transactions are signed by your user's wallet, or by your own signer if you run a server-side wallet; keep that key out of client code too.
- **Rotation.** AchSwap stores only a hash of your key, so a lost key can't be recovered. To rotate a key, or if you think it leaked, email support: you get a new key and the old one is revoked. Plan for a short switch-over, since there is no self-service rotation.
- **One key per project.** Usage and limits are tracked per key.

## Authentication

Send the key with every request, in either header:

```http
x-api-key: ach_dev_…
Authorization: Bearer ach_dev_…
```

A missing, wrong or revoked key gets `401 UNAUTHORIZED`. Repeated bad keys from the same IP are rate limited (`429 RATE_LIMITED`), so fix the key rather than retrying.

### How a request is handled

```mermaid
sequenceDiagram
  participant I as Your server
  participant API as AchSwap API
  participant R as AchSwap router
  I->>API: POST /api/v1/quote + x-api-key
  alt key missing, wrong or revoked
    API-->>I: 401 UNAUTHORIZED
  else over your key's per-minute limit
    API-->>I: 429 RATE_LIMITED + Retry-After
  else invalid body
    API-->>I: 400 INVALID_REQUEST (names the field)
  else too many requests in flight
    API-->>I: 429 CONCURRENCY_LIMITED
  else accepted
    API->>R: find and price the route
    alt no route
      R-->>API: none
      API-->>I: 422 NO_ROUTE
    else route found
      R-->>API: route, simulated
      API-->>I: 200 quote + X-RateLimit headers + requestId
    end
  end
```

`/swap` follows the same path, and also simulates the finished transaction from `sender`; a transaction that would revert is answered with `409 SIMULATION_FAILED`. Every response, success or error, carries a `requestId`. See [errors and limits](/developers/errors-and-limits).

## Your first request

Quote 1 USDC to EURC, with a 0.30% fee for you:

```bash
curl -s https://trade.achswap.app/api/v1/quote \
  -H "x-api-key: $ACHSWAP_KEY" \
  -H "content-type: application/json" \
  -d '{
    "tokenIn": "0x3600000000000000000000000000000000000000",
    "tokenOut": "0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1",
    "amountIn": "1000000",
    "feeBps": 30,
    "feeRecipient": "0xYourFeeAddress"
  }'
```

`amountIn` is `1000000` because USDC has 6 decimals. The response's `amountOut` is what the user would receive, after AchSwap's fee and yours.

## Next

- [API reference](/developers/api-reference): every field, token addresses and decimals, and how fees are calculated.
- [Code examples](/developers/examples): a complete swap in TypeScript and Python.
- [Errors and limits](/developers/errors-and-limits): what each error means, when to retry, and rate limits.
- [Changelog](/developers/changelog): API changes and the versioning policy.
- [Contract addresses](/technical/contract-addresses#swap-execution) and [network setup](/getting-started/network-setup): chain ID, RPC and the executor.
- [Gasless swaps](/technical/gasless) are not part of this API; they are an app feature with their own signing flow.

## Support

Questions, a new key, higher limits or a security report: **[support@achswap.app](mailto:support@achswap.app)**. Include the `requestId` from the response when you ask about a specific request.
