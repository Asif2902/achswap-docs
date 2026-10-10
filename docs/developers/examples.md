---
sidebar_position: 3
title: Code examples
---

# Code examples

These examples run a complete swap: build the transaction, approve if needed, send it, and wait for it. They are written for a server that holds a wallet. In a web app the same steps apply, with the user's wallet doing the signing and your server making the API calls.

Keep your API key on the server. Never ship it in browser code.

## TypeScript (viem)

```ts
import { createPublicClient, createWalletClient, defineChain, erc20Abi, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const API = "https://trade.achswap.app/api/v1";
const API_KEY = process.env.ACHSWAP_KEY!;

const arc = defineChain({
  id: 5042,
  name: "Arc Mainnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.mainnet.arc.io"] } },
});

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const publicClient = createPublicClient({ chain: arc, transport: http() });
const wallet = createWalletClient({ account, chain: arc, transport: http() });

type ApiError = { error: { code: string; message: string; reason?: string }; requestId: string };

async function call<T>(path: "quote" | "swap", body: object): Promise<T> {
  const res = await fetch(`${API}/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    const { error, requestId } = json as ApiError;
    throw Object.assign(new Error(`${error.code}: ${error.message} (${requestId})`), {
      status: res.status, code: error.code, reason: error.reason, retryAfter: res.headers.get("retry-after"),
    });
  }
  return json as T;
}

type Swap = {
  amountOut: string;
  minAmountOut: string;
  tx: { to: `0x${string}`; data: `0x${string}`; value: string; gas: string | null };
  approval: { token: `0x${string}`; spender: `0x${string}`; amount: string } | null;
  simulated: boolean;
};

export async function swap() {
  // 10 USDC (6 decimals) to EURC, 0.5% slippage, a 0.30% fee for you.
  const swap = await call<Swap>("swap", {
    tokenIn: "0x3600000000000000000000000000000000000000",
    tokenOut: "0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1",
    amountIn: "10000000",
    slippageBps: 50,
    feeBps: 30,
    feeRecipient: "0xYourFeeAddress",
    sender: account.address,
  });
  console.log(`expect ${swap.amountOut}, at least ${swap.minAmountOut}`);

  // 1. Approve the executor if the allowance is short (ERC-20 input only).
  if (swap.approval) {
    const { token, spender, amount } = swap.approval;
    const allowance = await publicClient.readContract({
      address: token, abi: erc20Abi, functionName: "allowance", args: [account.address, spender],
    });
    if (allowance < BigInt(amount)) {
      const hash = await wallet.writeContract({
        address: token, abi: erc20Abi, functionName: "approve", args: [spender, BigInt(amount)],
      });
      await publicClient.waitForTransactionReceipt({ hash });
    }
  }

  // 2. Send the swap exactly as returned.
  const hash = await wallet.sendTransaction({
    to: swap.tx.to,
    data: swap.tx.data,
    value: BigInt(swap.tx.value),
    gas: swap.tx.gas ? BigInt(swap.tx.gas) : undefined, // undefined: viem estimates it
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error(`swap reverted: ${hash}`);
  return hash;
}
```

If the approval takes a while to confirm, call `/swap` again after it, so the transaction you send is freshly priced.

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


swap = api("swap", {
    "tokenIn": "0x3600000000000000000000000000000000000000",   # USDC, 6 decimals
    "tokenOut": "0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1",  # EURC
    "amountIn": "10000000",                                     # 10 USDC
    "slippageBps": 50,
    "sender": account.address,
})

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
