# Documentation release and deferred workspace cleanup

Maintainer instructions recorded 2026-11-05. Public documentation lives in `docs/`; this operational note is outside the built site. Do not add credentials, encryption keys, API secrets or environment-file contents here.

## Branch and publication

- Use the existing `C:\Users\Asif\achswap-docs` working directory on **`mainnet-asif`**. Do not create another docs worktree for this update.
- The hosted branch is `origin/mainnet-asif` in `Asif2902/achswap-docs`. The `achswap` remote points to `Achswap/achswap-docs`; inspect its head before assuming the two repositories are synchronized.
- The maintainer promotes the docs build manually, after synchronization and the matching application/data release are confirmed. Never promote automatically after a push, build or percentage milestone.
- Public pages document the release contract and data semantics. Keep temporary percentages, ETAs, server paths and deployment progress out of those pages.
- The existing REST API serves catalogue, filters, compact indexed state, coverage and events. Enrichment observations and reductions live in the separate sync dataset. Sync completion does not automatically add REST fields or endpoints. Validate the delivery format for any partner export, and separately review any API integration before documenting it as an HTTP contract.

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

The health helper can flag `sync_backup_failed_or_stale` while a backup oneshot is `activating`: systemd clears its last-exit timestamp during a new run. Verify the prior successful receipt's `verifiedAt` in the workspace's `offsite/` directory and the actual backup result before treating that warning as a failed backup. Never infer backup success merely from a running process.

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
5. Do not prune Cloudflare backups, erase local recovery bundles or delete active sync data as part of folder tidying. Any future data-retention change requires a separate bounded policy.
6. Leave one clearly documented normal working directory per repository, update maintenance references to those paths, and verify the next build/deployment workflow. Preserve the maintainer's manual promotion step and ongoing server/backup health checks.

No code pull, app build, restart, promotion, data activation or cleanup is performed by these notes.
