---
sidebar_position: 4
---

# Remove liquidity

Open the Liquidity page, connect the wallet that owns the position, and choose the V2 or V3 position to remove. Review the amount, expected tokens, minimum amounts, and gas before signing.

For **V2**, approve the LP token if requested, then remove some or all of your pool share. The two token amounts depend on current reserves and may differ from the original deposit.

For **V3**, reduce the NFT position's liquidity, then collect the tokens and accrued fees. Removing all liquidity does not necessarily collect every owed token automatically; check the position's collect step. The NFT can only be burned after its liquidity and owed balances are cleared.

If a transaction reverts, check your balance, allowance, deadline, and minimum amount settings. A large price move can make a stale quote invalid; refresh and review it before retrying.
