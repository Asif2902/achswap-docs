# AchSwap Documentation

Documentation for AchSwap on **Arc Mainnet (chain ID 5042)**. The site covers swaps, V2/V3 liquidity, routing, and deployed contract addresses. It does not document unrelated products or undeployed AchSwap V4 and gasless features.

## Run locally

Requires Node.js 20, 22, or 24 and npm 10 or newer.

```bash
npm ci
npm run start
npm run build
```

The Docusaurus build output is `build/`. The site is configured for `https://docs.achswap.app`.

This branch documents the Arc Mainnet frontend and deployments. As checked on 14 September 2026, the public `achswap.app` URL still redirects to a site advertising Arc Testnet. The mainnet docs therefore do not link users to that live app until its host is switched to chain 5042. The repository's `vercel.json` defines only the build and output directories; branch-to-domain deployment is configured outside this repository.

## Address sources

The public address reference is checked against the Arc Mainnet deployment manifest in `Achswap/achswap` and the deployment records in `Achswap/achswap-contracts`. The seven aggregator adapter slots were also checked against the live `AchQuoteEngine.adapterExecutionInfo` and `adapterMetadata` reads on chain 5042 on 14 September 2026.

This `mainnet` branch is separate from the former testnet documentation on `main`.
