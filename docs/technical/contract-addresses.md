---
sidebar_position: 2
---

# Arc Mainnet contract addresses

**Network:** Arc Mainnet, chain ID **5042**. Addresses below are from the [frontend's public deployment manifest](https://github.com/Achswap/achswap/blob/mainnet-test/shared/deployment-config.js) and the [contracts deployment records](https://github.com/Achswap/achswap-contracts/blob/codex/aggregator-v3/achswap-agg/deployments/arcMainnet-aggregator-v3.json). Deployed contracts were checked for code on chain 5042 on **14 September 2026**; the seven adapter indices and metadata were also read from the live quote engine. The native sentinel and fee recipients are not contract deployments. Check live contract state again before building transactions, especially fees and registry membership.

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
| AchExecutionRouter | `0xb1C3B6B8B371aFd9c938AC064f7aeD33d6BC26cA` |
| Arc-native USDC adapter | `0x097d6546db9fba2F908A88eE30FC870eb55fde90` |
| AchMultiHopRouter | `0xbc66DbbD4f0753850f5401C3ca12B7AE021A17E6` |
| Current aggregator fee recipient | `0x5820cdcEE868F395eB26fA9b00123f4b7530DC11` |

The fee recipient is a controller setting, not a fixed contract dependency. Its value and the base 30 bps fee were read on chain at the verification date.

## Registered aggregator adapters

The mask is `1 << index`. These seven slots were **active** in `AchQuoteEngine` at the verification date. A registered source only contributes when a usable quote exists.

| Index | Mask | Source | Adapter contract |
| ---: | ---: | --- | --- |
| 0 | 1 | Uniswap V2 | `0xe44Af61361C865F57d8dD01e23F4A1345e4D8295` |
| 1 | 2 | Uniswap V3 | `0xD4a72c30cDfae65C24BEE00bcc214b336c538da9` |
| 2 | 4 | Uniswap V4 | `0xB131a72daa17c072Ea7819E60991F22b4B8D7063` |
| 3 | 8 | AchSwap V2 | `0x4d6F3B4F9d458D721545b2B870C59A7649304d6b` |
| 4 | 16 | AchSwap V3 | `0x733B9e4Bf981F5fC18E6e3bD39903B9C9E91D7B5` |
| 5 | 32 | Synthra V3 | `0x90A2A4fe619aC2aF9440f4566fF4F178e637F139` |
| 6 | 64 | UnitFlow V3 | `0xE9C9f26a11c69f901bEeb37f84d4a4f913314f4f` |

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
| V3 Factory | `0xc9719bF56c4C22BaA1549885B03F38a04897ff10` |
| InterfaceMulticall | `0xD4BB7b3b1e4563480cEd52Bf5Ff0b8d0B5012FE9` |
| TickLens | `0x1c2eC90a61b238Dc5e0D79F1D737d735E795Df66` |
| NFTDescriptor | `0xd84Ce312Dc2C1C7bf447ED6ABc38558D7B90BD6b` |
| NonfungibleTokenPositionDescriptor | `0xbD9B978993c4F48bdc49708e0bf1bAe12999aF06` |
| V3 PositionManager | `0x771AB382ca3770416D2C71E076fc6C3760Bb0ccf` |
| V3 Router **(legacy)** | `0xc53D630e43d565DA0D84b8D637982cA61dC3f4B6` |
| Quoter **(legacy)** | `0x73D01db0dfA3C7E31F97cDDB73F8Bbf21cAFcB08` |
| V3 Migrator | `0xdd3b7F43b1281A3CFea726C0F7F0051467b51A33` |

UnitFlow's adapter uses the legacy router and quoter interfaces; do not substitute the Synthra or Uniswap Router02 ABI.

For contract interaction details, see [smart contracts](/technical/smart-contracts). For live transaction history, use [Arc explorer](https://explorer.arc.io).
