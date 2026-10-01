---
sidebar_position: 5
---

# Arc Mainnet contract addresses

**Network:** Arc Mainnet, chain ID **5042**. Updated **1 October 2026** for the 2026-10 swap-execution release.

Every AchSwap contract listed as live is source-verified on [arc.etherscan.io](https://arc.etherscan.io), so you can read its code and constructor arguments there. Before building a transaction yourself, check the live state, especially `feeConfig()` and the adapter list.

## Tokens

| Asset | Address | Notes |
| --- | --- | --- |
| USDC (ERC-20 interface) | `0x3600000000000000000000000000000000000000` | 6 decimals. The same balance as native USDC. |
| Native USDC | `0x0000000000000000000000000000000000000000` | Gas currency, 18 decimals. This is a sentinel address, not a contract. |
| EURC | `0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1` | ERC-20 |
| cirBTC | `0x171A4217b86A807A64eB94757Db6849fb4bDbAA0` | ERC-20 |
| UnsupportedProtocol | `0x8bcEaA40B9AcdfAedF85AdF4FF01F5Ad6517937f` | The WETH placeholder in AchSwap's V2/V3 routers. ETH-path router methods are not supported. |

## AchSwap V2 and V3

| Contract | Address |
| --- | --- |
| V2 Factory | `0xb0C2B0acb9c13079dDd871eDaF43Aabf6e88C530` |
| V2 Router | `0x52FE40c00530db2e43d01652f903870571A14AFD` |
| V3 Factory | `0xaE54BF4C8078BaAAf7e17f8e01659Ea470a989FC` |
| V3 SwapRouter **(legacy interface, deadline required)** | `0xEA0129203FBB99ebEea3f78B2d05b924f17FB556` |
| V3 NonfungiblePositionManager | `0x96366824D9240209cD236F5396054255ad1f5AA2` |
| V3 QuoterV2 | `0x659Da32F3F10566bDB6B55Ad84c182f1D00Ba058` |
| V3 Migrator | `0xE6395F899564D7D39Fe81D1EDa8b1680E5E396fa` |
| V3 TickLens | `0x0e981987Aca4ed06A256F1fC7A2c98DDAcc52E69` |

V3 fee tiers: 100, 500, 3000 and 10000.

## Swap execution

Every AchSwap route executes on **AchRouteExecutor**, which uses five execution adapters. How they work is described in [swap execution](/technical/swap-execution).

| Contract | Adapter id | Address | Deployment tx (block) |
| --- | ---: | --- | --- |
| AchRouteExecutor | — | `0x1B844738455b8060D12839331b35893526E9d314` | `0x63913865c8174ddfbdfcd59fd3efcd43b83fc360e5d0d67c2734996a687a0bf0` (23596879) |
| AchNativeAliasAdapter | 1 | `0x42fc88372cf10aec294Cc5B18B4E8dfE992E9621` | `0x94ef2d0bb6ad6e8ade0ab60c4bc9bee0986e179d2f947f8f3f321dcc737c3196` (23596885) |
| AchV2PairExecutionAdapter | 2 | `0x5Bb3251A2d803751d179f717e2df1739a3e01fD1` | `0x233a1dba1bcf4d5638f4c490f3e73debe4be3f75ef9686d50d9039e22eafc135` (23596891) |
| AchV3PoolExecutionAdapter | 3 | `0xb9b9Ab2daee19b4DD2aB3194ae578605A5F4bffD` | `0x904ddcf03dc012b85d6c39eeda47533afd56c90a7f4439b8ea4ac269aa13b1be` (23596896) |
| AchV4HookExecutionAdapter | 4 | `0x74A60d5aAA7515b199Ce4aAd4E6D2eB7f25F0E16` | `0x58d0b0ed683eec2923e58212e803b5bd6206521439f9931a4280646e5b917cba` (23596902) |
| AchLunyaPoolExecutionAdapter | 5 | `0x4383d30E2EFb44aDB8Af8f05754963df93388c88` | `0x3163201b699bd39b10f0f3cb18c9cc8310b062fd37064355deae87d5dc14d924` (23596908) |

| Setting | Value |
| --- | --- |
| Protocol fee | 25 bps (0.25%) of the output, charged once per swap |
| Fee recipient | AchSwap treasury Safe `0x0dbd33291b0bc85e75465d0d7F261b4cF758BCf0`, paid directly on every swap |
| Fee configuration version | 1 |
| Owner | `0x5820cdcEE868F395eB26fA9b00123f4b7530DC11` |
| Activation | `0x26001dac844c56eb59fba7b21ae46fa02d99c5779a1e66a99a3ca509a9f5d427` (block 23596946). All five adapters were active from the first block. |
| Compiler | solc 0.8.24, via-IR, optimizer 200 runs, EVM cancun |

There is no fee vault and nothing to claim: each swap pays the fee to the Safe in the same transaction.

### Configured factories

These pools can be reached by the adapters. Every configuration below is fixed in the adapter's constructor.

**Adapter 2 (V2 pairs).** Fee 997/1000 (0.30%) for every factory.

| Source | Factory |
| --- | --- |
| Uniswap V2 | `0x89e5DB8B5aA49aA85AC63f691524311AEB649eba` |
| AchSwap V2 | `0xb0C2B0acb9c13079dDd871eDaF43Aabf6e88C530` |
| DyorSwap | `0x942Bd5BFdc5317C5507e326f8EB4BB6058AB5C10` |
| Architex | `0x3648cc1323b4729e472cffdC570C6096565b0923` |
| ACTFUN | `0x96E4955fDE3f1aDDDC2C8202b23A319bb9CF5034` |

**Adapter 3 (concentrated liquidity).** `key` is the fee tier for fee-keyed factories and the tick spacing for Slipstream factories.

| Source | Factory | Pool key | Callback selector |
| --- | --- | --- | --- |
| Uniswap V3 | `0xf0db7b58379503491d857dB50AC9ece64c653918` | fee | `0xfa461e33` |
| AchSwap V3 | `0xaE54BF4C8078BaAAf7e17f8e01659Ea470a989FC` | fee | `0x0e380b8a` |
| Synthra V3 | `0x6307fc239C7964942c1BfFE51930E55606619c74` | fee | `0x13abb0ca` |
| Synthra V3 (second factory) | `0x84169F9aDF4F5F0e483BfC350498a85b1d7eC638` | fee | `0x13abb0ca` |
| UnitFlow V3 | `0x5bfBCeb73d39F722B1cB83fD2F11736b28c1Be6d` | fee | `0x82800e84` |
| SushiSwap V3 | `0x7282249282902e1f99c2CB0A04230091bd30FE3A` | fee | `0xfa461e33` |
| Bugle | `0xB09f790A1907a1db006e88F14C4f0168fBee9598` | fee | `0xfa461e33` |
| FlutchPad | `0x389016a3c28150881FD91A0063109F7107c3F193` | fee | `0xfa461e33` |
| Aero CL (Slipstream) | `0xb89Df768aF2CFE637ceB352c587Fe8edAf491d03` | tick spacing | `0xfa461e33` |
| Archery (Slipstream) | `0xC481038C013FE96F38CE7A2dC417b2B1B78b16A4` | tick spacing | `0xfa461e33` |
| Topaz (Slipstream) | `0xaa5865dC3A60b25D305226d66fd573021f0D8fFB` | tick spacing | `0xfa461e33` |
| Aero CL, earlier factory (Slipstream) | `0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F` | tick spacing | `0xfa461e33` |

Protocol names are taken from on-chain evidence. For V2 factories that is the LP token name of their pairs. For concentrated-liquidity factories it is the NFT position manager that minted their pools' first positions. Three factories keep Uniswap's or Slipstream's default names and are identified by who deploys and uses them: ACTFUN's launchpad graduates its tokens into `0x96E4…5034`, FlutchPad's launch contracts create the pools of `0x3890…F193`, and `0x0462…a55F` has the same owner as Aero CL's factory.

**Adapter 4 (Uniswap V4).** PoolManager `0x8366a39CC670B4001A1121B8F6A443A643e40951`, for hookless and hooked pools, subject to the owner's hook deny-list.

**Adapter 5 (Lunya).** Factory `0x711492DF23F320745de6fD7f0ab9564FDBfeA016`, callback selector `0xd9c40d3a`.

## Gasless

| Contract | Address | Notes |
| --- | --- | --- |
| AchSponsoredExecutorV3 | `0x5D5B486D032Da0B9d02651375CEe1107D40bef0b` | One-signature gasless executor. Deployment tx `0xbfb020e4a99a2bf7d27ce7bf965486344b978e83cb96ef4f561180ebfabfde26` (block 23434238). |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` | Canonical. Verifies the gasless signature and pulls the input. |
| Relayer | `0x8bbB0990B9Ba9DeFDb10389e59955886F79B19cC` | On the executor's relayer allowlist |
| Relayer | `0x6e0df2d65d309b55B217B5237657302386E75584` | On the executor's relayer allowlist |

The gasless executor can call, and approve as spender, these targets:

- KyberSwap router `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5`
- LI.FI diamond `0xA4072583658Fae592A3506A42431cb6316a8d40b`
- AchRouteExecutor `0x1B844738455b8060D12839331b35893526E9d314`, added 1 October 2026 in txs `0xfd8ae0a855770c0b4cf787070f3ebe1ae91c0e5a300cb55313d6af2dec698dfd` and `0x5b86485070a62513f0b8ddee984d3ae2c0d2c2780b9a958f958dd55bb0f7b009`

The list also still contains two retired targets, the AchExecutionRouter and the first AchRouteExecutor. They are removed when the retired contracts are paused. See [gasless architecture](/technical/gasless).

## Periphery

| Contract | Address | Role |
| --- | --- | --- |
| AchArcNativeUsdcAdapter | `0x097d6546db9fba2F908A88eE30FC870eb55fde90` | Adds liquidity to, and swaps on, AchSwap's own V2/V3 contracts with USDC paid from the native balance, so no approval is needed. Its aggregator entry point is retired and not used. |

## External protocols

These belong to other protocols. AchSwap routes through their pools, but does not own or operate them.

| Uniswap contract | Address |
| --- | --- |
| V2 Factory | `0x89e5DB8B5aA49aA85AC63f691524311AEB649eba` |
| V2 Router | `0x1f7d7550B1b028f7571E69A784071F0205FD2EfA` |
| V3 Factory | `0xf0db7b58379503491d857dB50AC9ece64c653918` |
| V3 SwapRouter02 | `0x53BF6B0684Ec7eF91e1387Da3D1a1769bC5A6F77` |
| V3 QuoterV2 | `0x7DfD4F31be6814D2906BDE155c3e1B146EAc1468` |
| V4 PoolManager | `0x8366a39CC670B4001A1121B8F6A443A643e40951` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |

| Synthra contract | Address |
| --- | --- |
| V3 Factory | `0x6307fc239C7964942c1BfFE51930E55606619c74` |
| V3 Factory (second) | `0x84169F9aDF4F5F0e483BfC350498a85b1d7eC638` |
| SwapRouter02 | `0xa50eDe66a573eE5bB37E28AF5789B76aE5FEb828` |
| QuoterV2 | `0x9c179A7335B3fc841F59Aa6a62daf6d5c61b65D7` |
| NonfungiblePositionManager | `0x2743b771659fD9CE13970d7367e7e84AF6a31049` |

| UnitFlow contract | Address |
| --- | --- |
| V3 Factory | `0x5bfBCeb73d39F722B1cB83fD2F11736b28c1Be6d` |
| V3 PositionManager | `0x300F5f2861eF0d9D3c6B812797C0A4c8b15C86a8` |

| Other | Address |
| --- | --- |
| Lunya factory | `0x711492DF23F320745de6fD7f0ab9564FDBfeA016` |
| Aero CL (Slipstream) factory | `0xb89Df768aF2CFE637ceB352c587Fe8edAf491d03` |

## Retired contracts

AchSwap no longer uses these contracts. They are listed only so that older transactions can be decoded. Do not use them for new transactions.

| Contract | Address | Role |
| --- | --- | --- |
| AchRouteExecutor (first) | `0xcD1bc4f6A4448FeA4DE51410D3b571732FE55Af8` | Previous route executor |
| AchExecutionRouter | `0xb1C3B6B8B371aFd9c938AC064f7aeD33d6BC26cA` | Previous aggregator's execution entry point |
| AchQuoteEngine | `0x07A2583092711D15dd9C854C7ec21f8fD5819285` | Previous aggregator's on-chain quoting |
| AchExactOutputQuoter | `0x099163157daFdC4a7819F04442A5Ae686801214d` | Previous aggregator's exact-output quoting |
| AchFeeController | `0x98a90461f0D4E442914A0848faC7c1fd1630D189` | Previous aggregator's fee settings |
| AchVault | `0x4b31cf5a5Ce8cC3C7fB3DcCA244eeE5F6Bd72CAa` | Previous aggregator's fee vault |
| AchMultiHopRouter | `0xbc66DbbD4f0753850f5401C3ca12B7AE021A17E6` | Chained swaps on the previous aggregator |
| AchSponsoredExecutor v2 | `0x114FFB915eF00173D1c986c6FF5d445175622442` | Two-signature gasless executor |
| AchSponsoredExecutor v1 | `0x1bC5c96ce21bc721e97DcBeABe787B9d83Dc8b1d` | First gasless executor |

<details>
<summary>Retired adapters</summary>

Adapters of the first route executor, by id:

| Id | Address |
| ---: | --- |
| 1 | `0x6E09bA0f592B5b5FCf68345543fC14493D248006` |
| 3 | `0xC3d0C39A45db9f5Cae45015d290533Ddbbf9E4d5` |
| 4 | `0x50aE6e6D358167b252186d400f0449f6823A7144` |
| 8 | `0x87B23C9160F919ef5AcCB156740bB2d33Cb44F35` |
| 9 | `0x536598BA24D45597c36E0D93D37E3220258fe1BB` |
| 10 | `0x377e0233C3279812C29eDCef086664cc210269B5` |
| 12 | `0xf808A11DFa2D9488f815Fe1Da64e274aba053B6D` |
| 13 | `0x4c736E45d92b49Bc998D5407B63F4cd818809460` |
| 14 | `0x2D3C6053E69c130a868e82Dbf3833fBeF9fE7C63` |
| 15 | `0x62a4dcb6D7cbD6eC0d43565dBfd18D4431c3a58f` |
| 16 | `0x04732F7ACED4ddb0dfa4e10Af02356b8a2b17f61` |
| 17 | `0xEB4b84fFa5943b3b9904a4c78fC712f476C52b36` |

Adapters of the previous aggregator's quote engine, by slot:

| Slot | Address |
| ---: | --- |
| 0 | `0xe44Af61361C865F57d8dD01e23F4A1345e4D8295` |
| 1 | `0xD4a72c30cDfae65C24BEE00bcc214b336c538da9` |
| 2 | `0xB131a72daa17c072Ea7819E60991F22b4B8D7063` |
| 3 | `0x4d6F3B4F9d458D721545b2B870C59A7649304d6b` |
| 4 | `0x733B9e4Bf981F5fC18E6e3bD39903B9C9E91D7B5` |
| 5 | `0x90A2A4fe619aC2aF9440f4566fF4F178e637F139` |
| 6 | `0xE9C9f26a11c69f901bEeb37f84d4a4f913314f4f` |
| 7 | `0x0b5e9c5c603b310563AD6f91A2817f49148221fe` |
| 8 | `0x121091C3748AD9e14d8d60c69e8943fE7d1f27Fd` |
| 9 | `0x573d00726A0d1308fEf99d330acC6152a17B1a11` |
| 10 | `0x93379541341480be03aE3E180B33cbF80E3453C3` |
| 11 | `0xa780116bF3De4F4894A3b925bA0DC39201DEf391` |

</details>

For live transactions, use [arc.etherscan.io](https://arc.etherscan.io) or [explorer.arc.io](https://explorer.arc.io).
