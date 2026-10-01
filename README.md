# AchSwap Documentation

Documentation for AchSwap on **Arc Mainnet (chain ID 5042)**. The site covers swaps, gasless swaps, V2/V3 liquidity, routing, on-chain swap execution, and deployed contract addresses. It does not document unrelated products or the undeployed AchSwap V4 contracts.

## Run locally

Requires Node.js 20, 22, or 24 and npm 10 or newer.

```bash
npm ci
npm run start
npm run build
```

The Docusaurus build output is `build/`. The site is configured for `https://docs.achswap.app`. Cloudflare Workers uses `wrangler.jsonc` to upload that directory as static assets; Vercel uses `vercel.json`. Cloudflare's preview build runs `wrangler versions upload`, which creates a preview version rather than promoting it to production.

This branch documents the Arc Mainnet frontend and deployments. As checked on 14 September 2026, the public `achswap.app` URL still redirects to a site advertising Arc Testnet. The mainnet docs therefore do not link users to that live app until its host is switched to chain 5042. Branch-to-domain deployment is configured outside this repository.

## Address sources

The address reference follows the contracts' deployment records and the app's deployment manifest. Updated 1 October 2026 for the 2026-10 swap-execution release:

- AchRouteExecutor `0x1B844738455b8060D12839331b35893526E9d314` with adapters 1–5;
- a 0.25% fee paid directly to the treasury Safe, with no fee vault;
- the gasless executor's new target.

Every live contract is source-verified on arc.etherscan.io. Retired addresses are kept in a separate section only to decode older transactions.

Public pages describe contract behaviour (the verified code) and the guarantees users get. They do not describe the router's internal systems or infrastructure.

This `mainnet` branch is separate from the former testnet documentation on `main`.
