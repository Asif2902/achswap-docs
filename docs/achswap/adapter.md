---
sidebar_position: 10
---

# AchSwap Adapter

## Overview

The AchSwap Adapter is the routing and execution layer of the AchSwap protocol. It abstracts the complexity of multi-pool, multi-version liquidity into a single interface — two functions — that any application can integrate without needing to understand the internals of V2 or V3 AMMs, fee tier selection, hop routing, or split execution.

The adapter was designed with one principle: the caller provides a token pair and an amount, and receives back everything they need to execute an optimal swap in a single transaction.

**Deployed on Arc Testnet**
```
AchSwapAdapter: 0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB
Chain ID:       5042002
Native token:   USDC (18 decimals)
```

> **Note on Arc Testnet.** Arc's native token is USDC with 18 decimals — not ETH. When passing `address(0)` as `tokenIn` or `tokenOut`, the adapter references native USDC. All amount values use 18 decimal precision consistent with the native denomination.

---

## Architecture

The adapter operates in two phases: **quoting** and **execution**. These are intentionally separated so that route computation is free and never touches on-chain state, while execution is atomic and gas-efficient.

```
Off-chain (free)          On-chain (single tx)
─────────────────         ──────────────────────────
quote(tokenIn,            swap(tokenIn, tokenOut,
      tokenOut,     ──►         amountIn,
      amountIn)                 amountOutMin,
                                recipient,
→ expectedOut                   routeData)
→ routeData
```

The `routeData` returned by `quote` is an opaque byte payload that encodes the full execution plan — router type, token path, V3 fee tiers, and split ratios. It is passed unchanged into `swap`, which decodes and executes it.

---

## Route Types

The adapter evaluates every viable route for a given pair and returns the one with the highest expected output. The candidates probed on every quote call are:

**Single-leg routes**

| Route | Description |
|---|---|
| V2 Direct | Single-hop swap through the V2 AMM pool |
| V3 Direct | Single-hop swap through the V3 concentrated liquidity pool, probing fee tiers 0.01%, 0.05%, 0.3%, and 1% |
| V2 Two-Hop | Two-hop route via WETH as intermediate: `tokenIn → WETH → tokenOut` |
| V3 Two-Hop | Two-hop route via WETH with independent fee tier selection per segment |

**Split routes**

When both a V2 path and a V3 path exist for the same pair, the adapter probes three split ratios between them:

| Split | V2 Share | V3 Share |
|---|---|---|
| 50/50 | 50% | 50% |
| 70/30 | 70% | 30% |
| 30/70 | 30% | 70% |

Each split is re-quoted at the actual per-leg `amountIn` so the comparison accounts for real price impact on both sides. The split that produces the highest combined output wins.

---

## The Segment Encoding

Internally, a route is represented as an array of `Segment` structs. Each segment describes one execution unit:

```solidity
struct Segment {
    bool      isV3;   // V2 or V3 router
    address[] path;   // token sequence
    uint24[]  fees;   // V3: one fee per hop. V2: empty.
    uint16    bps;    // share of amountIn (10000 = 100%)
}
```

A single-leg route is `Segment[1]` with `bps = 10000`. A split route is `Segment[2]` with `bps` values summing to `10000`. This is ABI-encoded into `routeData`. The caller never needs to decode it — it is passed back to `swap` as-is.

---

## V3 Fee Tier Selection

For every V3 segment, the adapter probes all four Uniswap V3 fee tiers using the QuoterV2 contract:

| Tier | Fee | Best for |
|---|---|---|
| Lowest | 0.01% | Stable pairs with high volume |
| Low | 0.05% | Correlated assets |
| Medium | 0.3% | Standard volatile pairs |
| High | 1% | Exotic or low-liquidity pairs |

For two-hop V3 routes, fee tiers are selected independently per segment and the full packed path is quoted end-to-end using `quoteExactInput` so that cross-pool price impact is accurately captured.

---

## Public Functions

```solidity
// Off-chain only — call via eth_call / staticCall
function quote(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
) external returns (uint256 expectedOut, bytes memory routeData)

// On-chain execution
function swap(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 amountOutMin,
    address recipient,
    bytes calldata routeData
) external payable returns (uint256 totalOut)

// Pure helper — compute minimum output from quoted amount and slippage
// slippageBps: 1000 = 10%, 500 = 5%, 50 = 0.5%
function minOut(uint256 quotedOut, uint16 slippageBps) external pure returns (uint256)

// Decode routeData for display or inspection
function decodeRoute(bytes calldata routeData) external pure returns (Segment[] memory)
```

**Native USDC (address(0)).** Pass `address(0)` for `tokenIn` to use native USDC as input — `msg.value` must equal `amountIn`. Pass `address(0)` for `tokenOut` to receive native USDC — the adapter unwraps automatically before delivery.

**Approvals.** For ERC-20 input tokens, the caller approves the adapter for `amountIn` before calling `swap`. Internal router approvals are reset to zero after each segment executes.

---

## Contract Reference

| Function | Type | Description |
|---|---|---|
| `quote(tokenIn, tokenOut, amountIn)` | `external` — eth_call only | Returns best output and encoded route |
| `swap(tokenIn, tokenOut, amountIn, amountOutMin, recipient, routeData)` | `external payable` | Executes swap from routeData |
| `minOut(quotedOut, slippageBps)` | `pure` | Applies slippage tolerance to quoted output |
| `decodeRoute(routeData)` | `pure` | Decodes routeData into Segment array for inspection |

| Parameter | Value | Notes |
|---|---|---|
| Adapter address | `0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB` | Arc Testnet |
| Chain ID | `5042002` | Arc Testnet |
| Native token | USDC | 18 decimals — use `address(0)` to reference |
| V3 fee tiers probed | 100, 500, 3000, 10000 | Basis points |
| Split ratios probed | 5000, 7000, 3000 | bps for leg A |
| Max segments per route | 2 | Single-leg or split |

---

## Integration — JavaScript / TypeScript

The standard integration flow for any frontend or backend service.

```typescript
import { ethers } from 'ethers'

const ADAPTER_ADDRESS = '0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB'

const ADAPTER_ABI = [
  'function quote(address,address,uint256) returns (uint256,bytes)',
  'function swap(address,address,uint256,uint256,address,bytes) payable returns (uint256)',
  'function minOut(uint256,uint16) pure returns (uint256)',
  'function decodeRoute(bytes) pure returns (tuple(bool isV3,address[] path,uint24[] fees,uint16 bps)[])',
]

const ERC20_ABI = [
  'function approve(address,uint256) returns (bool)',
  'function allowance(address,address) view returns (uint256)',
]

/**
 * Execute a swap through the AchSwap Adapter.
 *
 * tokenIn / tokenOut: token addresses. Pass address(0) for native USDC.
 * amountIn:          input amount in wei (18 decimals for native USDC).
 * slippageBps:       slippage in basis points. 500 = 5%, 1000 = 10%.
 */
async function achSwap(
  signer: ethers.Signer,
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint,
  slippageBps: number = 500
): Promise<ethers.TransactionReceipt> {

  const adapter   = new ethers.Contract(ADAPTER_ADDRESS, ADAPTER_ABI, signer)
  const recipient = await signer.getAddress()

  // 1. Quote — free, no transaction, no gas
  const [expectedOut, routeData] = await adapter.quote.staticCall(
    tokenIn, tokenOut, amountIn
  )
  console.log('Expected output:', ethers.formatUnits(expectedOut, 18))

  // 2. Apply slippage
  const amountOutMin = await adapter.minOut(expectedOut, slippageBps)

  // 3. Approve ERC-20 input (skip for native USDC)
  const isNativeIn = tokenIn === ethers.ZeroAddress
  if (!isNativeIn) {
    const erc20     = new ethers.Contract(tokenIn, ERC20_ABI, signer)
    const allowance = await erc20.allowance(recipient, ADAPTER_ADDRESS)
    if (allowance < amountIn) {
      const approveTx = await erc20.approve(ADAPTER_ADDRESS, amountIn)
      await approveTx.wait()
    }
  }

  // 4. Execute swap
  const tx = await adapter.swap(
    tokenIn,
    tokenOut,
    amountIn,
    amountOutMin,
    recipient,
    routeData,
    isNativeIn ? { value: amountIn } : {}
  )

  return tx.wait()
}
```

**Inspecting the route before executing:**

```typescript
const segments = await adapter.decodeRoute(routeData)

for (const seg of segments) {
  const type  = seg.isV3 ? 'V3' : 'V2'
  const share = (Number(seg.bps) / 100).toFixed(0) + '%'
  const path  = seg.path.join(' → ')
  const fees  = seg.isV3
    ? seg.fees.map(f => (Number(f) / 10000 * 100).toFixed(2) + '%').join(', ')
    : 'N/A'
  console.log(`${type} | ${share} | ${path} | fees: ${fees}`)
}

// Example output:
// V3  | 60% | 0xTokenIn → 0xTokenOut | fees: 0.30%
// V2  | 40% | 0xTokenIn → 0xTokenOut | fees: N/A
```

---

## Integration — Solidity

For protocols that call the adapter from a smart contract. `quote` must be obtained off-chain and passed as calldata — it cannot be called inside a transaction.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAchSwapAdapter {
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        address recipient,
        bytes calldata routeData
    ) external payable returns (uint256 totalOut);
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/**
 * Example: a protocol that routes user swaps through AchSwap.
 *
 * The caller obtains routeData and amountOutMin off-chain via:
 *   const [expectedOut, routeData] = await adapter.quote.staticCall(...)
 *   const amountOutMin = expectedOut * (10000 - slippageBps) / 10000
 *
 * Then passes them here.
 */
contract MyProtocol {

    address public constant ACHSWAP_ADAPTER = 0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB;

    function swapViaAchSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        address recipient,
        bytes calldata routeData
    ) external returns (uint256 amountOut) {

        // Pull from caller
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Approve adapter
        IERC20(tokenIn).approve(ACHSWAP_ADAPTER, amountIn);

        // Execute
        amountOut = IAchSwapAdapter(ACHSWAP_ADAPTER).swap(
            tokenIn, tokenOut, amountIn, amountOutMin, recipient, routeData
        );
    }
}
```

---

## Building a DEX UI on AchSwap Liquidity

Any frontend can source AchSwap liquidity without deploying any contracts — point directly at the adapter address and implement the four-step flow. The adapter handles all routing decisions internally.

**Recommended flow:**

```
1. User selects tokenIn, tokenOut, amountIn
         ↓
2. quote.staticCall() → show expectedOut, route breakdown
         ↓
3. User confirms slippage → compute amountOutMin
         ↓
4. Approve tokenIn to 0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB
         ↓
5. swap() → done
```

The `decodeRoute` function gives you everything needed to show users what is happening under the hood: which router (V2 or V3), the exact token path including any intermediate hops, fee tiers, and the split breakdown if the swap is divided between multiple pools.

---

## Building an Aggregator with AchSwap as a Source

The AchSwap Adapter is designed to be registered in any aggregator that follows the `quote` + `swap` pattern. The aggregator calls `quote` on each registered adapter off-chain, picks the one with the highest `expectedOut`, and routes the swap to it.

**Off-chain aggregation (TypeScript):**

```typescript
const ADAPTERS = [
  '0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB',  // AchSwap
  '0x...AnotherDEX',
]

async function getBestAdapter(tokenIn: string, tokenOut: string, amountIn: bigint) {
  const results = await Promise.allSettled(
    ADAPTERS.map(async (addr) => {
      const adapter = new ethers.Contract(addr, ADAPTER_ABI, provider)
      const [expectedOut, routeData] = await adapter.quote.staticCall(
        tokenIn, tokenOut, amountIn
      )
      return { addr, expectedOut, routeData }
    })
  )

  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<any>).value)
    .sort((a, b) => (b.expectedOut > a.expectedOut ? 1 : -1))[0]
}

async function aggregatedSwap(
  signer: ethers.Signer,
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint,
  slippageBps: number
) {
  const best    = await getBestAdapter(tokenIn, tokenOut, amountIn)
  const adapter = new ethers.Contract(best.addr, ADAPTER_ABI, signer)
  const minOut  = await adapter.minOut(best.expectedOut, slippageBps)

  const erc20 = new ethers.Contract(tokenIn, ERC20_ABI, signer)
  await (await erc20.approve(best.addr, amountIn)).wait()

  return adapter.swap(
    tokenIn, tokenOut, amountIn, minOut,
    await signer.getAddress(), best.routeData
  )
}
```

**On-chain aggregator (Solidity):**

`quote` cannot be called inside a transaction. The correct pattern is to select the winning adapter and compute `routeData` off-chain, then pass both as calldata into the aggregator's execute function.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAchSwapAdapter {
    function swap(
        address tokenIn, address tokenOut,
        uint256 amountIn, uint256 amountOutMin,
        address recipient, bytes calldata routeData
    ) external payable returns (uint256);
}

interface IERC20 {
    function approve(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
}

contract MyAggregator {

    mapping(address => bool) public registeredAdapters;
    address public owner;

    modifier onlyOwner() { require(msg.sender == owner, "not owner"); _; }

    constructor() { owner = msg.sender; }

    function registerAdapter(address adapter) external onlyOwner {
        registeredAdapters[adapter] = true;
    }

    /**
     * @notice Execute a swap via a pre-selected adapter.
     * @dev    Select the best adapter and routeData off-chain via quote().
     *         Pass the winning adapter address and routeData here.
     *
     * @param adapter      Adapter address (must be registered).
     * @param tokenIn      Input token. address(0) = native USDC.
     * @param tokenOut     Output token. address(0) = native USDC.
     * @param amountIn     Exact input amount.
     * @param amountOutMin Minimum output. Revert if not met.
     * @param recipient    Receives output.
     * @param routeData    Encoded route from adapter.quote().
     */
    function execute(
        address adapter,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        address recipient,
        bytes calldata routeData
    ) external returns (uint256 amountOut) {
        require(registeredAdapters[adapter], "unknown adapter");

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(adapter, amountIn);

        amountOut = IAchSwapAdapter(adapter).swap(
            tokenIn, tokenOut, amountIn, amountOutMin, recipient, routeData
        );
    }
}
```

To register AchSwap on deployment:

```solidity
aggregator.registerAdapter(0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB);
```

---

## AchSwap API

A REST API is available for applications that prefer HTTP calls over direct on-chain interaction. The API handles quoting, route decoding, and transaction building server-side.

**Base URL:**

```
https://swap-api.achswap.app
```

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Check API status and chain info |
| `GET` | `/quote?tokenIn=&tokenOut=&amountIn=&slippageBps=` | Get swap quote with expected output and route data |
| `GET` | `/decode?routeData=` | Decode route data into readable segments |
| `POST` | `/swap-tx` | Build unsigned transaction calldata |

**Parameters — `/quote`:**

| Param | Required | Description |
|---|---|---|
| `tokenIn` | Yes | Token address, or `USDC` / `native` for native USDC |
| `tokenOut` | Yes | Token address, or `USDC` / `native` for native USDC |
| `amountIn` | Yes | Amount in human-readable format (e.g. `1`, `0.5`, `100`) |
| `slippageBps` | No | Slippage in basis points. Default: `50` (0.5%) |

**Parameters — `/decode`:**

| Param | Required | Description |
|---|---|---|
| `routeData` | Yes | Hex-encoded route data from `/quote` response |

**Request body — `/swap-tx`:**

| Field | Required | Description |
|---|---|---|
| `tokenIn` | Yes | Input token address |
| `tokenOut` | Yes | Output token address |
| `amountIn` | Yes | Input amount in wei |
| `amountOutMin` | Yes | Minimum output in wei (from quote response) |
| `recipient` | Yes | Wallet address receiving output |
| `routeData` | Yes | Route data from `/quote` response |

### Example — HTML (Vanilla JS)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AchSwap Quote</title>
</head>
<body>
  <h1>AchSwap Quote</h1>
  <input id="amount" type="text" placeholder="Amount (e.g. 1)" value="1" />
  <button id="quoteBtn">Get Quote</button>
  <pre id="output"></pre>

  <script>
    const API = 'https://swap-api.achswap.app'

    const USDC = 'native'
    const TOKEN = '0x45Bb5425f293bdd209c894364C462421FF5FfA48'

    document.getElementById('quoteBtn').addEventListener('click', async () => {
      const amount = document.getElementById('amount').value
      const url = `${API}/quote?tokenIn=${USDC}&tokenOut=${TOKEN}&amountIn=${amount}&slippageBps=50`

      const res = await fetch(url)
      const data = await res.json()

      document.getElementById('output').textContent = JSON.stringify(data, null, 2)
    })
  </script>
</body>
</html>
```

### Example — JavaScript / TypeScript

```typescript
const API = 'https://swap-api.achswap.app'

interface QuoteResponse {
  tokenIn: string
  tokenOut: string
  amountIn: string
  expectedOut: string
  minOut: string
  slippageBps: number
  routeData: string
  adapter: string
}

interface Segment {
  isV3: boolean
  path: string[]
  fees: number[]
  bps: number
}

// 1. Get a quote
async function getQuote(
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  slippageBps = 50
): Promise<QuoteResponse> {
  const params = new URLSearchParams({ tokenIn, tokenOut, amountIn, slippageBps: String(slippageBps) })
  const res = await fetch(`${API}/quote?${params}`)
  return res.json()
}

// 2. Decode the route
async function decodeRoute(routeData: string): Promise<{ segments: Segment[] }> {
  const res = await fetch(`${API}/decode?routeData=${routeData}`)
  return res.json()
}

// 3. Build swap transaction
async function buildSwapTx(params: {
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOutMin: string
  recipient: string
  routeData: string
}) {
  const res = await fetch(`${API}/swap-tx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  return res.json()
}

// Usage
async function main() {
  const quote = await getQuote('USDC', '0x45Bb5425f293bdd209c894364C462421FF5FfA48', '1')
  console.log('Expected:', quote.expectedOut)
  console.log('Min out:', quote.minOut)

  const decoded = await decodeRoute(quote.routeData)
  console.log('Route:', decoded.segments)

  const tx = await buildSwapTx({
    tokenIn: quote.tokenIn,
    tokenOut: quote.tokenOut,
    amountIn: quote.amountIn,
    amountOutMin: quote.minOut,
    recipient: '0xYourWalletAddress',
    routeData: quote.routeData,
  })
  console.log('Tx data:', tx)
  // Send tx with ethers.js / viem / wagmi
}
```

### Example — React / TSX

```tsx
import { useState, useCallback } from 'react'
import { useAccount, useWriteContract } from 'wagmi'

const API = 'https://swap-api.achswap.app'
const ADAPTER = '0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB'

const ADAPTER_ABI = [
  {
    type: 'function',
    name: 'swap',
    stateMutability: 'payable',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'tokenOut', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMin', type: 'uint256' },
      { name: 'recipient', type: 'address' },
      { name: 'routeData', type: 'bytes' },
    ],
    outputs: [{ name: 'totalOut', type: 'uint256' }],
  },
]

export function SwapButton() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [loading, setLoading] = useState(false)

  const swap = useCallback(async () => {
    if (!address) return
    setLoading(true)

    try {
      // 1. Quote
      const quoteRes = await fetch(
        `${API}/quote?tokenIn=USDC&tokenOut=0x45Bb5425f293bdd209c894364C462421FF5FfA48&amountIn=1`
      )
      const quote = await quoteRes.json()

      // 2. Decode route (optional — for display)
      const decodeRes = await fetch(`${API}/decode?routeData=${quote.routeData}`)
      const decoded = await decodeRes.json()
      console.log('Route:', decoded.segments)

      // 3. Execute swap via wallet
      await writeContractAsync({
        address: ADAPTER,
        abi: ADAPTER_ABI,
        functionName: 'swap',
        args: [
          quote.tokenIn,
          quote.tokenOut,
          BigInt(quote.amountIn),
          BigInt(quote.minOut),
          address,
          quote.routeData,
        ],
        value: BigInt(quote.amountIn),
      })
    } finally {
      setLoading(false)
    }
  }, [address, writeContractAsync])

  return (
    <button onClick={swap} disabled={!address || loading}>
      {loading ? 'Swapping...' : 'Swap 1 USDC'}
    </button>
  )
}
```

### Flow

```
Frontend                         API                          Blockchain
────────                         ───                          ──────────
GET /quote?tokenIn=&tokenOut=&amountIn=
                  ─────────────►
                                 quote() via eth_call
                                 ← expectedOut, routeData
         ◄────────────────────
GET /decode?routeData=
                  ─────────────►
                                 decodeRoute() via eth_call
                                 ← segments
         ◄────────────────────

POST /swap-tx { amountIn, amountOutMin, recipient, routeData }
                  ─────────────►
                                 buildSwapCalldata()
                                 ← { to, data, value }
         ◄────────────────────

sendTransaction({ to, data, value })
                  ─────────────────────────────────────────────►
```
