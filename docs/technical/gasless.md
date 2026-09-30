---
sidebar_position: 2
---

# Gasless architecture

Gasless swaps let a user trade without holding gas: the user signs once, an allowlisted relayer submits the transaction and pays the gas, and the `AchSponsoredExecutorV3` contract executes exactly what was signed.

## Components

| Component | Role |
| --- | --- |
| Wallet | Signs one Permit2 `PermitWitnessTransferFrom`. The swap is its witness. |
| AchSwap frontend | Builds the route calldata (KyberSwap build, LI.FI transaction, or AchSwap aggregator call), the order, and the signature request. |
| Relay (`/api/relay`) | Validates the order and signature off chain, simulates, and broadcasts from an allowlisted relayer wallet. |
| `AchSponsoredExecutorV3` | Pulls the input through Permit2, calls the allowlisted target, and enforces the minimum output on the recipient's balance. |
| Permit2 | Verifies the signature (token, amount, spender, nonce, deadline, chain, witness) and moves the input. |
| Targets | KyberSwap router, LI.FI diamond, AchSwap execution router, AchSwap route executor. |

## Flow

1. The frontend gets a quote. Gasless applies to exact-input swaps from USDC, EURC or cirBTC through KyberSwap, LI.FI or the AchSwap aggregator. The input must be above the USD floor.
2. If the input token has no Permit2 allowance, the user sends a one-time ERC-20 approval to Permit2.
3. The frontend builds the target calldata with the executor as sender and the user as recipient, then the order:
   `(user, tokenIn, amountIn, nonce, deadline, target, spender, tokenOut, minAmountOut, recipient, value, callData)`.
4. The user signs once. The frontend posts `{ mode: "sponsored", order, signature }` to `/api/relay`.
5. The relay checks the order and recovers the signer. It simulates `execute(order, signature)`, refuses anything above its gas cap, then signs locally and broadcasts. It never attaches native value.
6. On chain the executor:
   - checks the relayer, the input/target/spender allowlists, the value rules and the deadline;
   - calls `Permit2.permitWitnessTransferFrom` with the witness it recomputes from the order;
   - approves the exact input to the spender and calls the target;
   - resets the approval and refunds any unused input to the user;
   - forwards output left on the executor, then requires the recipient's balance increase to be at least `minAmountOut`.

## The signature

Domain: `{ name: "Permit2", chainId: 5042, verifyingContract: 0x000000000022D473030F116dDEE9F6B43aC78BA3 }`.

```text
PermitWitnessTransferFrom(TokenPermissions permitted,address spender,uint256 nonce,uint256 deadline,SponsoredSwap witness)
SponsoredSwap(address target,address spender,address tokenOut,uint256 minAmountOut,address recipient,uint256 value,bytes32 callDataHash)
TokenPermissions(address token,uint256 amount)
```

`spender` in the permit is the executor. `callDataHash` is `keccak256(callData)`. The executor recomputes the witness from the order it receives, so a relayer that changes any field makes Permit2 reject the signature with `InvalidSigner`. The Permit2 nonce is the only nonce: a signature executes at most once, and a user can cancel it with `invalidateUnorderedNonces`. `executor.signingDigest(order)` returns the exact digest a wallet signs.

## Arc USDC rules

Arc has one USDC balance with two views: the 6-decimal ERC-20 at `0x3600000000000000000000000000000000000000` and the 18-decimal native currency.

- **USDC input** is always `tokenIn = 0x3600…` with a 6-decimal amount.
  - Allowance mode (KyberSwap, LI.FI): `spender` = router, `value = 0`.
  - Native-forward mode (AchSwap router): `spender = 0x0`, `value = amountIn × 10^12`. The executor forwards the pulled USDC as native value.
- **USDC output** is signed as `tokenOut = 0x0000000000000000000000000000000000000000` with `minAmountOut` in 18-decimal wei. The executor then measures the native balance. Signing `0x3600…` as output reverts with `InvalidOutputToken()`.
- Raw native input (`address(0)`) is not accepted, and `execute` is not payable.

## Security properties

- **Only the user chooses the trade.** Every field is bound by the one signature. The relayer can only submit it unchanged, or not at all.
- **Restricted inputs, open outputs.** Inputs, targets, spenders and relayers are owner-curated allowlists. Output tokens are not allowlisted: the user signs `tokenOut`, and the executor holds no funds between transactions. An unusual output token can only affect the user who chose it.
- **Exact amounts.** Permit2 pulls exactly `amountIn`. Taxed or short input deliveries revert. Approvals are exact and reset to zero in the same transaction.
- **Minimum on actual receipt.** `minAmountOut` is checked against the recipient's balance increase, not against the router's return value.
- **Wallet stays the recipient.** The frontend and the relay both refuse a recipient other than the signer.
- **No delegatecall, reentrancy guarded, pausable.**

## Configuration

On chain (owner only): `addInputToken` / `removeInputToken`, `addTarget` / `removeTarget`, `addApprovalTarget` / `removeApprovalTarget`, `addRelayer` / `removeRelayer`, `setRelayerEnforcement`, `pause` / `unpause`.

| List | Current entries |
| --- | --- |
| Input tokens | EURC `0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1`, cirBTC `0x171A4217b86A807A64eB94757Db6849fb4bDbAA0`, USDC `0x3600000000000000000000000000000000000000` |
| Targets and approval spenders | KyberSwap `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5`, LI.FI `0xA4072583658Fae592A3506A42431cb6316a8d40b`, AchExecutionRouter `0xb1C3B6B8B371aFd9c938AC064f7aeD33d6BC26cA`, AchRouteExecutor `0xcD1bc4f6A4448FeA4DE51410D3b571732FE55Af8` (added 30 Sep 2026) |
| Relayers | `0x8bbB0990B9Ba9DeFDb10389e59955886F79B19cC`, `0x6e0df2d65d309b55B217B5237657302386E75584` |
| Relayer enforcement | on |

The app's executor address, allowlist mirror and EIP-712 types live in `shared/deployment-config.js`. Server-side operator settings:

| Setting | Meaning |
| --- | --- |
| `FEATURE_GASLESS` | Must be exactly `true` to enable the relay and the gasless toggle. |
| `RELAYER_PRIVATE_KEY` / `RELAYER_PRIVATE_KEYS` | Funded relayer wallets. Each must be on the executor's relayer list. |
| `MINIUM_USDC`, `MINIUM_EURC`, `MINIUM_cirBTC` | USD floor per input token, read on every request (default $5). |
| `GASLESS_MAX_GAS` | Simulated gas cap per sponsored swap (default 3,000,000). |

## Deployment

| Item | Value |
| --- | --- |
| AchSponsoredExecutorV3 | `0x5D5B486D032Da0B9d02651375CEe1107D40bef0b` |
| Deployment transaction | `0xbfb020e4a99a2bf7d27ce7bf965486344b978e83cb96ef4f561180ebfabfde26` (block 23434238) |
| Constructor argument | Permit2 `0x000000000022D473030F116dDEE9F6B43aC78BA3` |
| Compiler | solc 0.8.24, via-IR, optimizer 200 runs, EVM cancun |
| Runtime code hash | `0x105b9382ca96cddf71c425ede9436a695987dc2a6ca92db621fe91d5d626e0b3` |

The deployment transaction's input matches the compiled creation bytecode byte for byte. The live runtime code matches the compiled runtime once the Permit2 immutable is filled in.

Superseded executors, not used by the app: v2 `0x114FFB915eF00173D1c986c6FF5d445175622442` (two signatures), v1 `0x1bC5c96ce21bc721e97DcBeABe787B9d83Dc8b1d`.

See the [user guide](/achswap/gasless) and [contract addresses](/technical/contract-addresses).
