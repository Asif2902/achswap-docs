---
sidebar_position: 7
---

# Gasless Swap

Swap tokens without paying gas fees. AchSwap's gasless mode lets you sign a transaction and have the relayer submit it on your behalf.

## What Is Gasless Swap?

Gasless swap is a meta-transaction system where:

1. **You sign** a swap request off-chain
2. **The relayer** submits the transaction and pays the gas
3. **Your tokens** are transferred via Permit2 authorization

You never need to hold native USDC for gas — only the tokens you want to swap.

## How It Works

### The Flow

```
1. Enable Gasless Mode (Zap icon)
2. Approve Permit2 (one-time per token)
3. Enter swap details
4. Sign the permit message
5. Relayer submits transaction
6. Swap confirmed
```

### Permit2 Authorization

Gasless swaps use [Permit2](https://docs.uniswap.org/contracts/permit2/overview), a standard token authorization contract:

- **First use**: Approve your token to Permit2, then approve Permit2 to the AchSwap Gasless contract
- **Subsequent uses**: No approval needed (valid for 1 year)
- **Revocable**: You can revoke approval at any time through your wallet

### Signing Process

When you click Swap in gasless mode:

1. Your wallet shows a signature request
2. This signs a `SignedExecution` message containing:
   - Swap parameters (tokens, amounts, slippage)
   - A unique nonce (prevents replay)
   - Deadline timestamp
3. The signed message is sent to the relayer
4. The relayer verifies and submits the transaction

## Enabling Gasless Mode

1. Click the **Zap** icon in the swap header
2. The icon turns green when active
3. If Permit2 is not approved, click **Enable Permit2 for Gasless**
4. Confirm the approval in your wallet (one-time per token)

## Supported Operations

| Operation | Gasless Support |
|-----------|----------------|
| Token swap (V2) | Yes |
| Token swap (V3 single-hop) | Yes |
| Token swap (V3 multi-hop) | Yes |
| Token swap (V4) | Yes |
| Aggregator swap (split routing) | Yes |
| Wrap/Unwrap | No (use regular swap) |
| Add Liquidity | No |
| Remove Liquidity | No |
| RWA swaps | No |
| Cross-chain bridge | No |

## Important Details

### Token Requirements

- Gasless swaps require **ERC-20 input tokens** (not native USDC directly)
- Native USDC is automatically converted to the ERC-20 representation for Permit2
- The relayer never has access to your tokens — only the signed authorization

### Nonce Management

Each gasless swap uses a unique nonce combining:
- Timestamp (for ordering)
- Random component (for uniqueness)

This prevents replay attacks and ensures transactions are processed in order.

### Deadline

Gasless swaps have a 30-minute deadline. If the relayer cannot submit within this window, the signed authorization expires.

### Relayer Retry Logic

If the relayer encounters issues (nonce conflicts, network errors), it automatically:
- Retries with different relayer wallets (up to 5 attempts)
- Bumps gas fees progressively
- Falls back to alternative RPC providers

## Limits and Restrictions

| Limit | Value |
|-------|-------|
| Max input | No hard limit |
| Min input | ~0.000001 USDC equivalent |
| Deadline | 30 minutes |
| Custom recipient | Not supported (sends to connected wallet only) |
| RWA swaps | Not supported |

## Troubleshooting

### "Gasless swaps do not support native input"
This error shouldn't occur — the UI automatically converts native USDC. If you see this, try refreshing the page.

### "Permit2 not approved"
Click **Enable Permit2 for Gasless** and confirm the approval in your wallet.

### "Relayer request timed out"
The relayer may be under heavy load. Try again in a few seconds, or disable gasless mode to swap normally.

### "Transaction reverted"
The swap conditions may have changed. Refresh the quote and try again with updated slippage settings.

## Technical Details

### Contract Addresses

| Contract | Address |
|----------|---------|
| AchSwapGasless | `0x9f99094cA9e6516d4587E1A81952675D0a4d387A` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |

### Execution Kinds

The relayer dispatches swaps based on protocol type:

| Kind | Protocol |
|------|----------|
| 0 | Aggregator (split routing) |
| 1 | V2 |
| 2 | V3 single-hop |
| 3 | V3 multi-hop |
| 4 | V4 |

### EIP-712 Domain

The gasless contract uses EIP-712 typed signatures:

- **Domain name**: `AchSwapGasless`
- **Version**: `1`
- **Chain ID**: `5042002` (ARC Testnet)

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
