---
sidebar_position: 3
title: Code examples
---

# Code examples

This page has a complete, copyable swap for each language. Each one walks through the same steps:

1. use your API key (from [support@achswap.app](mailto:support@achswap.app));
2. request a quote;
3. read the response;
4. prepare the swap transaction;
5. check the token allowance;
6. approve, if the allowance is short;
7. send the transaction;
8. wait for the receipt;
9. handle errors.

They are written for a server that holds a wallet. In a web app the steps are the same, with the user's wallet signing and your server making the API calls. Keep your API key on the server; never ship it in browser code.

:::tip Checked against the implementation
The TypeScript example was type-checked with viem 2.47 and run against the v1 handler on 10 October 2026, up to the point where it would send a transaction: quote, build, simulation and allowance check all behaved as shown.
:::

## TypeScript (viem)

Install `viem`, save this as `swap.ts`, and run it with your key and a funded wallet's private key in the environment. It swaps 10 USDC for EURC.

Use a dedicated wallet that holds only what it needs to trade, keep its private key in a secrets manager or environment variable, and never commit it. In a web app, there is no private key on your side at all: the user's wallet signs.

```ts
// swap.ts: a complete AchSwap Developer API swap with viem.
// Run: ACHSWAP_KEY=ach_dev_… PRIVATE_KEY=0x… npx tsx swap.ts
import {
  createPublicClient, createWalletClient, defineChain, erc20Abi, formatUnits, http, type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

// 1. Your API key, from support@achswap.app. Keep it on the server.
const API = process.env.ACHSWAP_API ?? "https://trade.achswap.app/api/v1";
const API_KEY = process.env.ACHSWAP_KEY!;

const arc = defineChain({
  id: 5042,
  name: "Arc Mainnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.mainnet.arc.io"] } },
  blockExplorers: { default: { name: "ArcScan", url: "https://arc.etherscan.io" } },
});

const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex);
const publicClient = createPublicClient({ chain: arc, transport: http() });
const wallet = createWalletClient({ account, chain: arc, transport: http() });

const USDC = "0x3600000000000000000000000000000000000000"; // 6 decimals
const EURC = "0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1"; // 6 decimals

type Quote = {
  amountIn: string; amountOut: string; minAmountOut: string; grossAmountOut: string;
  fees: { protocolBps: number; protocolAmount: string; partnerBps: number; partnerAmount: string };
  priceImpactBps: number | null;
  route: { shareBps: number; hops: { dex: string; pool: string | null }[] }[];
  requestId: string;
};
type Swap = Quote & {
  tx: { to: Hex; data: Hex; value: string; gas: string | null };
  approval: { token: Hex; spender: Hex; amount: string } | null;
  simulated: boolean;
};
class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public reason?: string,
    public requestId?: string, public retryAfter?: number) { super(`${status} ${code}: ${message}`); }
}

async function call<T>(path: "quote" | "swap", body: object): Promise<T> {
  const res = await fetch(`${API}/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    const retry = res.headers.get("retry-after");
    throw new ApiError(res.status, json.error?.code, json.error?.message, json.error?.reason, json.requestId,
      retry ? Number(retry) : undefined);
  }
  return json as T;
}

const trade = {
  tokenIn: USDC,
  tokenOut: EURC,
  amountIn: "10000000", // 10 USDC: amounts are integer strings in the token's smallest unit
  slippageBps: 50,      // 0.5%
};

async function main() {
  // 2. Request a quote, and 3. read it.
  const quote = await call<Quote>("quote", trade);
  console.log(`About ${formatUnits(BigInt(quote.amountOut), 6)} EURC, at least ${formatUnits(BigInt(quote.minAmountOut), 6)}`);
  console.log(`Route: ${quote.route.map((b) => `${b.shareBps / 100}% via ${b.hops.map((h) => h.dex).join(" → ")}`).join(", ")}`);
  if (quote.priceImpactBps != null && quote.priceImpactBps > 200) throw new Error("Price impact above 2%: stopping");

  // 4. Prepare the transaction, right before sending. It is priced again and simulated from the sender.
  const swap = await call<Swap>("swap", { ...trade, sender: account.address });

  // 5. Check the allowance, and 6. approve if it is short (ERC-20 input only).
  if (swap.approval) {
    const { token, spender, amount } = swap.approval;
    const allowance = await publicClient.readContract({
      address: token, abi: erc20Abi, functionName: "allowance", args: [account.address, spender],
    });
    if (allowance < BigInt(amount)) {
      const approveHash = await wallet.writeContract({
        address: token, abi: erc20Abi, functionName: "approve", args: [spender, BigInt(amount)],
      });
      const approved = await publicClient.waitForTransactionReceipt({ hash: approveHash });
      if (approved.status !== "success") throw new Error(`approval reverted: ${approveHash}`);
      // The approval took a block or more: build a fresh transaction so it is priced now.
      return main();
    }
  }

  // 7. Send the transaction exactly as returned. Send it once: never resend the same swap after a timeout
  //    without first checking whether the first one was mined.
  const hash = await wallet.sendTransaction({
    to: swap.tx.to,
    data: swap.tx.data,
    value: BigInt(swap.tx.value),
    gas: swap.tx.gas ? BigInt(swap.tx.gas) : undefined, // undefined: viem estimates it
  });
  console.log(`Sent: https://arc.etherscan.io/tx/${hash}`);

  // 8. Wait for the receipt.
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error(`Swap reverted, nothing was swapped: ${hash}`);
  console.log(`Swapped in block ${receipt.blockNumber}`);
}

// 9. Handle errors.
main().catch((error) => {
  if (error instanceof ApiError) {
    if (error.status === 429 || error.status === 503) console.error(`Busy: retry after ${error.retryAfter ?? 1}s`);
    else if (error.code === "NO_ROUTE") console.error("No route for this pair and amount");
    else if (error.code === "SIMULATION_FAILED") console.error(`Would revert (${error.reason}): request a new /swap`);
    else console.error(`${error.message} (requestId ${error.requestId})`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
```

A few things it does on purpose:

- **Quote first, build later.** `/quote` is cheap and shows the price; `/swap` is called only when you are about to send, so the transaction is freshly priced and simulated.
- **Rebuild after an approval.** An approval takes at least a block. The script builds a new transaction afterwards rather than sending one priced before the approval.
- **One send per build.** If sending times out, check the chain for the transaction before trying again, so the swap is never sent twice.

### Paying with native USDC

Use the zero address as `tokenIn` and an 18-decimal amount. There's no approval: `approval` is `null` and `tx.value` carries the amount.

```ts
const swap = await call<Swap>("swap", {
  tokenIn: "0x0000000000000000000000000000000000000000",
  tokenOut: "0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1",
  amountIn: "10000000000000000000", // 10 USDC at 18 decimals
  sender: account.address,
});
```

## Python (requests and web3.py 7)

```python
import os
import requests
from web3 import Web3

API = "https://trade.achswap.app/api/v1"
HEADERS = {"x-api-key": os.environ["ACHSWAP_KEY"], "content-type": "application/json"}

w3 = Web3(Web3.HTTPProvider("https://rpc.mainnet.arc.io"))
account = w3.eth.account.from_key(os.environ["PRIVATE_KEY"])

ERC20 = [
    {"name": "allowance", "type": "function", "stateMutability": "view",
     "inputs": [{"name": "owner", "type": "address"}, {"name": "spender", "type": "address"}],
     "outputs": [{"type": "uint256"}]},
    {"name": "approve", "type": "function", "stateMutability": "nonpayable",
     "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
     "outputs": [{"type": "bool"}]},
]


def api(path, body):
    res = requests.post(f"{API}/{path}", json=body, headers=HEADERS, timeout=15)
    data = res.json()
    if not res.ok:
        err = data["error"]
        raise RuntimeError(f"{res.status_code} {err['code']}: {err['message']} ({data['requestId']})")
    return data


def send(tx):
    tx = {**tx, "from": account.address, "nonce": w3.eth.get_transaction_count(account.address), "chainId": 5042}
    if "gas" not in tx:
        tx["gas"] = w3.eth.estimate_gas(tx)
    tx.setdefault("gasPrice", w3.eth.gas_price)
    signed = account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    if receipt.status != 1:
        raise RuntimeError(f"reverted: {tx_hash.hex()}")
    return tx_hash.hex()


trade = {
    "tokenIn": "0x3600000000000000000000000000000000000000",   # USDC, 6 decimals
    "tokenOut": "0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1",  # EURC
    "amountIn": "10000000",                                     # 10 USDC, smallest units
    "slippageBps": 50,
}

quote = api("quote", trade)
print(f"About {int(quote['amountOut']) / 10**6} EURC, at least {int(quote['minAmountOut']) / 10**6}")

# Build right before sending: priced again and simulated from the sender.
swap = api("swap", {**trade, "sender": account.address})

approval = swap["approval"]
if approval:
    token = w3.eth.contract(address=Web3.to_checksum_address(approval["token"]), abi=ERC20)
    if token.functions.allowance(account.address, approval["spender"]).call() < int(approval["amount"]):
        send(token.functions.approve(approval["spender"], int(approval["amount"])).build_transaction(
            {"from": account.address}))

tx = swap["tx"]
call = {"to": tx["to"], "data": tx["data"], "value": int(tx["value"])}
if tx["gas"]:
    call["gas"] = int(tx["gas"])
print("swap", send(call))
```

## Showing a price before the user commits

Use `/quote` while the user is choosing, and `/swap` only when they click to confirm. Converting amounts for display:

```ts
import { formatUnits } from "viem";

const quote = await call<{ amountOut: string; minAmountOut: string; priceImpactBps: number | null }>("quote", {
  tokenIn: "0x3600000000000000000000000000000000000000",
  tokenOut: "0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1",
  amountIn: "250000000", // 250 USDC
});

console.log(`You receive about ${formatUnits(BigInt(quote.amountOut), 6)} EURC`);
console.log(`At least ${formatUnits(BigInt(quote.minAmountOut), 6)} EURC`);
if (quote.priceImpactBps != null && quote.priceImpactBps > 200) console.warn("price impact above 2%");
```

Re-quote every 15 to 30 seconds while the user is looking at a price, and on every amount change. Avoid quoting on every keystroke: wait until typing pauses.

## Handling errors

The [errors page](/developers/errors-and-limits#when-to-retry) explains which errors to retry. In short:

```ts
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e: any) {
      const retryable = e.status === 429 || e.status === 502 || e.status === 503 || e.status === 504;
      if (!retryable || i >= attempts) throw e;
      const wait = e.retryAfter ? Number(e.retryAfter) * 1000 : 500 * 2 ** i;
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

const quote = await withRetry(() => call("quote", body));
```

A `409 SIMULATION_FAILED` is not worth retrying unchanged: build a fresh `/swap` instead, or tell the user the price moved.
