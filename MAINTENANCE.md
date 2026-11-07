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
