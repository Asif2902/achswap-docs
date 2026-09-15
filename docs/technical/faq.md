---
sidebar_position: 4
---

# Frequently asked questions

### Which network does this documentation cover?

**Arc Mainnet**, chain ID **5042**. See [network setup](/getting-started/network-setup).

### Why does USDC appear as both native and ERC-20?

Arc exposes the same balance as an 18-decimal gas currency and a 6-decimal ERC-20 at `0x3600000000000000000000000000000000000000`. Pools and ordinary router calls use the ERC-20 view. See [network setup](/getting-started/network-setup).

### Which DEXs can the aggregator use?

Seven active adapters cover Uniswap V2/V3/V4, AchSwap V2/V3, Synthra V3, and UnitFlow V3. A usable pool and quote are still needed for each trade. See [smart routing](/achswap/smart-routing) and [adapter addresses](/technical/contract-addresses).

### Why did my quote change?

Pool reserves, active V3 liquidity, gas conditions, and available provider routes can change. A quote refresh can find a better path or lose an earlier one. Review the current output and route before signing.

### Why is a quote slow?

Deep route search checks splits and mixed-DEX hops across multiple sources. In Profile, enable Developer mode to turn off Deep route search for faster, narrower quoting. That can produce a worse price.

### Does AchSwap have V4 liquidity or gasless swaps on Arc Mainnet?

AchSwap's own V4 liquidity and gasless contracts are not deployed here. The registered Uniswap V4 aggregator adapter belongs to a different protocol.

### Why is there no bridge route to Arc?

The Bridge uses LI.FI, which must return an executable route for the exact chain and token pair. The frontend's last integration check found no Arc cross-chain route. Check the live widget again; same-chain Arc swaps are separate.

### Why did my transaction revert?

Common causes include price movement beyond the minimum output, expired deadline, inadequate balance or allowance, and insufficient pool liquidity. Refresh the quote and inspect the wallet transaction rather than increasing slippage without checking the price.
