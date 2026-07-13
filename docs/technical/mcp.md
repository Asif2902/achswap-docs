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
(`remote` mode, optional) or entirely on your device (`local` mode, the
recommended default — works with no backend).

## Hosted MCP server

- **Endpoint:** `https://mcp-api.achswap.app`
- **Transport:** MCP over HTTPS (Streamable HTTP / `tools/call`)
- **Keyless:** builds unsigned transactions only; never sees your private key
- **Network:** ARC Testnet (`chainId 5042002`)

Because signing is local, the hosted server is safe to point your agent at: it can
read your public balances and prepare transactions, but it cannot move funds
without your local signer.

### Connect your AI client

Your AI client does **not** connect to AchSwap's hosted server directly. It
connects to the **local SDK running on your machine**, because only the local SDK
can sign transactions — the hosted server is keyless and cannot sign. The SDK then
talks to the hosted server *internally* to build transactions (in `remote` mode),
or builds them entirely on-device (in `local` mode).

So the MCP endpoint your client points at is **always the local SDK**. Use a
`local` MCP config that launches the SDK:

**OpenCode** (`~/.config/opencode/opencode.jsonc`):

```json
{
  "mcp": {
    "achswap": {
      "type": "local",
      "command": ["npx", "-y", "@achswap/mcp-sdk", "serve"],
      "environment": {
        "ACHSWAP_MODE": "local",
        "ACHSWAP_AUTO_SIGN": "true",
        "ACHSWAP_AUTO_PASSWORD": "true"
      },
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
      "command": "npx",
      "args": ["-y", "@achswap/mcp-sdk", "serve"],
      "env": {
        "ACHSWAP_MODE": "local",
        "ACHSWAP_AUTO_SIGN": "true",
        "ACHSWAP_AUTO_PASSWORD": "true"
      }
    }
  }
}
```

> The fastest path is `achswap install <client>` (opencode | claude | codex |
> cursor) — it writes the config above for you, in `local` mode, so it works with
> no backend. Restart your client afterwards and check the MCP tool list.

### Remote mode (optional — needs the hosted Worker)

`remote` mode only changes *where transactions are built*: instead of building on
your device, the SDK asks AchSwap's hosted server (`mcp-api.achswap.app`) to build
the unsigned transaction. **Signing is still local in both modes** — your key never
leaves the SDK. Remote mode requires the hosted Worker to be deployed; it is not
live yet, so use `local` mode until then. When it is available, set
`ACHSWAP_MODE=remote` (and optionally `ACHSWAP_MCP_SERVER_URL`).

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
