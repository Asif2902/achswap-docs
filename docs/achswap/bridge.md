---
sidebar_position: 6
---

# Bridge

The Bridge page embeds a **LI.FI** cross-chain widget. Its available chains, tokens, providers, route steps, arrival times, and fees come from live LI.FI quotes; they are not the same as AchSwap's on-chain swap aggregator.

As last checked in the frontend integration, LI.FI same-chain swaps on Arc were available, but **cross-chain transfers to or from Arc returned no executable route**. Bridge availability can change. Select the source and destination chains in the widget and proceed only if it returns an executable quote for that exact transfer. Do not assume an Arc route exists because Arc appears in a chain selector.

Review the provider, token addresses, destination, total fees, and minimum received in the widget and wallet before signing. Cross-chain execution may require approvals and multiple transactions. See [fees](/technical/fee-structure).
