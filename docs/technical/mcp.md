# MCP Server

Model Context Protocol (MCP) server for Achswap V2 DEX on ARC Testnet. Connect any AI agent to Achswap for token swaps, liquidity management, and pool data.

## Overview

The Achswap MCP server allows AI agents to interact with the Achswap DEX through natural language. Execute swaps, manage liquidity, check pool reserves, and more.

## Features

- **Wallet**: Generate wallets, get addresses, check balances
- **Pool Data**: Get reserves, swap quotes
- **Swap**: Token swaps (exact in/out, native/ERC20)
- **Liquidity**: Add/remove V2 liquidity positions

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
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_swap_quote","arguments":{"amount_in":"1000000000000000000","token_in":"USDC","token_out":"ACHS"}}}'
```

## Available Tools

### Wallet

| Tool | Description |
|------|-------------|
| `generate_wallet` | Generate a new random wallet |
| `get_wallet_address` | Get the wallet address |
| `get_wallet_info` | Get wallet address (alias) |
| `get_native_balance` | Get native USDC balance |
| `get_token_balance` | Get ERC20 token balance |
| `get_all_token_balances` | Get all token balances |
| `check_rpc_status` | Verify RPC connection |

### Transfers

| Tool | Description |
|------|-------------|
| `transfer_native` | Transfer native USDC |
| `transfer_token` | Transfer ERC20 tokens |
| `wrap_native` | Wrap native USDC → wUSDC |
| `unwrap_wusdc` | Unwrap wUSDC → native USDC |

### Pool Data

| Tool | Description |
|------|-------------|
| `get_pool_reserves` | Get V2 pool reserves |
| `check_pair_exists` | Check if pool exists |
| `get_add_liquidity_ratio` | Calculate liquidity ratio |
| `get_swap_quote` | Get swap quote (output for input) |
| `get_swap_quote_reverse` | Get required input for desired output |

### Swaps

| Tool | Description |
|------|-------------|
| `approve_token` | Approve router to spend token |
| `swap_exact_tokens_for_tokens` | Swap token → token |
| `swap_exact_eth_for_tokens` | Swap native → token |
| `swap_exact_tokens_for_eth` | Swap token → native |

### Liquidity

| Tool | Description |
|------|-------------|
| `add_liquidity` | Add token + token liquidity |
| `add_liquidity_eth` | Add native + token liquidity |
| `remove_liquidity` | Remove liquidity to tokens |
| `remove_liquidity_eth` | Remove liquidity to native |
| `get_liquidity_position` | Get LP balance in pool |

### Approvals

| Tool | Description |
|------|-------------|
| `get_allowance` | Check router allowance |
| `approve_token` | Approve token for trading |

## Token Addresses (ARC Testnet)

| Token | Address |
|-------|---------|
| Native USDC | `0x0000000000000000000000000000000000000000` |
| wUSDC | `0xDe5DB9049a8dd344dC1B7Bbb098f9da60930A6dA` |
| ACHS | `0x45Bb5425f293bdd209c894364C462421FF5FfA48` |

## Contract Addresses

| Contract | Address |
|----------|---------|
| V2 Factory | `0x7cC023C7184810B84657D55c1943eBfF8603B72B` |
| V2 Router | `0xB92428D440c335546b69138F7fAF689F5ba8D436` |

## RPC

- **ARC Testnet RPC**: `https://rpc.testnet.arc.network`
- **Chain ID**: `5042002`

## Examples

### Check RPC Status

```
tools/call: check_rpc_status
```

### Get Wallet Address

```
tools/call: get_wallet_address
```

### Get Swap Quote (1 USDC to ACHS)

```
tools/call: get_swap_quote
Arguments: {
  "amount_in": "1000000000000000000",
  "token_in": "USDC",
  "token_out": "ACHS"
}
```

### Add Liquidity

```
tools/call: add_liquidity
Arguments: {
  "token_a": "USDC",
  "token_b": "ACHS",
  "amount_a_desired": "1000000000000000000",
  "amount_b_desired": "100000000000000000000"
}
```
