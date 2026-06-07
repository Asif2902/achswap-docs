---
sidebar_position: 10
---

# AchSwap Adapter & Aggregator

## Overview

AchSwap has two routing systems: the **legacy AchSwap Adapter** and the **new Aggregator**. Both find the best swap rates across V2, V3, and V4 pools, but the aggregator goes further by splitting trades across multiple protocols for optimal execution.

**The aggregator is the recommended routing system.** It provides better rates for most trades, especially large ones.

## Legacy Adapter

The legacy adapter evaluates routes in a single `quote()` call and returns the best one. It probes V2 direct, V3 direct (all fee tiers), two-hop routes, and split routes between V2 and V3.

```
Deployed on Arc Testnet
AchSwapAdapter: 0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB
Chain ID:       5042002
Native token:   USDC (18 decimals)
```

The legacy adapter still works and is fully supported, but the aggregator provides better rates by splitting across V2, V3, and V4 adapters.

## Aggregator

The aggregator is a multi-protocol routing system that splits your trade across V2, V3, and V4 adapters to maximize output.

### Architecture

| Contract | Address | Role |
|----------|---------|------|
| Vault | `0x0DcbA75EB4c9d7d50f6732ae205b8F872D611E24` | Holds tokens during execution |
| V2 Adapter | `0x790959a8C0e3aDd93E7fE56E01335a2Cb24da412` | Routes through V2 pools |
| V3 Adapter | `0xA6f691814566aDe0C4F6f84B2BBbeD9747F625a3` | Routes through V3 pools |
| V4 Adapter | `0xf51f6168520234f14F9f494F975e5641017faF4f` | Routes through V4 pools |
| Quote Engine | `0xA4882662842A1D5a98423A63427B9496d5B6ac82` | Off-chain quote computation |
| Execution Router | `0xD20Ad9486f178073ef89585d18eCA1b2694B0e8B` | On-chain swap execution |

### How the Aggregator Works

1. **Probe each adapter** — Get quotes from V2, V3, and V4 adapters for the full amount
2. **Coarse search** — Test 10% increment splits across adapter pairs (V2+V3, V2+V4, V3+V4)
3. **Fine search** — Refine the top 3 candidates with 1% increments
4. **Select best** — Choose the split with highest net output after the 0.1% aggregator fee

### Source Mask

The aggregator uses a bitmask to select which protocols to include:

| Protocol | Bit Value |
|----------|-----------|
| V2 | 1 |
| V3 | 2 |
| V4 | 4 |

For example, source mask `7` (1+2+4) enables all three protocols. The default is `7`.

### Aggregator Fee

The aggregator charges a **0.1% fee** (10 basis points) on the gross output. This is deducted before displaying the net output.

### Example Split

```
Trade: 10,000 USDC → ACHS

Single V3 route:     24,800 ACHS
Aggregator split:
  ├─ 60% via V3:     14,940 ACHS
  └─ 40% via V4:      10,020 ACHS
  Total:             24,960 ACHS (+0.6% better)
```

### Protocol Toggles

In swap settings, you can enable/disable each protocol:

- **V2** — Classic constant product AMM
- **V3** — Concentrated liquidity pools
- **V4** — Hook-enabled singleton pools
- **Aggregator** — Split routing across all protocols

### Aggregator Sub-Source Toggles

When the aggregator is enabled, you can also toggle which sub-sources it uses:

- **Aggregator V2** — Route splits through V2 adapter
- **Aggregator V3** — Route splits through V3 adapter
- **Aggregator V4** — Route splits through V4 adapter

## Route Types

### Single-Leg Routes

| Route | Description |
|---|---|
| V2 Direct | Single-hop swap through the V2 AMM pool |
| V3 Direct | Single-hop swap through V3, probing fee tiers 0.01%, 0.05%, 0.3%, and 1% |
| V4 Direct | Single-hop swap through V4 pools |
| V2 Two-Hop | Two-hop route via wUSDC: `tokenIn → wUSDC → tokenOut` |
| V3 Two-Hop | Two-hop route via wUSDC with independent fee tier selection per segment |

### Split Routes

The aggregator probes splits across adapter pairs:

| Split | V2 Share | V3 Share |
|---|---|---|
| 50/50 | 50% | 50% |
| 70/30 | 70% | 30% |
| 30/70 | 30% | 70% |

Each split is re-quoted at the actual per-leg `amountIn` so the comparison accounts for real price impact on both sides.

## Segment Encoding

Internally, a route is represented as an array of `Segment` structs:

```solidity
struct Segment {
    bool      isV3;   // V2 or V3 router
    address[] path;   // token sequence
    uint24[]  fees;   // V3: one fee per hop. V2: empty.
    uint16    bps;    // share of amountIn (10000 = 100%)
}
```

A single-leg route is `Segment[1]` with `bps = 10000`. A split route is `Segment[2]` with `bps` values summing to `10000`.

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
function minOut(uint256 quotedOut, uint16 slippageBps) external pure returns (uint256)

// Decode routeData for display or inspection
function decodeRoute(bytes calldata routeData) external pure returns (Segment[] memory)
```

**Native USDC (address(0)).** Pass `address(0)` for `tokenIn` to use native USDC as input — `msg.value` must equal `amountIn`. Pass `address(0)` for `tokenOut` to receive native USDC — the adapter unwraps automatically before delivery.

**Approvals.** For ERC-20 input tokens, the caller approves the adapter for `amountIn` before calling `swap`. Internal router approvals are reset to zero after each segment executes.

## Contract Reference

| Function | Type | Description |
|---|---|---|
| `quote(tokenIn, tokenOut, amountIn)` | `external` — eth_call only | Returns best output and encoded route |
| `swap(tokenIn, tokenOut, amountIn, amountOutMin, recipient, routeData)` | `external payable` | Executes swap from routeData |
| `minOut(quotedOut, slippageBps)` | `pure` | Applies slippage tolerance to quoted output |
| `decodeRoute(routeData)` | `pure` | Decodes routeData into Segment array for inspection |

| Parameter | Value | Notes |
|---|---|---|
| Legacy Adapter | `0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB` | Arc Testnet |
| Aggregator Vault | `0x0DcbA75EB4c9d7d50f6732ae205b8F872D611E24` | Arc Testnet |
| Chain ID | `5042002` | Arc Testnet |
| Native token | USDC | 18 decimals — use `address(0)` to reference |
| V3 fee tiers probed | 100, 500, 3000, 10000 | Basis points |
| Split ratios probed | 5000, 7000, 3000 | bps for leg A |
| Max segments per route | 2 | Single-leg or split |
| Aggregator fee | 10 bps | 0.1% on gross output |

## Integration — JavaScript / TypeScript

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
    tokenIn, tokenOut, amountIn, amountOutMin, recipient, routeData,
    isNativeIn ? { value: amountIn } : {}
  )

  return tx.wait()
}
```

## AchSwap API

A REST API is available for applications that prefer HTTP calls over direct on-chain interaction.

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

> **All amounts are in wei.** The API does not convert decimals.

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
