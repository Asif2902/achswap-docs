---
sidebar_position: 5
---

# AchSwap SDK (Local Signer)

`@achswap/mcp-sdk` is the piece that actually **holds your keys and signs
transactions**. It runs entirely on your machine and broadcasts signed transactions
to ARC. By default it runs in `local` mode (builds transactions on your device, no
AchSwap server needed); optionally it can use AchSwap's hosted builder in `remote`
mode. This is what makes AchSwap **self-custodial**: your private key never
leaves your computer.

For the hosted server it connects to, see [MCP Server](./mcp.md).

## Why install the SDK?

- **Your keys never leave your machine.** The server only ever sees unsigned
  transactions.
- **You control signing.** Auto-sign for convenience, or manual approval for
  safety.
- **Local transaction building.** Switch to `local` mode and nothing touches
  AchSwap's servers at all.
- **Encrypted, recoverable wallet.** Keystore is password-encrypted; a 12-word
  recovery phrase backs it up.

## Install

```bash
npm install -g @achswap/mcp-sdk
```

Or run without a global install (opencode/Claude configs use this):

```bash
npx -y @achswap/mcp-sdk serve
```

Verify:

```bash
achswap --version
```

## Quick start

```bash
# 1. Create an encrypted wallet (prints a 12-word recovery phrase — write it down)
achswap init

# 2. Fund the printed address with native USDC on ARC Testnet

# 3. Connect your AI client (writes the MCP config for you, in local mode)
achswap install opencode      # or: claude | codex | cursor

# 4. (Optional) Use your own password instead of the auto-managed one
achswap set autoPassword false
ACHSWAP_PASSWORD='your-long-strong-password' achswap serve
```

The wallet address is always available to the agent via `get_wallet_address`
(no arguments needed — the SDK fills in your address).

## Modes

| Mode | `ACHSWAP_MODE` | Tx building | Backend |
|------|----------------|-------------|---------|
| Local (recommended) | `local` | On your machine | none (works out of the box) |
| Remote (optional) | `remote` | On AchSwap's hosted server | `mcp-api.achswap.app` (must be deployed) |

Local mode is the recommended default and the most private: the SDK builds and
signs entirely on-device with no AchSwap server involved, so it works immediately.
Remote mode is optional and just means "use AchSwap's hosted builder"; signing is
still local. **Remote mode requires the hosted Worker to be deployed — it is not
live yet, so use `local` mode for now.**

## Configuration

All config is env > `config.json` (in `~/.achswap`) > built-in defaults.

| Variable | Default | Meaning |
|----------|---------|---------|
| `ACHSWAP_MODE` | `local` | `remote` or `local` (local works with no backend) |
| `ACHSWAP_AUTO_SIGN` | `true` | SDK signs + broadcasts writes immediately |
| `ACHSWAP_AUTO_PASSWORD` | `true` | Auto-generate + store the signing password |
| `ACHSWAP_PASSWORD` | — | Your own password (preferred for real funds) |
| `ACHSWAP_ALLOW_AI_CONFIRM` | `false` | Let the AI confirm pending txs in chat |
| `ACHSWAP_MCP_SERVER_URL` | `https://mcp-api.achswap.app` | Hosted backend URL |
| `ACHSWAP_KEYSTORE_DIR` / `ACHSWAP_HOME` | `~/.achswap` | Where the keystore lives |

## Wallet, encryption & recovery

- **Storage:** `~/.achswap/keystore.json`, encrypted with
  `ethers.Wallet.encrypt(password)`.
- **Password:** auto-managed in `~/.achswap/.session-pw` by default
  (`autoPassword=true`). For real funds, set `ACHSWAP_PASSWORD` so no plaintext
  password is written to disk.
- **Recovery phrase:** on `achswap init` (and auto-create) a **12-word BIP39
  phrase** is shown **once**. This is the only way to restore the wallet if the
  keystore file is lost. Store it offline.
- **Recover:** `achswap recover -m "word1 word2 … word12"` rebuilds the keystore
  from the phrase.
- **Backup:** `achswap backup <path>` copies the encrypted keystore to a safe
  location (USB / encrypted folder).

> A leaked `keystore.json` is **useless without your password**. A leaked phrase,
> however, lets anyone recreate the wallet — never paste it into chat, logs, or a
> website.

## Signing: auto vs manual

**Auto-sign (default):** writes are signed and broadcast immediately.
**Manual mode** (`achswap set autoSign false`): writes are queued as pending and
must be approved:

- In a terminal: `achswap approve <id>` (recommended — human present)
- In chat: `confirm_transaction` — only if `ACHSWAP_ALLOW_AI_CONFIRM=true` **and**
  `ACHSWAP_PASSWORD` is set (never with the auto-managed session password alone)

Two control tools appear only in manual mode: `confirm_transaction` and
`list_pending`.

## CLI command reference

`achswap` is the command-line control panel for the SDK. It manages the wallet,
configuration, and the local MCP server your AI client connects to. All commands:

| Command | Purpose |
|---------|---------|
| `achswap init [-p PASS]` | Create the encrypted wallet (prints a 12-word recovery phrase once) |
| `achswap recover -m "w1 … w12" [-p PASS]` | Restore the wallet from its recovery phrase |
| `achswap backup [path]` | Copy `keystore.json` to an offline/safe location |
| `achswap address` | Print your wallet address (no unlock needed) |
| `achswap balance` | Print your native USDC balance |
| `achswap status` | Show settings + any running MCP server |
| `achswap running` (`ps`) | List running Achswap MCP processes |
| `achswap config` | Print the resolved config as JSON |
| `achswap set <key> <value>` | Change a persisted setting |
| `achswap install <client>` | Inject the MCP config into an AI client |
| `achswap pending` | List queued (manual-mode) transactions |
| `achswap approve <id>` | Sign + broadcast a pending transaction |
| `achswap serve [opts]` | Start the local MCP server (normally launched by your client) |
| `achswap run --tool <t> --args <json>` | Call one tool and exit (no AI client needed) |
| `achswap` | Interactive mode |
| `achswap --version` / `--help` | Print version / list commands |

> Config set via `achswap set` is written to `~/.achswap/config.json`.
> **Environment variables (`ACHSWAP_*`) always override it**, so they win in case
> of conflict.

### Wallet lifecycle

**`achswap init`** — creates `~/.achswap/keystore.json` (password-encrypted) and
prints the **12-word recovery phrase once**. Refuses to overwrite an existing
keystore.
- `achswap init` → password auto-managed (`~/.achswap/.session-pw`)
- `achswap init -p "your long password"` → use your own password (recommended for
  real funds; nothing plaintext is written to disk)

**`achswap recover`** — rebuilds `keystore.json` from the phrase if the file is
lost. Refuses to overwrite.
- `achswap recover -m "word1 word2 … word12"`

**`achswap backup [path]`** — copies the encrypted keystore offline. With no path
it just prints the location and reminds you to write down the phrase.
- `achswap backup D:\USB\` → copies to that folder as `keystore.json`
- The copy is password-encrypted and useless without your password.

### Quick reads (no unlock)

- **`achswap address`** — prints your address without decrypting the keystore.
- **`achswap balance`** — prints your native USDC balance.

### Status & troubleshooting

- **`achswap status`** — shows mode, `autoSign`/`autoPassword`/`allowAiConfirm`,
  `remoteUrl`, `rpcUrl`, `chainId`, pending count, and any running server. Use it
  to confirm your setup (this is what prints `mode: local, autoSign: true`, etc.).
- **`achswap config`** — prints the fully resolved config (env > file > defaults).
- **`achswap running`** (alias **`ps`**) — lists the Achswap MCP processes your
  client launched. If your AI client's tools don't appear, check here first.
  - `achswap running --kill 2` — kill the process listed as #2
  - `achswap running --kill-all` — kill them all (asks for confirmation unless
    `ACHSWAP_YES=true`)
- **`achswap install <client>`** — writes the one-line MCP config into a client.
  `<client>` is one of `claude | cursor | opencode | codex`. It writes **local
  mode** so it works with no backend. Restart the client afterwards.

### Configuration with `set`

`achswap set <key> <value>` changes a persisted setting. Valid keys:

| Key | Value | Effect |
|-----|-------|--------|
| `autoSign` | `true`/`false` | Sign + broadcast writes immediately (`true`) or queue them (`false`) |
| `autoPassword` | `true`/`false` | Auto-manage the signing password (no plaintext on disk when `false` + `ACHSWAP_PASSWORD`) |
| `allowAiConfirm` | `true`/`false` | Let the AI release pending txs via `confirm_transaction` (requires `ACHSWAP_PASSWORD`) |
| `mode` | `local`/`remote` | Where txs are built (local = on-device; remote = hosted Worker, not deployed yet) |
| `remoteUrl` | URL | Hosted backend URL (remote mode) |
| `rpcUrl` | URL | ARC RPC endpoint |
| `chainId` | number | Chain ID (`5042002` for ARC Testnet) |
| `builderToken` | string | Optional Worker builder token |

Examples:
- `achswap set autoSign false` → enable manual approval (you release txs with `approve`)
- `achswap set allowAiConfirm false` → the AI can only *queue*, never self-approve
- `achswap set mode local` → build txs on-device (recommended; no backend needed)

After any `set`, **restart the MCP server / your AI client** for it to take effect.

### Manual approval workflow

With `autoSign=false`, writes are queued instead of sent:
1. The agent (or `achswap run`) creates a pending transaction.
2. `achswap pending` lists them with an id.
3. `achswap approve <id>` signs + broadcasts it from your terminal.

This is the **human-in-the-loop** path: the AI can prepare trades, but only you
can send them. (The AI can self-release only if `allowAiConfirm=true` *and*
`ACHSWAP_PASSWORD` is set.)

### Running the server: `serve` and `run`

**`achswap serve`** starts the local MCP server. You normally never run this by
hand — your AI client launches it automatically via the `install` config
(`type: local, command: npx -y @achswap/mcp-sdk serve`). Options (advanced):
- `--http` — run an HTTP server instead of stdio
- `--port <port>` — HTTP port (default `8080`)
- `--host <host>` — bind host (default `127.0.0.1`); use `--insecure-bind` to bind
  a LAN address (**dangerous** — anyone on the network could reach your signer)
- `--single` — refuse to start if another instance is already running

**`achswap run --tool <tool> --args <json>`** calls a single MCP tool and prints
the result, then exits. Use it to test the server or query the chain **without an
AI client** — and to convert amounts the right way:
- `achswap run --tool get_decimals --args '{"token_address":"USDC"}'` → `18`
- `achswap run --tool to_wei --args '{"token_address":"USDC","amount":"1.5"}'` →
  `1500000000000000000`
- `achswap run --tool get_native_balance --args '{}'`

## Tools (37) {#tools}

The SDK exposes **37 tools** to the agent. `generate_wallet` is hidden (the wallet
is created locally via `achswap init`). Amounts are always in **base units (wei)**;
use `to_wei` to convert a human amount, and always call `get_decimals` first —
**USDC and wUSDC are 18 decimals; other tokens vary (never assume 6).**

### Reads (no signing)

| Tool | Purpose |
|------|---------|
| `get_wallet_address` | Your wallet address (no args) |
| `get_wallet_info` | Your wallet address / identity (no args) |
| `get_native_balance` | Native USDC balance (18 decimals, gas token) |
| `get_token_balance` | ERC-20 balance (proper decimals) |
| `get_all_token_balances` | All ERC-20 balances |
| `get_allowance` | Router/spender allowance |
| `get_token_info` | Symbol + decimals for any token |
| `get_decimals` | **Decimals for any token** (call before converting) |
| `to_wei` | **Human amount → wei** using real decimals |
| `from_wei` | **wei → human amount** using real decimals |
| `check_rpc_status` | RPC / chain health |
| `get_pool_reserves` | V2 pool reserves |
| `check_pair_exists` | V2 pair lookup |
| `get_add_liquidity_ratio` | Token-B amount for given Token-A |
| `get_swap_quote` | V2 quote (output for input) |
| `get_swap_quote_reverse` | V2 reverse quote (input for output) |
| `quote_adapter` | Best route across V2 + V3 (no tx) |
| `get_liquidity_position` | LP balance + underlying |
| `get_transaction_history` | Recent txs for any wallet |
| `get_token_holders` | Top holders + % of supply |

### Writes (build unsigned tx → sign locally)

| Tool | Purpose |
|------|---------|
| `transfer_token` | ERC-20 transfer |
| `transfer_native` | Native USDC transfer |
| `wrap_native` | Wrap native USDC → wUSDC |
| `unwrap_wusdc` | Unwrap wUSDC → native USDC |
| `approve_token` | Approve spender (or `max`) |
| `swap_via_adapter` | Any→any, auto-routed V2+V3 |
| `swap_native_via_adapter` | Native USDC → ERC-20 |
| `swap_to_native_via_adapter` | ERC-20 → native USDC |
| `add_liquidity` | Add V2 liquidity (token + token) |
| `add_liquidity_eth` | Add V2 liquidity (native + token) |
| `remove_liquidity` | Remove V2 LP (both tokens) |
| `remove_liquidity_eth` | Remove V2 LP (native + token) |
| `remove_liquidity_token` | Remove V2 LP (wUSDC + token) |
| `deploy_token` | Deploy ERC-20 (name, symbol, supply) |
| `burn_token` | Burn tokens from balance |

### SDK control (manual mode)

| Tool | Purpose |
|------|---------|
| `confirm_transaction` | Approve a queued pending tx (if allowed) |
| `list_pending` | List queued txs awaiting approval |

## Example agent workflow (USDC → ACHS)

```
1. get_decimals(token_address="ACHS")          → 18
2. to_wei(token_address="USDC", amount="1.5")  → 1500000000000000000
3. quote_adapter(token_in="USDC", token_out="ACHS", amount_in="1500000000000000000")
      → expected output + route
4. swap_via_adapter(token_in="USDC", token_out="ACHS", amount_in="1500000000000000000")
      → signed + broadcast (auto-sign), returns tx hash
```

## Security & trust {#security}

- **Private key never leaves your machine.** It is created and stored only in
  `~/.achswap/keystore.json`, encrypted with your password. The MCP server
  (hosted or local) only ever receives *unsigned* transactions.
- **Encrypted at rest.** A stolen keystore file cannot be used without the
  password.
- **Recoverable.** The 12-word phrase shown at creation is the backup;
  `achswap recover` restores it.
- **No key in logs or network.** The key is never printed, never returned by a
  tool, and never sent to any server.
- **You choose the trust level.** `remote` mode uses AchSwap's hosted builder;
  `local` mode builds on-device with no AchSwap server involved. Manual mode adds
  a human approval step.

AchSwap cannot move your funds: it has no key, only the ability to prepare
transactions that your local signer approves.
