---
sidebar_position: 5
---

# Glossary

Key terms and definitions for AchSwap and AchMarket.

---

## A

### AMM (Automated Market Maker)
A system that provides liquidity and prices trades algorithmically without order books.

### Aggregator
A routing system that splits trades across multiple protocols (V2, V3, V4) to minimize price impact and maximize output. AchSwap's aggregator charges a 0.1% fee.

### APR (Annual Percentage Rate)
The yearly interest rate earned on investments, including compounding.

---

## B

### Bridge
A cross-chain solution that transfers tokens between different blockchain networks.

---

## C

### CCTP (Cross-Chain Transfer Protocol)
Circle's protocol for bridging USDC between chains.

### CCTP V2
The second version of Circle's Cross-Chain Transfer Protocol, used by AchSwap for cross-chain USDC bridging.

### Chain ID
A unique identifier for a blockchain network (ARC Testnet: 5042002).

### Concentration
In V3/V4, concentrating liquidity within a specific price range to earn more fees.

---

## D

### Deadline
The time by which a prediction market must be resolved.

---

## E

### EIP-712
A standard for typed structured data hashing and signing. Used by AchSwap's gasless relayer for permit signatures.

### ERC-20
The standard for fungible tokens on Ethereum.

---

## F

### Fee Tier
The percentage of trading fees charged by a liquidity pool (V3/V4).

---

## G

### Gas
The computational work required to execute blockchain transactions.

### Gasless Swap
A swap where the relayer pays the gas fee on your behalf. You sign a permit message, and the relayer submits the transaction.

---

## H

### Hook
A smart contract attached to a V4 pool that can execute custom logic at various points during swaps or liquidity operations (before/after swap, before/after modify position).

---

## I

### Impermanent Loss
The temporary loss of value when providing liquidity due to price changes.

---

## L

### LMSR
Logarithmic Market Scoring Rule - the pricing algorithm used by prediction markets.

### LP (Liquidity Provider)
A user who deposits tokens into a liquidity pool.

---

## M

### Mint
The creation of new tokens (in this case, shares).

---

## N

### Nonce
A unique number used once in a transaction signature to prevent replay attacks. AchSwap's gasless relayer uses timestamp-based nonces.

---

## P

### Permit2
A standard token authorization contract by Uniswap that allows gasless token approvals. Used by AchSwap's gasless swap system.

### Pool
A smart contract holding tokens for trading.

### Pool Manager
The singleton contract in V4 that holds all V4 pools. Unlike V2/V3 where each pool is a separate contract, all V4 pools exist within one Pool Manager.

### Payout
The USDC received when redeeming winning shares or claiming refunds.

---

## R

### Relayer
A server that submits transactions on behalf of users in gasless swap mode. The relayer pays gas and is reimbursed through the transaction.

### Resolution
The act of determining the winning outcome of a prediction market.

### RPC (Remote Procedure Call)
A method for communicating with a blockchain node.

---

## S

### Share
A unit representing ownership of an outcome in a prediction market.

### Singleton
A contract architecture where all V4 pools exist within a single Pool Manager contract, reducing gas costs.

### Slippage
The difference between expected and actual trade execution price.

### Slippage Tolerance
The maximum price change you're willing to accept. If the market moves beyond this, the transaction reverts.

### Smart Contract
Self-executing code deployed on the blockchain.

### Smart Routing
The system that automatically finds the best swap path across V2, V3, and V4 pools.

### Source Mask
A bitmask used by the aggregator to select which protocols to include: V2=1, V3=2, V4=4. Default is 7 (all protocols).

### Swap
Exchanging one token for another.

---

## T

### Tick
The minimum price granularity in V3/V4 concentrated liquidity.

### TVL (Total Value Locked)
The total value of assets deposited in a protocol or pool.

---

## V

### V2
The classic AMM model with uniform liquidity distribution.

### V3
The concentrated liquidity model allowing targeted price ranges.

### V4
The hook-enabled singleton pool model with configurable fees and custom logic hooks.

---

## W

### Wallet
Software that stores private keys and allows signing transactions.

### Wrapped Token
A token that represents another asset (e.g., wUSDC).

---

## Related Links

- [Open AchSwap →](https://trade.achswap.app)
- [Open AchMarket →](https://prediction.achswap.app)
