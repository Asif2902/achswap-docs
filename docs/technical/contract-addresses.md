---
sidebar_position: 2
---

# Arc Mainnet contract addresses

**Network:** Arc Mainnet, chain ID **5042**. Addresses below are from the [frontend's public deployment manifest](https://github.com/Achswap/achswap/blob/mainnet-test/shared/deployment-config.js) and the [contracts deployment records](https://github.com/Asif2902/achswap-contracts/blob/codex/aggregator-v3/achswap-agg/deployments/arcMainnet-aggregator-v3.json). Updated **15 September 2026** for the V3 adapter replacements and exact-output quoter. The replacement adapters' bytecode, registry state, quotes and native-input execution simulations were checked on chain 5042. Other addresses retain the 14 September baseline. The native sentinel and fee recipients are not contract deployments. Check live contract state again before building transactions, especially fees and registry membership.

## Tokens and native handling

| Asset or helper | Address | Notes |
| --- | --- | --- |
| USDC ERC-20 predeploy | `0x3600000000000000000000000000000000000000` | 6 decimals; pool and router token |
| EURC | `0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1` | ERC-20 |
| Native-USDC sentinel | `0x0000000000000000000000000000000000000000` | 18-decimal transaction units; same balance as ERC-20 USDC |
| UnsupportedProtocol | `0x8bcEaA40B9AcdfAedF85AdF4FF01F5Ad6517937f` | WETH placeholder; ETH-path router methods are unsupported |

## AchSwap V2 and V3

| Contract | Address |
| --- | --- |
| V2 Factory | `0xb0C2B0acb9c13079dDd871eDaF43Aabf6e88C530` |
| V2 Router | `0x52FE40c00530db2e43d01652f903870571A14AFD` |
| V3 Factory | `0xaE54BF4C8078BaAAf7e17f8e01659Ea470a989FC` |
| V3 SwapRouter **(legacy, deadline required)** | `0xEA0129203FBB99ebEea3f78B2d05b924f17FB556` |
| V3 NonfungiblePositionManager | `0x96366824D9240209cD236F5396054255ad1f5AA2` |
| V3 Quoter02 | `0x659Da32F3F10566bDB6B55Ad84c182f1D00Ba058` |
| V3 Migrator | `0xE6395F899564D7D39Fe81D1EDa8b1680E5E396fa` |
| V3 TickLens | `0x0e981987Aca4ed06A256F1fC7A2c98DDAcc52E69` |

## AchSwap aggregator and periphery

| Contract | Address |
| --- | --- |
| AchFeeController | `0x98a90461f0D4E442914A0848faC7c1fd1630D189` |
| AchVault | `0x4b31cf5a5Ce8cC3C7fB3DcCA244eeE5F6Bd72CAa` |
| AchQuoteEngine | `0x07A2583092711D15dd9C854C7ec21f8fD5819285` |
| AchExactOutputQuoter | `0x099163157daFdC4a7819F04442A5Ae686801214d` |
| AchExecutionRouter | `0xb1C3B6B8B371aFd9c938AC064f7aeD33d6BC26cA` |
| Arc-native USDC adapter | `0x097d6546db9fba2F908A88eE30FC870eb55fde90` |
| AchMultiHopRouter | `0xbc66DbbD4f0753850f5401C3ca12B7AE021A17E6` |
| Current aggregator fee recipient | `0x5820cdcEE868F395eB26fA9b00123f4b7530DC11` |

The fee recipient is a controller setting, not a fixed contract dependency. Its value and the base 25 bps fee were read on chain at the verification date.

The [exact-output quoter deployment record](https://github.com/Asif2902/achswap-contracts/blob/codex/aggregator-v3/achswap-agg/deployments/arcMainnet-exact-output-quoter.json) binds the new quoter to the existing quote engine. It helps find an exact-input route meeting the requested net output; it does not replace the execution router or provide an exact-output refund primitive.

## Gasless

| Contract | Address | Notes |
| --- | --- | --- |
| AchSponsoredExecutorV3 | `0x5D5B486D032Da0B9d02651375CEe1107D40bef0b` | One-signature gasless executor; deploy tx `0xbfb020e4a99a2bf7d27ce7bf965486344b978e83cb96ef4f561180ebfabfde26` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` | Canonical; verifies the gasless signature and pulls the input |
| Relayer | `0x8bbB0990B9Ba9DeFDb10389e59955886F79B19cC` | Allowlisted on the executor |
| Relayer | `0x6e0df2d65d309b55B217B5237657302386E75584` | Allowlisted on the executor |

Superseded gasless executors, not used by the app: `0x114FFB915eF00173D1c986c6FF5d445175622442` (v2), `0x1bC5c96ce21bc721e97DcBeABe787B9d83Dc8b1d` (v1). See [gasless architecture](/technical/gasless).

## Active aggregator adapters

The mask is `1 << index`. The registry has **12 entries: seven active and five retired**. These seven slots are active after the UnitFlow V3 redeployment. All-active mask: **2957**; V3-only mask: **2944**. Derive masks from the current manifest rather than assuming contiguous indices. A source only contributes when a usable quote exists.

| Index | Mask | Source | Adapter contract |
| ---: | ---: | --- | --- |
| 0 | 1 | Uniswap V2 | `0xe44Af61361C865F57d8dD01e23F4A1345e4D8295` |
| 7 | 128 | Uniswap V3 | `0x0b5e9c5c603b310563AD6f91A2817f49148221fe` |
| 2 | 4 | Uniswap V4 | `0xB131a72daa17c072Ea7819E60991F22b4B8D7063` |
| 3 | 8 | AchSwap V2 | `0x4d6F3B4F9d458D721545b2B870C59A7649304d6b` |
| 8 | 256 | AchSwap V3 | `0x121091C3748AD9e14d8d60c69e8943fE7d1f27Fd` |
| 9 | 512 | Synthra V3 | `0x573d00726A0d1308fEf99d330acC6152a17B1a11` |
| 11 | 2048 | UnitFlow V3 | `0xa780116bF3De4F4894A3b925bA0DC39201DEf391` |

All four V3 replacements bound quoter simulations and reject fee-tier splits containing a failed slice. Their existing router/quoter interfaces, native-USDC scaling and liquidity domains are preserved. Expensive routes exceeding the simulation budget can still be unavailable. Explorer source verification for these replacements remains pending; bytecode checks and successful simulations are not an independent security audit.

### Retired adapters — historical reference only

The following slots are **disabled on chain** and excluded from new frontend routes. Keep them only for decoding older transactions; do not use them to construct new swaps.

| Retired index | Source | Old adapter | Replacement index |
| ---: | --- | --- | ---: |
| 1 | Uniswap V3 | `0xD4a72c30cDfae65C24BEE00bcc214b336c538da9` | 7 |
| 4 | AchSwap V3 | `0x733B9e4Bf981F5fC18E6e3bD39903B9C9E91D7B5` | 8 |
| 5 | Synthra V3 | `0x90A2A4fe619aC2aF9440f4566fF4F178e637F139` | 9 |
| 6 | UnitFlow V3 | `0xE9C9f26a11c69f901bEeb37f84d4a4f913314f4f` | 10 |
| 10 | UnitFlow V3 | `0x93379541341480be03aE3E180B33cbF80E3453C3` | 11 |

Deployment, registration and deactivation transaction hashes are recorded in the contracts repository's `arcMainnet-v3-quote-gas-upgrade.json` and `arcMainnet-{achswap_v3,synthra_v3,unitflow_v3}-v3-quote-gas-upgrade.json` deployment files. Rebuild the frontend with the updated public manifest; no new environment variable is required.

## External DEX dependencies

These are the underlying protocol contracts, **not** additional AchSwap adapter slots. Confirm a specific pool and quote before attempting a trade.

| Uniswap contract | Address |
| --- | --- |
| V2 Factory | `0x89e5DB8B5aA49aA85AC63f691524311AEB649eba` |
| V2 Router | `0x1f7d7550B1b028f7571E69A784071F0205FD2EfA` |
| V3 Factory | `0xf0db7b58379503491d857dB50AC9ece64c653918` |
| V3 SwapRouter02 | `0x53BF6B0684Ec7eF91e1387Da3D1a1769bC5A6F77` |
| V3 QuoterV2 | `0x7DfD4F31be6814D2906BDE155c3e1B146EAc1468` |
| V4 PoolManager | `0x8366a39CC670B4001A1121B8F6A443A643e40951` |
| V4 Router dependency | `0x4fcA4a51Ab4F23A7447b3284fBd7D73289A89Fb1` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |

| Synthra contract | Address |
| --- | --- |
| V3 Factory | `0x6307fc239C7964942c1BfFE51930E55606619c74` |
| Universal Router | `0xe4C51D643A7d6D94be2646e482C59CF681B7AcEB` |
| SwapRouter02 | `0xa50eDe66a573eE5bB37E28AF5789B76aE5FEb828` |
| QuoterV2 | `0x9c179A7335B3fc841F59Aa6a62daf6d5c61b65D7` |
| NonfungiblePositionManager | `0x2743b771659fD9CE13970d7367e7e84AF6a31049` |
| TickLens | `0x4A43Bd076160779F8120b48fb99Ce8adB5A25C8d` |
| Multicall2 | `0x2619d7c51B74b271a657e7174f9283DC95852a46` |
| Synthra protocol fee recipient | `0x1CAB229e4D75E4DE0EC890bef0295a32BAaa1328` |

The Synthra recipient belongs to Synthra; it is **not** the AchSwap aggregator fee recipient. The Synthra adapter records the **SwapRouter02** above as its router.

| UnitFlow contract | Address |
| --- | --- |
| V3 Factory | `0x5bfBCeb73d39F722B1cB83fD2F11736b28c1Be6d` |
| InterfaceMulticall | `0xc9E1780bA34698C1067EA6B2fcF78f111a5F110b` |
| TickLens | `0x20Df732207340234E490a1e686A3A8055AF59b4e` |
| NFTDescriptor | `0x9Ca8e324380Aa2E80011A16C4d684366E47d4Ab4` |
| NonfungibleTokenPositionDescriptor | `0x5Bc0735F5D806C184EDE0A7731632F7c491B3B02` |
| V3 PositionManager | `0x300F5f2861eF0d9D3c6B812797C0A4c8b15C86a8` |
| V3 Router **(legacy)** | `0x6fD8351b9596C1F0b2f2479BfA6A171cb3d0f410` |
| Quoter **(legacy)** | `0x5AF6E89F0960Ff375AF84d9911D8153ef6240E34` |
| V3 Migrator | `0x36E9b24b9CF39c4C7069B75f01FA0419547F977a` |

UnitFlow's adapter uses the legacy router and quoter interfaces; do not substitute the Synthra or Uniswap Router02 ABI.

UnitFlow was redeployed (new factory/router/quoter above) and the aggregator migrated to a new `AchV3LegacyQuoterNativeTokenAdapter` at slot 11 (`0xa780116bF3De4F4894A3b925bA0DC39201DEf391`), with slot 10 deactivated. Adapter deploy tx `0xcba7f1c1174e1ca48a2a6cb765a906f7723419af98d1bedcb366b70520ffb3ea` (block 21331568), registration `0x96e7fadf233117142a40499b83a53b685e7bec7d5a293a549a4ad0c0a5ea5234`, deactivation `0x8ca696c024efd4c64abfd9c69cd65e5e848d431ce9c5f23fe21a5b57a010b675`. Record: `achswap-agg/deployments/arcMainnet-unitflow_v3-factory-migration.json`.

For contract interaction details, see [smart contracts](/technical/smart-contracts). For live transaction history, use [Arc explorer](https://explorer.arc.io).
