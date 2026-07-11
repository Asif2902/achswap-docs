---
sidebar_position: 4
---

# MCP Server (Hosted, Keyless)

AchSwap exposes its DEX to AI agents through the **Model Context Protocol (MCP)**.
This page covers the **hosted MCP server** that AchSwap runs for you, so you don't
have to deploy or operate any backend yourself. For the local signer that actually
holds and signs with your keys, see [AchSwap SDK](./sdk.md).

## The one thing to understand: it is keyless

The AchSwap MCP server **never receives your private key**. It only ever builds
**unsigned** transactions and returns public on-chain data (balances, quotes,
reserves, history). Signing always happens **on your own machine**, in the local
SDK. This is true whether you use the hosted server or run everything locally.

```
  Your AI agent  ──▶  AchSwap MCP server (hosted or local)
                          │
                          │  builds UNSIGNED tx + returns public reads
                          ▼
                   Local SDK signer (your machine)
                          │
                          │  signs with your keystore + broadcasts
                          ▼
                       ARC blockchain
```

Your private key stays inside `~/.achswap/keystore.json` on your computer. It is
never sent over the network, never sent to the hosted server, and never logged.

## Two ways to run it

| | Hosted server (this page) | Local SDK ([sdk.md](./sdk.md)) |
|---|---|---|
| Who runs the backend? | AchSwap (`mcp-api.achswap.app`) | You (on your machine) |
| Reads + tx building | On AchSwap's server | On your machine |
| Signing | On your machine (SDK) | On your machine (SDK) |
| Install needed | SDK signer only | SDK signer only |
| Best for | Quick start, zero backend ops | Maximum privacy / control |

Both modes use the **same local SDK signer** and the **same 37 tools**. The only
difference is *where transactions get built* — on AchSwap's hosted server
(`remote` mode, the default) or entirely on your device (`local` mode).

## Hosted MCP server

- **Endpoint:** `https://mcp-api.achswap.app`
- **Transport:** MCP over HTTPS (Streamable HTTP / `tools/call`)
- **Keyless:** builds unsigned transactions only; never sees your private key
- **Network:** ARC Testnet (`chainId 5042002`)

Because signing is local, the hosted server is safe to point your agent at: it can
read your public balances and prepare transactions, but it cannot move funds
without your local signer.

### Connect your AI client (remote mode)

In remote mode the SDK talks to the hosted server automatically — you usually do
not need to configure anything. If you want to point a client *directly* at the
hosted MCP endpoint, use a remote MCP config (no `X-Private-Key` is required or
accepted — the design is keyless):

**OpenCode** (`~/.config/opencode/opencode.jsonc`):

```json
{
  "mcp": {
    "achswap": {
      "type": "remote",
      "url": "https://mcp-api.achswap.app/mcp/message",
      "enabled": true
    }
  }
}
```

**Claude / Cline** (`claude_desktop_config.json` / `cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "achswap": {
      "url": "https://mcp-api.achswap.app/mcp/message"
    }
  }
}
```

> The SDK's own `achswap install <client>` command writes these for you. For the
> fully self-hosted path (no AchSwap server at all), set `ACHSWAP_MODE=local`.

## What the server provides

The hosted server exposes the full AchSwap toolset (reads + unsigned-tx builders).
The complete, always-current list is in [AchSwap SDK → Tools](./sdk.md#tools).
Highlights:

- **Wallet reads:** address, native & token balances, allowances, token info
- **Decimals & units:** `get_decimals`, `to_wei`, `from_wei` — always resolve the
  real on-chain decimals so the agent never guesses (USDC/wUSDC are 18; other
  tokens vary)
- **Swaps:** `quote_adapter` (best route across V2 + V3 via the AchSwapAdapter),
  and builders for token→token, native→token, token→native
- **Liquidity:** add/remove V2 liquidity (incl. native + wUSDC variants)
- **Tokens:** deploy / burn ERC-20
- **Analytics:** transaction history, top token holders

## Tokens & decimals (read this before building amounts)

- **Native USDC** (`0x0000…0000`) is the **gas token** on ARC — 18 decimals.
- **wUSDC** (`0xDe5D…A6dA`) is the **wrapped** form of USDC used by V2/V3 pools —
  also 18 decimals. The router wraps/unwraps it automatically.
- **ACHS** is 18 decimals.
- **User-deployed tokens can be anything (6/9/18/…).** Never hardcode decimals.
  Call `get_decimals` / `to_wei` / `from_wei` for every token.

## Contract addresses the SDK uses (ARC Testnet)

| Contract | Address |
|----------|---------|
| V2 Factory | `0x7cC023C7184810B84657D55c1943eBfF8603B72B` |
| V2 Router | `0xB92428D440c335546b69138F7fAF689F5ba8D436` |
| AchSwap Adapter | `0xF82c88FbF46E109a3865647E5c4d4834b31f8AFB` |

For the full contract reference (including V3 pools) see
[Contract Addresses](../technical/contract-addresses.md).

## RPC & network

- **ARC Testnet RPC:** `https://rpc.testnet.arc.network`
- **Chain ID:** `5042002`
- **Explorer:** `https://testnet.arcscan.app`
- **Native gas token:** USDC (18 decimals)

## Trust & security summary

- The hosted server is **keyless**: it builds unsigned transactions and serves
  public data. It cannot sign or move funds.
- Your private key lives only in an **encrypted keystore** on your machine
  (`~/.achswap/keystore.json`), encrypted with a password via `ethers.Wallet.encrypt`.
- A stolen/leaked keystore file is **useless without your password**.
- On wallet creation you are shown a **12-word recovery phrase** — that is the
  only backup of the key. Store it offline.
- See [AchSwap SDK → Security & Trust](./sdk.md#security) for the full model.
