## 2026-11-09: Compact admin export candidate verified and staged

Application candidate `abea4891ad3d6111972ece748b544c1f7568e508` is fast-forwarded to the existing sync branch and mainnet and staged only at `/opt/achswap-pool-sync.releases/abea4891`. Final Node 24 CI passed typecheck, 1015 tests and build. Linux passed 129 unprivileged tests (one Windows-specific test skipped), four root-owned-receipt/cleanup tests under root, and five Python monitor tests. A synthetic private mount-namespace proof verified the real exporter against owner-held WAL files through a kernel read-only mount, refused writes, preserved ownership and verified a complete 1000-event gzip stream without a raw database copy. This synthetic size is not a measured real-dataset size.

The new admin Data export control streams one `.jsonl.gz` logical pool-facts file to the browser, with fresh same-origin TOTP, durable audit authorization, a single-use session-bound grant, one bounded low-priority reader and no inherited secrets. It excludes RPC caches/credentials and raw staging. It requires completed verified data and the root-owned admin-only source receipt/read-only mount documented in application `docs/compact-data-export.md`; it does not activate partner API reads or satisfy full recovery/restore gates.

The active worker remains the manual-export `3bc2964f` isolated release/PID 337467. Its process/log, bounded checkpoint delta and unchanged 16 retained local exports were verified after crossing the historical milestone. Trading, resources, secret file and the R2 hold remain unchanged. No matching app deployment, history activation, R2/laptop cleanup or public docs promotion occurred. For eventual coordinated follow, explicitly supersede the historical run command in `40-manual-exports.conf` while preserving manual-export intent and all other overrides.

Detailed local evidence: `C:\Users\Asif\achswap-contracts\achswap-agg\reports\compact-admin-export-2026-11-09.md`. Continue the existing hourly automation. Post-completion deployment and cleanup remain authorized after all concrete verification gates pass; keep pending MCP work, secrets, datasets, standalone projects and recovery dependencies protected.

## 2026-11-08/09: Manual local exports and compact admin download

The maintainer explicitly requested no automatic local exports, continued indexing, proper matching deployment after historical completion, and cleanup of reviewed obsolete S3/R2 intermediates and laptop worktrees after verification. This supersedes the earlier automatic 90-percent/completion local-copy policy and its anticipated capacity failure. The final offsite recovery, matching build/data, live-sync and manual public-site promotion gates remain; do not infer them from a historical percentage.

Commit `3bc2964fa986a1b5dc0df858d5255635cd717d45` adds run-only `--snapshot-policy manual`. Full Node 24 CI passed typecheck, 1006 tests and build; exact-base Linux passed 94 sync tests and five Python monitor tests. Active isolated release is `/opt/achswap-pool-sync.releases/6d1ceaa8-hypersync-manual-3bc2964f`, worker PID 337467. Persistent `40-manual-exports.conf` records the flag; root-owned monitor `local-export-policy.json` records approval. Process and startup log independently verified manual mode, with unchanged dataset/source/genesis/cutoff/hash/global index, approved resources, protected HyperSync configuration, original trading PIDs and HTTP 200. Evidence: `/root/backups/achswap-sync-migration/manual-policy-resume-verified.json`. All older referenced releases and shared dependencies remain required.

Do not create automatic local copies at either milestone, re-enable the R2 migration-upload timer, forge backup confirmation, delete retained data or enable paid storage. The original production fallback and separate keys remain protected. Useful range checks and full readiness audits from 90 percent remain enabled. An absent automatic copy is now intentional; final offsite recovery/restore still needs a verified plan within the maintainer's budget.

A new authenticated admin Data export control is being prepared on the existing application branch. It downloads one compressed `.jsonl.gz` pool-facts file, streamed through a bounded, low-priority read process without staging another raw VPS database. It excludes RPC caches and credentials and includes counts/completeness/checksum verification. It is not a full application recovery bundle or an automatic handoff proof. Operator enablement requires completed verified data and a kernel read-only source mount with owner-created WAL sidecars. The admin feature is not yet deployed by this maintenance note.

The preliminary laptop inventory identified 12 worktrees across the app/docs/contracts repositories, four with tracked/untracked changes and only four heads proven merged into the application's origin/mainnet. No ignored-file audit or removal plan is approved. Preserve pending MCP work, standalone/main projects, active sync/docs/contracts workspaces, secrets, datasets and evidence. Check current automation/script references and archive/preserve all commits before any later individual non-forced Git worktree removal. The existing exact R2 inventory must be refreshed with final protected receipts before bounded cleanup. No cleanup or public-site promotion occurred.

## Lightweight automatic progress reports — 8 November 2026

The maintainer authorized removing repeated full-dataset readiness audits during incomplete historical backfill while keeping useful safety checks. Below 90% of the pinned historical interval, automatic hourly worker reports now reuse committed coverage without walking all stored pools, tokens or swaps. Reports explicitly say `audit: "progress-only"`, `ready: false` and `pending: null` (not evaluated); they cannot trigger a checkpoint export or claim completion.

Full readiness audits remain mandatory at 90% and above, every cycle near completion, and in explicit `status`, `check` and `prepare` commands. All per-range public canonical anchors, HyperSync pagination/header/log validation, duplicate identities, pool provenance and atomic commits remain unchanged. Incremental enrichment/analytics and native minute health checks continue. No dataset, source, cutoff, schema, keys, resource limits, backup policy or trading code changed.

Commit `3e06113b4f4129be9a201f01cf7b613928b60295` passed full local Node 24 CI: typecheck, 1,004 tests and production build. The exact currently deployed base plus this one-runtime-file patch passed 92 Linux sync tests and five Python monitor tests. The three new regressions reject expensive audit SQL below 90%, require a full audit at 90%, and preserve committed coverage after a transient history failure. The commit was fast-forwarded to the existing sync branch and `mainnet`; no new branch or PR was created.

The new active isolated release is `/opt/achswap-pool-sync.releases/6d1ceaa8-hypersync-audit-3e06113b`, with worker PID 324532. `AUDIT-PATCH.json` records the base HyperSync release, source revision and changed file `pool-data/local/worker.js`. Earlier `PATCH.json` and `HYPERSYNC-PATCH.json` remain as patch-chain evidence; current files must be interpreted through the latest applicable patch rather than expecting older test-file hashes to match later appended regressions. No unified-live activation or production application deployment occurred.

The prior worker stopped gracefully with its lock released. Preserve `/opt/achswap-pool-sync.releases/6d1ceaa8-hypersync-4859ae6`, older referenced releases, shared runtime/ops dependencies and all existing recovery evidence. HyperSync remains free and primary for history with fixed public Arc fallback; its protected worker-only secret file and drop-in are unchanged. Trading PIDs/HTTP health and the approved 200% / 1792M / 2G limits remain unchanged. Laptop indexing remains stopped, and the intentional R2 storage hold keeps migration uploads disabled.

Server evidence is under `/root/backups/achswap-sync-migration/`: `audit-final-old-checkpoint-3e06113b.json`, `audit-resume-verified-3e06113b.json`, and `audit-linux-tests-3e06113b.log`. Artifact SHA-256: `c5429845d59b51d171d7552e83dbce4fdaef148ce41f5122680b4c9bfdf273c6`. Local evidence: `C:\Users\Asif\achswap-mcp-review-2026-11-03-review\sync-lightweight-audit-2026-11-08.md`.

This supersedes earlier descriptions of full automatic hourly readiness scans before 90%. All 90%/completion, offsite restore, matching app/data deployment, manual public docs promotion and deferred cleanup gates remain. Future unified-live staging must use updated `mainnet` containing this change and both RPC/HyperSync patches. Continue the existing hourly health automation without creating another.

## Free HyperSync historical transport — 8 November 2026

The maintainer explicitly authorized free HyperSync as primary historical data transport with Arc public RPC as backup, and required token secrecy. This narrowly supersedes earlier public-only worker notes. Paid/metered billing, other private RPCs, trading changes, unified-live activation and final cutover remain unauthorized by this change.

Application commit `4859ae6294967aef7377c37ade138f176acd9595` was fast-forwarded to the existing sync branch and `mainnet`, without a new branch or PR. Full local Node 24 CI passed typecheck, 1,001 tests and the production build. The exact deployed base plus patch passed 89 Linux sync tests and five Python monitor tests. A real staged sample matched 7,528 logs against public RPC, with 1,250 complete linked headers and matching public header samples.

The active isolated symlink is `/opt/achswap-pool-sync.releases/6d1ceaa8-hypersync-4859ae6`. It preserves the `6d1ceaa8` base and `785c43c6` RPC-body fix. `HYPERSYNC-PATCH.json` binds the three changed runtime files and source revision; the older `PATCH.json` remains. The worker resumed gracefully as PID 322478 with the same dataset, source signature, genesis, pinned cutoff/hash and global log-identity index. The first verified commit advanced 10,000 blocks and added 21,971 events, with the indexed event delta matching the coverage counter. Existing work was retained.

The token is stored only in root-owned mode-600 `/etc/achswap-pool-sync/hypersync.env`, loaded by the worker-specific `30-hypersync.conf` EnvironmentFile drop-in. Do not print, publish or include its contents in receipts, Git, client/admin code, application `.env` or unit inline environment values. `ACHSWAP_SYNC_HYPERSYNC_TOKEN` comes from the Envio dashboard's free HyperSync package; it is already configured, so the maintainer does not need to paste it again. The separate HyperRPC token was not installed. Trading processes were checked not to contain the sync token, and the observed worker log tail contained no token.

Historical logs and headers use the fixed HyperSync endpoint with Bearer authorization and redirects refused. Discovery, metadata, balances/calls/code, genesis/target and fresh canonical boundaries continue through fixed public Arc RPC. Complete pagination, bounded bytes/results, unique identities, every header/log association, a linked parent chain and public start/end/midpoint checks precede the existing atomic commit. Availability, rate/quota limits, rejected credentials, archive lag and interrupted bodies discard partial pages and re-read the whole range publicly. Structured conflicts stop safely; failover never conceals them.

Free usage is locally bounded to 15 requests per 60 seconds, pages spaced by at least four seconds, with lower advertised remaining budgets/reset cooldowns and a per-run request cap. No billing/overage setting was activated. A short fetch benchmark is not a complete migration ETA; use committed progress across full worker cycles.

Trading PIDs and HTTP 200 health were preserved. The approved worker CPU/memory limits remain 200% / 1792M / 2G. R2 migration uploads remain intentionally paused under the 10 GB budget; the backup timer stays disabled, and existing fallback objects/keys remain protected. Laptop indexing remains stopped. The existing hourly health automation now recognizes `envio-hypersync-free` plus `arc-public` usage; no additional automation was created.

Evidence lives under `/root/backups/achswap-sync-migration/`: `hypersync-final-old-checkpoint-4859ae6.json`, `hypersync-readonly-smoke-4859ae6.json`, `hypersync-resume-verified-4859ae6.json` and `hypersync-linux-tests-4859ae6.log`. Local deployment notes are `C:\Users\Asif\achswap-mcp-review-2026-11-03-review\sync-hypersync-deployment-2026-11-08.md`.

Preserve previous releases and their shared runtime/ops dependencies. Eventual coordinated-live handoff must stage updated `mainnet` containing both patches; the older staged `84309f8c` candidate is insufficient. All original offsite restore, matching app/data deployment, manual public-site promotion and deferred cleanup gates remain. No public-site promotion occurred.

# Documentation release and deferred workspace cleanup

Maintainer instructions recorded 2026-11-05. Public documentation lives in `docs/`; this operational note is outside the built site. Do not add credentials, encryption keys, API secrets or environment-file contents here.

## Branch and publication

- Use the existing `C:\Users\Asif\achswap-docs` working directory on **`mainnet-asif`**. Do not create another docs worktree for this update.
- The hosted branch is `origin/mainnet-asif` in `Asif2902/achswap-docs`. The `achswap` remote points to `Achswap/achswap-docs`; inspect its head before assuming the two repositories are synchronized.
- The maintainer promotes the docs build manually, after synchronization and the matching application/data release are confirmed. Never promote automatically after a push, build or percentage milestone.
- Public pages document the release contract and data semantics. Keep temporary percentages, ETAs, server paths and deployment progress out of those pages.
- The existing REST API serves catalogue, filters, compact indexed state, coverage and events. Enrichment observations and reductions live in the separate sync dataset. Sync completion does not automatically add REST fields or endpoints. Validate the delivery format for any partner export, and separately review any API integration before documenting it as an HTTP contract.

## Approved sync worker resources — 6 November 2026

The maintainer authorized raising the isolated worker to a two-core CPU cap and a 2 GiB memory budget. The live change was applied without restarting the worker after checking the six-core host had about 4.7 GiB available RAM and both trading health endpoints returned HTTP 200.

| Setting | Approved value |
| --- | --- |
| `CPUQuota` | `200%`, allowing up to two cores of CPU time |
| `MemoryHigh` | `1792M`, the 1.75 GiB soft limit |
| `MemoryMax` | `2G`, the 2 GiB hard limit |

Persistent systemd resource overrides are under `/etc/systemd/system.control/achswap-pool-sync.service.d/`. Keep them across ordinary deployments. The conservative example service file can still show the original limits; inspect effective systemd/cgroup values before replacing or reverting overrides. Memory is a total cgroup budget, including native SQLite and file cache; it is not a 2 GiB V8 heap allocation. Low CPU/I/O scheduling priority and public-only RPC remain in place. The separate backup service retains its existing resource limits.

Read-only verification:

```bash
sudo systemctl show achswap-pool-sync.service -p MainPID -p CPUQuotaPerSecUSec -p MemoryHigh -p MemoryMax
```

The requested budget is an upper limit, not a guarantee of using two cores or a promised speedup. Continue watching host memory, trading health, I/O waits, actual committed progress and backup results. Do not raise other services' budgets or restart trading as part of routine monitoring. Public-RPC limits and backup timeouts remain separate concerns.

## Migration policy clarified — 6 November 2026

Continue implementation on the existing application sync branch/worktree, without a new branch or PR. Documentation changes stay on this existing `mainnet-asif` branch. Direct updates still require the build, tests and safety review; a push is not a production promotion.

The maintainer originally approved preserving the verified production fallback with migration checkpoints near **90% of the actual historical block interval** and at verified completion. The **7 November storage-budget hold below supersedes automatic R2 uploads**. Local checkpoint exports and hourly health checks continue; do not re-enable the migration-upload timer or restore hourly full exports/uploads.

The deployed isolated worker is based on commit `6d1ceaa87f7862d93a0a4df5203ed170299d9bb3`, with RPC-body recovery patch `785c43c6565da4495b058ed486365523c9c1085e` described below. It batches durable SQLite writes with FULL synchronization retained, reuses statements and gives independent RPC phases separate backoffs. No trading restart or frozen-router overwrite was part of that update. Interpret the current `backup-policy.json`, exact `backup-request.json` and matching `backup-confirmed.json`; a pre-90 offsite age is not a failed checkpoint.

The post-backfill design is **one coordinated indexing system**. The existing router remains the sole live log reader; an isolated data coordinator consumes its durable journal, fills the finite migration gap and maintains metadata, balances, LP principal observations, events and reductions. Separate resource isolation does not mean a second live log poller. The old production data and the completed historical bundle remain inactive recovery points.

The application repository's `docs/indexer-consolidation.md` records the implementation and exact handoff gates. New live collection and API data activation must be verified before cleanup. Historical enrichment remains a separately specified export contract; do not invent REST routes or imply universal USD valuation. No APR or private server RPC is authorized.

## R2 recovery keep list — 9 November 2026

The maintainer requires ongoing R2 recovery for campaign Points (including the XP ledger) and
its volume ledger, with a daily recovery point, plus one verified pre-migration pool-data copy.
The R2 namespaces for Points and volume are `sqlite/campaign/` and `sqlite/volume/`. Preserve their
snapshots and latest pointers. The existing production backups run on change. The matching
release should also refresh each Points recovery point once it is a day old, even if unchanged.

The designated old pool recovery copy is the original ten-database pre-sync archive at
`pre-sync-app/5042/20261105T051251307Z/manifest.json`. Protect the manifest, every encrypted part
it names, and the separately stored recovery key. The archive contains the old router database
and has a recorded successful restore drill. Before any cleanup, recheck the protected recovery
receipts, confirm the original archive and separate key can restore the old pool data, and verify
the final dataset recovery, matching deployment and manually promoted live release. Review exact
obsolete migration keys only. Preserve regular app backups and unclassified objects.

For adding a DEX or factory, use free HyperSync for older history in an isolated workspace and
public Arc RPC within 100 blocks of the public head observed at startup. The existing router's
journal supplies the ongoing feed. Review source provenance before adopting any new dataset.

## R2 storage budget — 7 November 2026

The maintainer set a **10 GB storage budget**. Automatic migration uploads are on hold; the earlier 90%-and-completion upload schedule must not restart without a capacity review. The existing app's normal backups were not changed.

A complete read-only inventory of the configured bucket at **14:50:56 UTC on 7 November 2026** found:

| Objects | Stored bytes |
| --- | ---: |
| Migration sync checkpoints | 3,905,394,870 |
| Protected pre-sync application fallbacks | 189,276,512 |
| Other objects, including normal application backups | 2,062,105,164 |
| **Total: 774 objects** | **6,156,776,546** |

That leaves **3,843,223,454 bytes** below a 10,000,000,000-byte budget for this bucket at that instant. This is not an account-wide measurement, a reservation, or a prediction of the final compressed dataset size. Normal backups can continue growing.

Only `achswap-pool-sync-backup.timer` was disabled and stopped. Its service was inactive; no running backup was interrupted. The indexing worker stayed active with the same PID and both trading health endpoints returned HTTP 200. No R2 objects were uploaded or deleted. The original ten-database fallback manifest and all its referenced parts were verified; its separate recovery key was checked without exposing its contents.

Root-owned `/var/lib/achswap-pool-sync/monitor/r2-storage-hold.json` records the budget and hold. Keep the timer disabled during routine checks and deployments. Local milestone exports, indexing and health monitoring continue. An intentionally unconfirmed milestone must be reported as a storage hold; never manufacture a matching backup confirmation or bypass the final offsite restore/handoff gate.

Before any new migration upload, refresh complete bucket/account usage, measure the compressed immutable checkpoint, reserve headroom for normal app backups and temporary overlap, and verify it fits the agreed budget. The present uploader creates a full gzip copy of each exported database; it does not implement incremental backups or a 10 GB enforcement guard. Do not enable paid storage implicitly or delete the original fallback to make room.

If the final backup cannot fit, agree a separate offsite destination or revised budget and review/test the required recovery integration before cutover. A second file on the same VPS is not offsite recovery. Cleanup remains deferred until all existing release gates pass.

## RPC body recovery — 7 November 2026 (Dhaka)

The worker stopped after an invalid/interrupted public-RPC JSON body was treated as permanent exit 78. The reproduced fix changes only body-error classification to retryable RPC_UNAVAILABLE, reusing bounded retries and phase backoff. Partial bodies are never cached. Byte limits, structured responses, canonicality, provenance and non-read-method prohibitions remain strict.

The fix is pushed on the existing app sync branch and mainnet as 785c43c6565da4495b058ed486365523c9c1085e, without a new branch or PR. Full CI passed (968 tests/typecheck/build). The exact deployed base plus this patch passed 57 Linux sync tests and five Python monitor tests. Packaged CRLF differences were verified against the canonical source before patching.

The active isolated release is /opt/achswap-pool-sync.releases/6d1ceaa8-rpc-785c43c6. Its PATCH.json identifies the base and one changed runtime module; this does not activate the staged unified-live pipeline. The saved checkpoint had 2,214,684 events. After restart, three more ranges committed and 2,246,520 rows matched the coverage counter in one snapshot, with the same dataset, target and global log-identity index. Trading PIDs/health, public-only RPC, resources and the verified ten-database fallback/key were preserved.

Use mainnet containing this fix for eventual live release. Older staged candidate 84309f8c lacks it and needs an updated verified stage. Keep referenced runtimes and all release gates. SQLite probes should run as achswap-pool-sync to avoid root-owned WAL sidecars; the existing throughput helper now does so. Use bounded checkpoint diagnostics for routine RPC failures, not full integrity scans. No public docs content or site promotion changed in this maintenance update.

## Current checkpoint, not a completion claim

At approximately **20:02 Dhaka time on 5 November 2026**, the isolated server worker covered about **37.14%** of its pinned historical block interval. Its cutoff is block **29,619,812**. The latest observed metadata count was **126,680 observations**; that is not a count of universally readable token metadata or priced tokens. Trading health was HTTP 200, no worker alerts were present, and a new Cloudflare backup had completed successfully. Read the live monitor for current values rather than using this dated note as a dashboard.

Laptop indexing must remain stopped. The server worker uses public RPC only. No private/paid fallback, app restart or historical-router overwrite is authorized by a routine health check.

Read-only monitoring on the server:

```bash
sudo systemctl status achswap-pool-sync.service achswap-pool-sync-backup.timer achswap-pool-sync-health.timer --no-pager
sudo tail -n 10 /var/lib/achswap-pool-sync/worker.jsonl
sudo cat /var/lib/achswap-pool-sync/monitor/health.json
sudo journalctl -u achswap-pool-sync-backup.service -n 10 --no-pager
```

Older health reports could flag `sync_backup_failed_or_stale` while a backup oneshot was `activating`, because systemd clears its last-exit timestamp during a new run. The current milestone-aware monitor uses the original fallback proof and matching checkpoint digests. Inspect the actual unit result and verified receipt before reporting a failure. Never infer backup success merely from a running process.

## Release gates

1. Confirm the fixed-cutoff worker finishes without unresolved conflicts, provenance mismatches or pending coverage/reduction jobs. The readiness gate checks every configured pool and eligible observation attempt; readable values and unknown values still need to be reported separately.
2. Run the worker's documented `check` and `prepare` workflow from its isolated code directory, verify canonical anchors, and retain the resulting consistent manifest/checksummed bundle. These commands verify/export data; they do not publish it.
3. Verify a fresh Cloudflare recovery point and an isolated restore drill. Preserve existing production backups and the separately stored encryption keys.
4. Review how historical events and enrichment will be served alongside newly followed data. Reconcile by natural event identity, compare overlaps and preserve per-pool coverage. Never copy an older catalogue over the live router, silently ignore a conflicting row or restart from an empty dataset to hide a mismatch. Confirm tail collection continues after the finite backfill exits.
5. Validate the matching application/API build and partner reads: authentication, filters, cursor traversal, per-pool coverage, raw units, nulls, canonical event identities and the agreed enriched delivery. A completed index does not prove API integration or production activation.
6. Build these docs on Node 24, inspect the generated pool-data pages and links, and retain the tested commit/build identity. The maintainer then chooses when to promote the build.
7. Verify the promoted live site and relevant API/data version, trading health, ongoing synchronization and backup freshness. Only after these gates pass does the deferred cleanup below become eligible.

## Why the extra folders exist

Git worktrees provided separate checkouts for independent PR reviews, fixes and documentation branches. They share repository history but have separate files and branch state. Several were retained for evidence and recovery. Standalone projects, credentials and datasets must not be confused with those temporary checkouts.

The maintainer asked to keep every folder in place **until synchronization, deployment/build and the promoted live release are verified**. Do not clean up now.

### Cleanup inventory

Inspect both repositories with `git worktree list --porcelain`. The known temporary review candidates are:

| Repository | Candidate folders under `C:\Users\Asif` |
| --- | --- |
| Docs | `achswap-docs-hosted-2026-11-04`, `achswap-pool-data-fee-docs-2026-11-04` |
| App | `achswap-adapter-audit-2026-11-04`, `achswap-mcp-review-2026-11-03`, `achswap-pool-data-api-2026-11-03`, `achswap-pool-data-fees-2026-11-04`, `achswap-local-sync-2026-11-04` |

This is an inspection list, not a deletion list. The MCP review can contain independent pending work. The sync worktree remains the source used by maintenance tooling. Check each branch, all files and active references before marking it obsolete.

Keep these separate from temporary review checkouts:

- `achswap-docs`, `achswap-contracts`, `achswapv3` and `achswapv3-sponsored`: existing project checkouts; the sponsored directory also holds the private server connection file.
- Other standalone projects such as the pool explorer, API website, homepage and analytics projects. Their names alone do not make them disposable.
- `C:\Users\Asif\.achswap\pool-sync` and `C:\Users\Asif\.achswap\recovery`: resumable data, manifests and separately stored recovery keys.
- `achswap-mcp-review-2026-11-03-review`: SSH/inspection helpers and review evidence used by ongoing health checks. Relocate and validate those references before considering any removal.
- `/var/lib/achswap-pool-sync`, the active server runtime, backup credentials and Cloudflare recovery points.

### Safe cleanup procedure after the release

1. Reconfirm the release gates and a current tested recovery point. Inventory exact resolved paths, branches, open PRs, tracked changes and untracked/ignored files. Never print secrets while doing so.
2. Preserve unmerged commits, unresolved review work, evidence, configuration and datasets. A clean Git status does not establish that ignored environment files or databases are disposable.
3. Check server units, symlinks, automation paths and scripts for references to any candidate. The active sync release currently shares `runtime`, `runtime-deps` and `ops` with an older release; retain that older release until those dependencies are deliberately relocated and tested. An older directory name is not proof it is unused.
4. Use Git's worktree removal for each individually verified, obsolete checkout. Do not use `--force` or recursive shell deletion. Keep branch history until it is merged or explicitly archived. Inspect `git worktree prune --dry-run` before pruning stale registrations.
5. The maintainer additionally authorized R2 migration cleanup after all release gates pass. First generate a complete read-only inventory with the application's `scripts/pool-sync-cleanup-inventory.mjs`. Restrict review to `pool-sync/5042/` and `pre-sync-app/5042/`; the inventory protects every pre-sync application object, including the verified ten-database fallback manifest and all its encrypted parts. Supply the final and 90% checkpoint manifest keys/hashes as protected receipts. Unknown objects stay protected. The tool has no deletion mode; age eligibility alone is not permission to remove anything. Review exact immutable keys, complete pagination, frozen offsite writers, bounded per-run counts/bytes, live release evidence and a final restore proof before performing any later removal. Preserve normal production backups, final data, required rollback checkpoints and every separately stored recovery key. Never wipe the bucket or erase active/local datasets as folder tidying.
6. Leave one clearly documented normal working directory per repository, update maintenance references to those paths, and verify the next build/deployment workflow. Preserve the maintainer's manual promotion step and ongoing server/backup health checks.

No code pull, app build, restart, promotion, data activation or cleanup is performed by these notes.
