---
sidebar_position: 2
---

# Wallet setup

Use an EVM wallet that can connect to the AchSwap app and switch to Arc Mainnet. Confirm the site, chain ID, token, amount, and transaction recipient in the wallet before signing.

A swap may require an ERC-20 approval for the router or spender shown by the wallet. Approvals authorize that spender to use the token within the approved allowance; review the spender and allowance. The aggregator's native-USDC path can use native value without an ERC-20 approval, while LI.FI's Arc USDC swap path uses the 6-decimal ERC-20 allowance.

Arc gas is paid in USDC. Keep enough of the shared USDC balance for transaction fees. See [network setup](/getting-started/network-setup) for the chain details.
