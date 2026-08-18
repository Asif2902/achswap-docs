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
- **You approve every trade.** Writes queue for your approval by default; the AI
  cannot broadcast on its own.
- **Local transaction building.** Switch to `local` mode and nothing touches
  AchSwap's servers at all.
- **Vault-sealed wallet.** The keystore password is a 256-bit random value sealed
  by your OS credential store, so copying the Achswap folder does not reveal your
  wallet. A 12-word phrase and a portable recovery bundle back it up.

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
# 1. Create the wallet — offers a passphrase, then prints your 12-word phrase
achswap init

# 2. (only if you skipped it above) add the passphrase later
achswap passphrase set

# 3. Save a portable backup somewhere offline (USB, encrypted folder)
achswap export-recovery /path/to/usb/achswap-recovery.json

# 4. Fund the printed address with native USDC on ARC Testnet

# 5. Connect your AI client (writes the MCP config for you, in local mode)
achswap install opencode      # or: claude | codex | cursor

# 6. Check how you are protected
achswap security
```

Writes queue for approval by default. Release them with `achswap approve <id>`.

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
| `ACHSWAP_AUTO_SIGN` | `false` | Sign + broadcast writes with no human step |
| `ACHSWAP_DEVICE_UNLOCK` | `true` | Allow unlocking a `device` vault without a prompt |
| `ACHSWAP_AUTO_CREATE_WALLET` | `false` | Allow a missing wallet to be created silently on first use |
| `ACHSWAP_PASSPHRASE` | — | Your vault passphrase (only if you set one) |
| `ACHSWAP_ALLOW_AI_CONFIRM` | `false` | Let the AI confirm pending txs in chat (also needs `ACHSWAP_PASSPHRASE`) |
| `ACHSWAP_MCP_SERVER_URL` | `https://mcp-api.achswap.app` | Hosted backend URL |
| `ACHSWAP_KEYSTORE_DIR` / `ACHSWAP_HOME` | `~/.achswap` | Where the keystore lives |

> `ACHSWAP_PASSWORD` still works as an alias for `ACHSWAP_PASSPHRASE`.
> **Never put either into an AI client config file** — those files are plaintext on
> disk. `achswap install` deliberately writes only mode and flags.

## Wallet, encryption & recovery

### How your key is protected

The keystore password is **not** something you choose and **not** stored in the
Achswap folder. It is a 256-bit random value that only exists in memory while a
transaction is being signed.

```
~/.achswap/keystore.json   V3 keystore  ← scrypt(N=2^18) + AES-128-CTR
                           encrypted with a 256-bit random password
~/.achswap/vault.json      AES-256-GCM envelope holding that password

  key = HKDF-SHA512( device secret ‖ scrypt(your passphrase, N=2^18) )

  device secret   32 random bytes in your OS credential store — never on disk
  passphrase      optional, in your head — never on disk
```

The device secret lives in **Windows Credential Manager**, **macOS Keychain**, or
**Secret Service (libsecret)** depending on your platform. On Windows the vault is
additionally wrapped with **DPAPI**, binding it to your Windows logon session.

This is the point: **copying the whole `~/.achswap` folder is not enough to steal
the wallet.** There is no low-entropy password in it to guess offline — an attacker
also needs your OS user session, and your passphrase if you set one.

### Unlock modes

| Mode | What it takes to sign | How to get it |
|------|----------------------|---------------|
| `device` | Your OS credential store | Default after `achswap init` |
| `device + passphrase` | OS credential store **and** your passphrase | `achswap passphrase set` (recommended) |
| `passphrase` | Your passphrase only | Automatic on systems with no credential store |

Run **`achswap security`** to see which mode you are in and get warned about
anything weak.

**Device mode protects your files, not your running session.** The credential
store hands the device secret to any process running as your OS user — that is
how the SDK itself unlocks.

To blunt the common version of that attack, a device-only vault **will not unlock
in a non-interactive process**. An agent shelling out to `node`, an injected
prompt, or a remote session gets an error telling it to ask you. Revealing the
recovery phrase is stricter still: it always needs an interactive terminal, with
no scriptable flag.

This raises the bar but is not a wall — a determined attacker can allocate a
terminal. A passphrase is the one factor your machine does not hold, which is why
`achswap init` offers it up front and `achswap security` warns until you set one.
Set `ACHSWAP_ALLOW_HEADLESS_UNLOCK=true` only for automation you trust.

If no credential store is available *and* you give no passphrase, the SDK
**refuses to create a wallet** rather than writing a generated password to disk.

### Three ways to recover

Security must not lock *you* out. Any one of these restores your wallet:

**1. Portable recovery bundle (best for disaster recovery)**

```bash
achswap export-recovery /path/to/usb/achswap-recovery.json
# on any other machine:
achswap import-recovery /path/to/usb/achswap-recovery.json
```

Sealed with a passphrase you choose, and deliberately **not** tied to any device,
so it works on a brand-new computer. Keep it offline — anyone with the file *and*
its passphrase controls the wallet.

**2. 12-word recovery phrase**

```bash
achswap recover -m "word1 word2 … word12"
```

Shown once at `achswap init`. Store it offline. Never paste it into chat, logs, or
a website.

**3. The vault on your own machine** — as long as your OS credential store and
(if set) your passphrase are intact.

> **`achswap backup` is not disaster recovery.** It copies `keystore.json` +
> `vault.json`, but that copy only opens on the same machine and OS account,
> because the device secret stays in the credential store and is never written to
> disk. For a backup that survives losing the machine, use `export-recovery` or
> the 12-word phrase.

### Upgrading from an older SDK

Versions up to **1.0.7** stored an auto-generated keystore password in plaintext at
`~/.achswap/.session-pw`, right next to `keystore.json` — so anyone who copied the
folder got both halves.

```bash
achswap migrate
```

This runs automatically when the SDK starts, and also on demand. It decrypts your
key with the old password, **re-encrypts it under a fresh 256-bit password**, seals
that in the vault, and overwrites and deletes `.session-pw`. Your address and
private key do not change.

The old password must be treated as compromised, which is why the keystore is
re-encrypted rather than simply re-sealed. After migrating, export a fresh recovery
bundle.

## Signing: manual by default

**Manual mode is the default (`autoSign=false`).** Writes are queued as pending and
must be approved:

- In a terminal: `achswap approve <id>` — recommended, a human is present.
  It prints the destination, amount, chain, calldata selector, expected effects
  and the arguments the tool was called with, then asks you to confirm.
- In chat: `confirm_transaction` — only if `ACHSWAP_ALLOW_AI_CONFIRM=true` **and**
  `ACHSWAP_PASSPHRASE` is set for that process

Holding the device secret is never treated as authorization for the AI. Otherwise
any process running on an unlocked machine could spend your funds.

Two control tools appear in manual mode: `confirm_transaction` and `list_pending`.

To let the agent sign without a terminal step (convenience over safety):

```bash
achswap set autoSign true
```

## CLI command reference

`achswap` is the command-line control panel for the SDK. It manages the wallet,
configuration, and the local MCP server your AI client connects to. All commands:

| Command | Purpose |
|---------|---------|
| `achswap init [-p PASS]` | Create the wallet (prints a 12-word recovery phrase once) |
| `achswap security` | Show how the wallet is protected; flag anything weak |
| `achswap show-phrase` | Re-display the 12-word recovery phrase |
| `achswap pending --clear` | Discard the queue (after an integrity warning) |
| `achswap delete-wallet` | Permanently delete keystore, vault, and device secret |
| `achswap passphrase set\|remove\|status` | Manage the passphrase (second unlock factor) |
| `achswap export-recovery <path>` | Write a portable, passphrase-sealed backup |
| `achswap import-recovery <path>` | Restore from that backup on any machine |
| `achswap migrate` | Upgrade a pre-1.1 wallet off the plaintext `.session-pw` |
| `achswap recover -m "w1 … w12" [-p PASS]` | Restore the wallet from its recovery phrase |
| `achswap backup [dir]` | Copy keystore + vault locally (same machine only) |
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

**`achswap init`** — creates `~/.achswap/keystore.json` plus `~/.achswap/vault.json`
and prints the **12-word recovery phrase**. Refuses to overwrite an existing
keystore. In a terminal it offers a passphrase first, explaining the trade-off.
- `achswap init` → offers a passphrase; press Enter to skip (device-only)
- `achswap init -p "your long passphrase"` → set it non-interactively
- `achswap init --skip-passphrase` → device-only, no prompt (scripts)

**A wallet is never created behind your back.** If an AI client connects before
you have run `init`, the SDK refuses and tells the agent to ask you to run it.
That way you always see the recovery phrase and choose a passphrase. To opt into
the old silent behaviour: `achswap set autoCreateWallet true`.

**`achswap show-phrase`** — re-displays the 12-word phrase (it lives encrypted
inside `keystore.json`). Requires an interactive terminal and typing `SHOW`; it
has no scriptable flag on purpose. Use this if the phrase scrolled past you at
creation.

**`achswap delete-wallet`** — permanently removes `keystore.json`, `vault.json`,
and the device secret from the credential store. Requires typing `DELETE`. After
this the wallet only comes back from a recovery bundle or the 12-word phrase.

**`achswap passphrase set|remove|status`** — adds, changes, or removes the
passphrase by re-sealing the vault. Your address and key never change. Re-sealing
also **rotates the device secret**, so older copies of `vault.json` stop working.

**`achswap export-recovery <path>`** — writes a self-contained, passphrase-sealed
bundle that restores on any machine. This is your real disaster backup.

**`achswap import-recovery <path>`** — rebuilds `keystore.json` and a fresh local
vault from that bundle. Refuses to overwrite an existing keystore.

**`achswap recover`** — rebuilds from the 12-word phrase if everything else is lost.
- `achswap recover -m "word1 word2 … word12"`

**`achswap migrate`** — one-time upgrade for wallets created before v1.1. See
[Upgrading from an older SDK](#upgrading-from-an-older-sdk).

**`achswap backup [dir]`** — copies `keystore.json` + `vault.json` to another
folder. **Only opens on the same machine and OS account** — use `export-recovery`
for a backup that survives losing the device.

### Quick reads (no unlock)

- **`achswap address`** — prints your address without decrypting the keystore.
- **`achswap balance`** — prints your native USDC balance.

### Status & troubleshooting

- **`achswap security`** — shows your unlock factors, KDF parameters, credential
  store, and warns about single-factor setups, `autoSign`, or a leftover
  `.session-pw`. Run this first if you are unsure how protected you are.
- **`achswap status`** — shows mode, `autoSign`/unlock mode/`allowAiConfirm`,
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
| `autoSign` | `true`/`false` | Sign + broadcast immediately (`true`) or queue for approval (`false`, default) |
| `deviceUnlock` | `true`/`false` | Allow a `device` vault to unlock without prompting (default `true`) |
| `autoCreateWallet` | `true`/`false` | Allow silent wallet creation on first use (default `false`) |
| `allowAiConfirm` | `true`/`false` | Let the AI release pending txs via `confirm_transaction` (also requires `ACHSWAP_PASSPHRASE`) |
| `mode` | `local`/`remote` | Where txs are built (local = on-device; remote = hosted Worker, not deployed yet) |
| `remoteUrl` | URL | Hosted backend URL (remote mode) |
| `rpcUrl` | URL | ARC RPC endpoint |
| `chainId` | number | Chain ID (`5042002` for ARC Testnet) |
| `builderToken` | string | Optional Worker builder token |

Examples:
- `achswap set autoSign true` → let the agent broadcast without asking you (convenience over safety)
- `achswap set allowAiConfirm false` → the AI can only *queue*, never self-approve
- `achswap set mode local` → build txs on-device (recommended; no backend needed)

After any `set`, **restart the MCP server / your AI client** for it to take effect.

### Manual approval workflow

With `autoSign=false` (the default), writes are queued instead of sent:
1. The agent (or `achswap run`) creates a pending transaction.
2. `achswap pending` lists them with an id.
3. `achswap approve <id>` signs + broadcasts it from your terminal.

This is the **human-in-the-loop** path and the default: the AI can prepare trades,
but only you can send them. (The AI can self-release only if `allowAiConfirm=true`
*and* `ACHSWAP_PASSPHRASE` is set for its process.)

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
  `~/.achswap/keystore.json`. The MCP server (hosted or local) only ever receives
  *unsigned* transactions.
- **The keystore password is 256-bit random**, not something you or an attacker can
  guess, and it is never written to the Achswap folder.
- **It is sealed in a vault** whose key comes from your OS credential store and/or
  your passphrase — never from anything on disk. On Windows the vault is also
  DPAPI-bound to your logon session.
- **A stolen `~/.achswap` folder is not enough.** An attacker also needs your OS
  user session, and your passphrase if you set one. There is no low-entropy secret
  in the folder to attack offline.
- **Keys are never cached.** Each signature unlocks, signs, and releases; a
  long-running MCP process holds no decrypted key between transactions.
- **Manual approval by default.** `autoSign=false`, so a compromised AI or MCP
  process cannot move funds on its own.
- **AI self-approval is doubly gated** — it needs `ACHSWAP_ALLOW_AI_CONFIRM=true`
  *and* an explicit passphrase. Device unlock alone is never authorization.
- **Transactions are validated before signing.** The SDK checks `chainId`, that
  the destination matches the tool, and that the amount moved equals the amount
  requested — so a call for 10 cannot come back as a transaction for 10,000.
- **The pending queue is tamper-evident.** It carries an HMAC keyed from the
  device secret, and approval refuses to sign a queue edited outside Achswap.
- **Approval shows you the transaction** — destination, amount, chain, calldata
  and expected effects — before asking you to confirm.
- **No key in logs, errors, or tool output.** Errors returned over MCP are scrubbed
  of long hex values, anything labelled password/passphrase/secret/mnemonic, and
  BIP39-looking word runs.
- **Recoverable by you.** Portable recovery bundle, 12-word phrase, or the local
  vault.

### What this does *not* protect against

- **Live code execution as your logged-in user.** Malware — or an AI coding agent
  with shell access — can ask the OS credential store for the device secret,
  exactly as the SDK does, then sign or run `achswap show-phrase`. Device mode
  protects data at rest, not a live session compromise.
  **`achswap passphrase set` is the fix**: with a passphrase, code running as you
  still cannot sign or reveal the phrase, because that factor is only in your head.

  Note the boundary this does *not* cross: an agent restricted to the achswap
  **MCP tools** cannot extract key material at all. No tool returns a private key
  or mnemonic, `generate_wallet` is removed from the catalog, and errors are
  scrubbed. The exposure comes from shell access, not from the tool surface —
  prompt injection alone does not reach the key.
- **A weak recovery-bundle passphrase.** The bundle is deliberately not
  device-bound, so its passphrase is all that protects it. Make it long and keep
  the file offline.
- **A passphrase in the environment.** `ACHSWAP_PASSPHRASE` is readable by anything
  that can inspect the process environment. Prefer a short-lived shell, and never
  put it in an AI client config file.
- **A leaked 12-word phrase.** It reconstructs the wallet with no other factor.
  Treat it like the key itself.

Run `achswap security` to audit your own install.

AchSwap cannot move your funds: it has no key, only the ability to prepare
transactions that your local signer approves.
