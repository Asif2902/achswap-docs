# MCP Server

Model Context Protocol (MCP) server for Achswap DEX on ARC Testnet. Connect any AI agent to Achswap for V2+V3 smart-routed swaps, liquidity management, token deployment, and on-chain analytics.

## Overview

The Achswap MCP server allows AI agents to interact with the Achswap DEX through natural language. Swaps are automatically routed across V2 and V3 pools via the AchSwapAdapter to find the best price. AI agents can also deploy custom tokens, burn tokens, check transaction history, and analyze token holder distribution.

## What's New (v3.0)

- **V2+V3 Smart Routing** — Swaps route through AchSwapAdapter, automatically finding the best price across V2 and V3 pools with split routing (50/50, 70/30, 30/70 V2+V3)
- **Quote Inspector** — `quote_adapter` shows exactly which router (V2 or V3) and fee tier is used, via staticCall (no transaction)
- **Token Deploy** — Deploy pre-compiled ERC20Burnable tokens with name, symbol, and total supply
- **Token Burn** — Permanently destroy tokens from your balance
- **Transaction History** — Recent transactions with decoded method calls, token transfers, and gas fees
- **Token Holders** — Top holders ranked by balance with percentage of total supply
- **33 total tools** across 7 categories

## Features

### Tool Categories (33 tools)

| Category | Count | Description |
|----------|-------|-------------|
| Auth | 1 | Generate wallet |
| Wallet | 12 | Balance, transfer, wrap/unwrap, approvals, token info |
| Pool | 5 | V2 reserves, quotes, pair lookup |
| Swap | 5 | V2+V3 best-route via AchSwapAdapter |
| Liquidity | 6 | Add/remove V2 liquidity |
| Token | 2 | Deploy ERC20Burnable, burn tokens |
| Analytics | 2 | Transaction history, token holders |

## API Endpoint

```
https://api.achswapfi.xyz/mcp
```

## Configuration

### Claude Code

```json
{
  "mcpServers": {
    "achswap": {
      "url": "https://api.achswapfi.xyz/mcp/message",
      "headers": {
        "X-Private-Key": "0xYOUR_PRIVATE_KEY"
      }
    }
  }
}
```

### Cline

```json
{
  "mcpServers": {
    "achswap": {
      "url": "https://api.achswapfi.xyz/mcp/message",
      "headers": {
        "X-Private-Key": "0xYOUR_PRIVATE_KEY"
      }
    }
  }
}
```

### OpenCode

```json
{
  "mcp": {
    "achswap": {
      "type": "remote",
      "url": "https://api.achswapfi.xyz/mcp",
      "headers": {
        "X-Private-Key": "0xYOUR_PRIVATE_KEY"
      },
      "enabled": true
    }
  }
}
```

### cURL

```bash
curl -X POST https://api.achswapfi.xyz/mcp/message \
  -H "Content-Type: application/json" \
  -H "X-Private-Key: 0xYOUR_PRIVATE_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"quote_adapter","arguments":{"token_in":"USDC","token_out":"ACHS","amount_in":"1000000000000000000"}}}'
```

## Available Tools

### Auth

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `generate_wallet` | Generate a new random wallet. Returns private key once. | No |

### Wallet

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `get_wallet_address` | Get wallet address from private key | Yes |
| `get_wallet_info` | Get wallet address (key never echoed) | Yes |
| `get_native_balance` | Get native USDC balance (18 decimals) | Yes |
| `get_token_balance` | Get ERC20 token balance with proper decimals | Yes |
| `get_all_token_balances` | Get all ERC20 tokens in wallet | Yes |
| `get_allowance` | Check adapter allowance for a token | Yes |
| `get_token_info` | Get token symbol and decimals for any address | Yes |
| `check_rpc_status` | Verify RPC connection and chain info | No |
| `transfer_token` | Transfer ERC20 tokens to any address | Yes |
| `transfer_native` | Transfer native USDC to any address | Yes |
| `wrap_native` | Wrap native USDC → wUSDC | Yes |
| `unwrap_wusdc` | Unwrap wUSDC → native USDC | Yes |

### Pool Data

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `get_pool_reserves` | Get V2 pool reserves for a token pair | No |
| `check_pair_exists` | Check if a V2 liquidity pool exists | No |
| `get_add_liquidity_ratio` | Calculate how much token B for given token A | No |
| `get_swap_quote` | V2-only quote (output amount for input) | No |
| `get_swap_quote_reverse` | V2-only reverse quote (input needed for output) | No |

### Swaps via AchSwapAdapter (V2+V3)

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `approve_token` | Approve the adapter to spend a token | Yes |
| `quote_adapter` | StaticCall quote across V2+V3. Shows decoded route (which router/fee tier is used). No transaction. | No |
| `swap_via_adapter` | Swap any→any. Auto-routes V2+V3, auto-approves adapter. | Yes |
| `swap_native_via_adapter` | Swap native USDC → ERC20 token (shortcut) | Yes |
| `swap_to_native_via_adapter` | Swap ERC20 token → native USDC (shortcut) | Yes |

:::info How the Adapter Works
The AchSwapAdapter (`0xF82c...8AFB`) evaluates all possible routes in a single `quote()` call:
- V2 direct | V3 direct (best fee tier) | V2 two-hop (via WETH) | V3 two-hop
- 50/50, 70/30, 30/70 V2+V3 split routing

It returns whichever gives the highest output. The `quote_adapter` tool uses a staticCall (10M gas, no transaction) so you can inspect the route before swapping.
:::

### Liquidity (V2)

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `add_liquidity` | Add token + token to V2 pair | Yes |
| `add_liquidity_eth` | Add native USDC + token to V2 pair | Yes |
| `remove_liquidity` | Remove LP, receive both tokens | Yes |
| `remove_liquidity_eth` | Remove LP, receive native USDC + token | Yes |
| `remove_liquidity_token` | Remove LP, receive wUSDC + token | Yes |
| `get_liquidity_position` | Get LP balance and underlying token amounts | Yes |

### Token Management

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `deploy_token` | Deploy a new ERC20Burnable token (18 decimals). Mints full supply to deployer. | Yes |
| `burn_token` | Permanently destroy tokens from your balance | Yes |

### Analytics

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `get_transaction_history` | Recent transactions for any wallet. Includes decoded method calls, from/to labels, token transfers, gas fees, timestamps. | No |
| `get_token_holders` | Top token holders with balance, percentage of supply, and contract/EOA labels. | No |

## Token Addresses (ARC Testnet)

| Token | Address | Decimals |
|-------|---------|----------|
| Native USDC | `0x0000000000000000000000000000000000000000` | 18 |
| wUSDC | `0xDe5DB9049a8dd344dC1B7Bbb098f9da60930A6dA` | 18 |
| ACHS | `0x45Bb5425f293bdd209c894364C462421FF5FfA48` | 18 |

## Contract Addresses

| Contract | Address |
|----------|---------|
| V2 Factory | `0x7cC023C7184810B84657D55c1943eBfF8603B72B` |
| V2 Router | `0xB92428D440c335546b69138F7fAF689F5ba8D436` |
| AchSwap Adapter | `0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB` |

## Security

- Private keys are passed via `X-Private-Key` header per request — **never stored on disk**
- Key is held in memory only during request processing, then cleared
- Private key patterns are redacted from all server-side output (stdio mode)
- HTTPS required for production use
- No request logging of headers or bodies

## RPC

- **ARC Testnet RPC**: `https://rpc.testnet.arc.network`
- **Chain ID**: `5042002`
- **Explorer**: `https://testnet.arcscan.app`

## AI Agent Workflows

### Swap USDC → ACHS (Best Route)

```
1. quote_adapter(token_in="USDC", token_out="ACHS", amount_in="1000000000000000000")
   → Shows: expected output, route (V2 or V3), fee tiers used

2. swap_via_adapter(amount_in="1000000000000000000", token_in="USDC", token_out="ACHS")
   → Returns: tx hash, actual output, route used
```

### Deploy and Distribute a Token

```
1. deploy_token(token_name="MyCoin", token_symbol="MC", total_supply="1000000")
   → Returns: contract address, total supply

2. transfer_token(token_address="0xNewToken...", to_address="0xRecipient...", amount="1000000000000000000000")
   → Distributes tokens
```

### Analyze Token Distribution

```
1. get_token_holders(token_address="ACHS", limit=25)
   → Returns: top holders with balance and % of supply

2. get_transaction_history(address="0xSomeWallet...", limit=10)
   → Returns: recent txs with decoded calls
```

### Provide Liquidity

```
1. get_add_liquidity_ratio(token_a="USDC", token_b="ACHS", amount_a="1000000000000000000")
   → Returns: how much ACHS to pair

2. add_liquidity(token_a="USDC", token_b="ACHS", amount_a_desired="...", amount_b_desired="...")
   → Returns: LP tokens received
```
