---
sidebar_position: 2
---

# Swap execution

Every AchSwap route executes in one transaction on **AchRouteExecutor** (`0x1B844738455b8060D12839331b35893526E9d314`). The executor takes an exact-input plan and runs it through a fixed set of execution adapters. It measures what each step actually produced and charges the protocol fee once, on the final output. It then pays the recipient and checks the recipient's minimum against the balance they actually received. If any part fails, the whole transaction reverts.

The executor does not look for routes. It holds no funds between transactions, makes no arbitrary calls and uses no `delegatecall`. Plans come from AchSwap's [routing engine](/technical/routing-engine), or from any integrator who encodes one by hand.

Every contract on this page is source-verified on [arc.etherscan.io](https://arc.etherscan.io). Addresses are listed under [contract addresses](/technical/contract-addresses#swap-execution).

## Interface

```solidity
function execute(SwapRequest calldata request, PartnerFeeConfig calldata partner, bytes calldata route)
    external payable returns (uint256 netAmountOut);

struct SwapRequest {
    address tokenIn;          // address(0): native USDC, sent as msg.value
    address tokenOut;         // address(0): native USDC, paid as value
    address recipient;        // receives the output
    uint256 amountIn;         // exact input, in tokenIn's base units
    uint256 minNetAmountOut;  // least the recipient must receive, after every fee
    uint256 deadline;         // unix seconds
    uint64  feeConfigVersion; // must equal feeConfig().version
}

struct PartnerFeeConfig {
    address recipient;        // ignored when bps is 0
    uint16  bps;              // optional integrator fee, at most 100 (1%)
}
```

`netAmountOut` is how much the recipient's balance actually increased.

| Read function | Returns |
| --- | --- |
| `feeConfig()` | `(protocolFeeRecipient, protocolFeeBps, version)` |
| `adapters(uint16 id)` | `(implementation, active)` |
| `paused()` | `true` while execution is paused |
| `nativeAlias()`, `nativeScale()` | `0x3600000000000000000000000000000000000000` and `10^12` |
| `pendingAdapters(uint16 id)` | A scheduled adapter and the time it can be activated |
| `pendingProtocolFeeBps()`, `pendingProtocolFeeValidAt()` | A scheduled fee increase |
| `pendingProtocolFeeRecipient()`, `pendingRecipientValidAt()` | A scheduled fee-recipient change |

## Route encoding

```solidity
bytes route = abi.encode(uint8(1), Branch[] branches);

struct Branch { uint256 amountIn; Step[] steps; }
struct Step   { uint16 adapterId; address tokenOut; bytes data; }
```

A **branch** is one independent path from `tokenIn` to `tokenOut`, and its `amountIn` is the share of the input it trades. A **step** is a single swap: adapter `adapterId` trades the branch's current token into `step.tokenOut` through the pool that `data` identifies. Branches run in order. Each step trades the full measured output of the step before it.

Example: 1 USDC (1,000,000 units) to token X. 70% goes through a V2 pair, and 30% goes through two concentrated pools via EURC.

```text
version 1
branch 0  amountIn 700000  [ step(2, X,    abi.encode(v2Factory)) ]
branch 1  amountIn 300000  [ step(3, EURC, abi.encode(v3Factory, 500)),
                             step(3, X,    abi.encode(v3Factory, 3000)) ]
```

### Limits

| Limit | Value |
| --- | --- |
| Encoded route | 24,576 bytes |
| Branches | 8 |
| Steps per branch | 8 |
| Steps in total | 32 |
| Step `data` | 2,048 bytes |
| Protocol fee | 100 bps (1%) |
| Partner fee | 100 bps (1%) |

### Validation

`execute` reverts before any token moves unless all of these hold:

- Execution is not paused, and `block.timestamp ≤ deadline`.
- `feeConfigVersion` equals the live `feeConfig().version`, so a plan built under one fee can never execute under another.
- `amountIn > 0`, `minNetAmountOut > 0` and `tokenIn ≠ tokenOut`.
- The recipient is not the zero address, the executor or a registered adapter. The same applies to the partner recipient when `partner.bps > 0`.
- `msg.value` equals `amountIn` for native input and is zero otherwise.
- The route decodes as version 1, and its bytes equal the canonical encoding of the decoded value. Trailing data and alternative encodings are rejected.
- Every branch has a positive `amountIn` and one to eight steps, and the branch inputs add up to exactly `amountIn`.
- Every step names an active adapter and does not output its own input token. The last step of every branch outputs `tokenOut`.

## Execution sequence

1. **Pull the input.** For an ERC-20 input the executor calls `transferFrom(msg.sender, executor, amountIn)`. Its balance must rise by exactly `amountIn`, so tokens that tax or rebase on transfer revert with `UnsupportedToken`. Native input arrives as `msg.value`.
2. **Run the branches.** For each step, the executor transfers the current amount to the adapter. The adapter's balance must rise by exactly that amount. Native input is forwarded as value instead. The executor then calls the adapter and measures the step's output as the rise in its own balance of `step.tokenOut`. The adapter's return value is ignored, and a step that produces nothing reverts.
3. **Take the fees.** `grossOut` is the sum of the branch outputs. Both fees round down:

   ```text
   protocolFee = grossOut × protocolFeeBps / 10000
   partnerFee  = grossOut × partner.bps / 10000
   net         = grossOut − protocolFee − partnerFee
   ```

   If `net < minNetAmountOut`, the executor reverts with `Slippage`. Otherwise it pays the protocol fee to the fee recipient and the partner fee to the partner.
4. **Pay the recipient.** The executor transfers `net` and measures the recipient's balance increase, which must be at least `minNetAmountOut`. Measuring starts after the fee payments, so a fee paid to the recipient never counts towards the minimum.
5. **Refund residuals.** Anything this call left in the executor goes back to `msg.sender`, such as sub-unit native USDC dust. Balances that were there before the call are never paid out.
6. **Emit `Executed`.**

```solidity
event Executed(address indexed payer, address indexed recipient, address indexed tokenOut,
    address tokenIn, uint256 amountIn, uint256 grossOut, uint256 netOut,
    uint256 protocolFee, address partnerRecipient, uint256 partnerFee, bytes32 routeHash);
```

`routeHash` is `keccak256(route)`. The executor and adapters 2–6 use a reentrancy lock held in transient storage. Adapter 1 only accepts calls from the executor.

## Adapters

Rules that apply to every adapter:

- Only the executor can call it, and it sends output only to the executor.
- It trades exactly the input it was given. It reverts if input is left over or the pool takes a different amount.
- The output must be positive.
- Pools are resolved through a configured factory's own lookup, or for V4 through the one PoolManager. A step can therefore only reach pools that those contracts created.
- Its configuration (factories, fees, callback selectors, PoolManager) is fixed at deployment. The only setting that can change is adapter 4's hook deny-list.

| Id | Contract | Step `data` | Trades |
| ---: | --- | --- | --- |
| 1 | AchNativeAliasAdapter | empty | Native USDC ↔ `0x3600` USDC |
| 2 | AchV2PairExecutionAdapter | `abi.encode(address factory)` | Constant-product pairs from five V2 factories |
| 3 | AchV3PoolExecutionAdapter | `abi.encode(address factory, int24 key)` | Concentrated-liquidity pools from eight V3 factories and four Slipstream factories |
| 4 | AchV4HookExecutionAdapter | `abi.encode(PoolKey key, bool zeroForOne, uint160 priceLimit, bytes hookData)` | Uniswap V4 pools, with or without hooks |
| 5 | AchLunyaPoolExecutionAdapter | `abi.encode(address factory, uint8 poolType)` | Lunya pools |

The factories each adapter accepts are listed under [contract addresses](/technical/contract-addresses#configured-factories).

### 1 · Native alias

On Arc, the native gas currency (18 decimals) and the ERC-20 at `0x3600…0000` (6 decimals) are one balance. Going from native to `0x3600`, the value must be a whole multiple of 10¹², and the adapter returns `value / 10¹²` ERC-20 units. Going from `0x3600` to native, it returns `amount × 10¹²` wei. The conversion has no price and no fee.

### 2 · V2 pairs

The pair is `factory.getPair(tokenIn, tokenOut)`. The adapter sends the input to the pair and requests

```text
out = amountIn × m × reserveOut / (reserveIn × d + amountIn × m)
```

where `m/d` is the factory's fixed fee: 997/1000 (0.30%) for all five configured factories. This is the pair's own invariant formula, and the pair checks its invariant, so the adapter receives exactly this amount or the step reverts. If the input arrives short at the pair, the step also reverts.

### 3 · V3 and Slipstream pools

The pool is the factory's own `getPool(token0, token1, key)`:

- For fee-keyed factories (Uniswap V3 and its forks), `key` is the fee tier in hundredths of a basis point, for example `500` or `3000`.
- For tick-spacing-keyed factories (Slipstream, including Aero CL), `key` is the pool's tick spacing.

The adapter calls `pool.swap(executor, zeroForOne, amountIn, limit, "")` with the price limit at the end of the range. The pool therefore either trades the full input or the step reverts. Partial fills are never accepted.

A concentrated pool pays out first and then calls back for the input. Forks give that callback different names, so each factory is configured with its own callback selector. The adapter records the swap in transient storage and accepts exactly one callback, which must:

- come from the pool being swapped;
- use that factory's selector;
- arrive while that swap is running;
- ask for exactly the input after the pool has paid a positive output.

The adapter then transfers exactly the input to the pool. Any other caller or selector, a second callback, or a partial fill reverts. `poolFor(tokenA, tokenB, factory, key)` returns the pool a payload resolves to, or zero if the factory is not configured.

### 4 · Uniswap V4

The step runs inside `PoolManager.unlock`. The adapter accepts the callback only from the PoolManager, and only with the payload it started. It checks the payload's hash and clears it before any external call. Inside the callback it swaps exactly `amountIn` as an exact-input swap and requires the pool to take exactly that amount and pay a positive output. It then settles the input and takes the output to the executor. The PoolManager also requires every balance to be settled before `unlock` returns.

- `PoolKey` is `(currency0, currency1, fee, tickSpacing, hooks)`, with `currency0 < currency1`.
- `zeroForOne` must agree with the step's input and output tokens. `priceLimit = 0` means no limit.
- Pools whose currency is native USDC (`address(0)`) are traded with native value directly.
- `hookData` can be at most 1,024 bytes and must be empty for hookless pools.

**Hooks.** Any hook may run unless the adapter owner has put it on the deny-list (`deniedHook(hook)`). A denial takes effect on the next swap. A hook that changes the amount being swapped makes the step revert, because exact input is enforced. Whatever a hook does to the price, the minimum the executor measures still applies to the whole route.

### 5 · Lunya

The pool is the Lunya factory's own `getPool(token0, token1, poolType)`. Pool type `0` is concentrated liquidity, `1` is constant product and `2` is stable. Lunya pools use the V3 swap shape under their own callback name (`0xd9c40d3a`), and the adapter applies the same single-callback rules as adapter 3. AchSwap's router currently uses concentrated and constant-product Lunya pools.

### 6 · Virtuals launch curves

A Virtuals launch token trades against the asset token, VIRTUAL, on a bonding curve until it graduates to a Uniswap V2 pair. The adapter trades one of those curves in either direction: buying the launch token with VIRTUAL, or selling it back. One side of the step must be VIRTUAL and the other a token with a curve in the configured FFactory (`getPair(token, VIRTUAL)`); anything else is refused before any call.

The trade goes through the Virtuals Bonding contract (`buy` or `sell`), whose FRouter pulls the input from the adapter. The FRouter is the only spender ever approved, for exactly the input, and the approval is reset to zero in the same step. The payload is `abi.encode(bonding)` and must name the configured Bonding contract.

Launch status and taxes belong to the Bonding contract: 1% on each side, and a decaying anti-sniper tax in a launch's first minutes. A token that is not trading reverts there. AchSwap's router does not route launches still in their anti-sniper period, and the executor's minimum on the final output covers the rest.

## Native USDC

- **Paying native USDC.** Set `tokenIn = address(0)` and `msg.value = amountIn` in 18-decimal wei. Typically each branch starts with a step on adapter 1 to `0x3600`, and no approval is needed. Before any step that spends native USDC, the executor rounds the branch amount down to a whole multiple of 10¹² wei. The remainder is refunded at the end.
- **Receiving native USDC.** Set `tokenOut = address(0)`, and end each branch with a step on adapter 1 from `0x3600` to `address(0)`. The output is measured as a native balance.
- **One reserve.** Native USDC and `0x3600` debit the same balance, so the executor treats them as one reserve when it protects pre-existing balances.

## Errors

| Error | Cause |
| --- | --- |
| `Paused()` | Execution is paused. |
| `Expired()` | `block.timestamp` is past `deadline`. |
| `StaleFeeConfig()` | `feeConfigVersion` is not the live fee configuration. Request a new quote. |
| `InvalidRoute()` | The encoding, a limit, the token chain or the input sum is wrong, or a step names an inactive adapter. |
| `InvalidValue()` | `msg.value` does not match the input. |
| `InvalidConfig()` | The partner fee is above 100 bps, or a recipient is not allowed. |
| `UnsupportedToken()` | A token moved a different amount than requested, as with transfer taxes, rebasing or blocked transfers. |
| `Slippage()` | The output is below `minNetAmountOut`, or a step produced nothing. |
| `NativeTransferFailed()` | A native USDC payment was rejected by its receiver. |

Adapters revert with short reasons:

- `pool`: no pool matches the payload.
- `partial fill`, `partial input`: the pool did not take exactly the input.
- `zero output`: the step produced nothing.
- `hook denied`: the pool's hook is on the deny-list.
- `callback sender`, `callback selector`: an unexpected callback.

## Administration

| Action | Who | Delay |
| --- | --- | --- |
| Pause execution | Owner | Immediate (`pause`). `activate` resumes. |
| Disable an adapter | Owner | Immediate. The id can never be re-enabled or pointed elsewhere. |
| Add an adapter | Owner schedules, anyone activates | 2 days (`scheduleAdapter`, then `activateAdapter`) |
| Lower the protocol fee | Owner | Immediate (`decreaseProtocolFee`) |
| Raise the protocol fee | Owner schedules, anyone executes | 2 days, up to 100 bps (`scheduleProtocolFee`, then `executeProtocolFee`) |
| Change the fee recipient | Owner schedules, the new recipient accepts | 2 days (`scheduleProtocolFeeRecipient`, then `acceptProtocolFeeRecipient`) |
| Deny a V4 hook | Adapter 4 owner | Immediate (`setHookDenied`) |
| Transfer ownership | Owner | Two steps (`transferOwnership`, then `acceptOwnership`). Renouncing is disabled. |

- Every fee or recipient change increments `feeConfig().version`, which invalidates plans built before the change.
- Adapters 1 to 5 were registered before the executor was first activated. That registration path closed permanently on activation. Adapter 6 was added later through the two-day delay.
- Adapter ids are never reused, so replacing an adapter means a new id and the two-day delay.

The owner cannot move user funds. The executor pulls only from `msg.sender`, only the `amountIn` of the call being executed, and keeps nothing afterwards.

## Calling the executor directly

The simplest integration is the [quote API](/technical/routing-engine#api), which returns a verified plan and then builds and simulates the transaction for you. To encode a plan yourself (ethers v6):

```ts
import { AbiCoder, Contract, ZeroAddress } from "ethers";

const EXECUTOR = "0x1B844738455b8060D12839331b35893526E9d314";
const coder = AbiCoder.defaultAbiCoder();

// One branch with one step: tokenIn -> tokenOut on a fee-keyed V3 pool.
// Adapter 3's poolFor(tokenIn, tokenOut, v3Factory, 500) must return a pool.
const route = coder.encode(
  ["uint8", "tuple(uint256 amountIn, tuple(uint16 adapterId, address tokenOut, bytes data)[] steps)[]"],
  [1, [{ amountIn, steps: [{ adapterId: 3, tokenOut, data: coder.encode(["address", "int24"], [v3Factory, 500]) }] }]],
);

const executor = new Contract(EXECUTOR, [
  "function feeConfig() view returns (address protocolFeeRecipient, uint16 protocolFeeBps, uint64 version)",
  "function execute((address tokenIn, address tokenOut, address recipient, uint256 amountIn, uint256 minNetAmountOut, uint256 deadline, uint64 feeConfigVersion) request, (address recipient, uint16 bps) partner, bytes route) payable returns (uint256)",
], signer);

const [, , version] = await executor.feeConfig();
// Approve EXECUTOR for amountIn of tokenIn first. Native USDC input needs no approval.
await executor.execute(
  { tokenIn, tokenOut, recipient, amountIn, minNetAmountOut, deadline, feeConfigVersion: version },
  { recipient: ZeroAddress, bps: 0 },
  route,
);
```

Set `minNetAmountOut` from your own quote. Simulate the call with `eth_call` before you send it: a plan that has not been simulated can revert.
