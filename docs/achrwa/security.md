---
sidebar_position: 3
---

# Security & Monitoring

The AchRWA price oracle system is designed with **zero single points of failure**. Three independent services run on separate infrastructure, each with different signing keys, across multiple RPC providers and price data sources.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   ORACLE    │     │   MONITOR   │     │   BACKUP    │
│  (Primary)  │     │  (Watcher)  │     │ (Failover)  │
│             │     │             │     │             │
│ Submits     │     │ Detects     │     │ Takes over  │
│ prices      │     │ deviations  │     │ if primary  │
│ every 60s   │     │ & stale     │     │ goes down   │
│             │     │ prices      │     │             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │    ┌──────────────┴──────────────┐    │
       └────│      AchRWAOracle.sol       │────┘
            │   0x7639...5ABdB            │
            └─────────────────────────────┘
```

Each service operates independently with its own private key and runs on separate infrastructure.

---

## Components

### 1. Oracle (Primary Price Feeder)

The primary oracle service is responsible for submitting prices on-chain at regular intervals.

**Responsibilities:**
- Fetches real-time prices for all RWA pairs (AAPL, GOOGL, WTI, Gold, Silver)
- Submits prices to the on-chain oracle via `submitPriceBatch()`
- Uses multiple RPC endpoints with automatic failover
- Retries failed transactions with RPC rotation

**Price Sources (per asset):**

| Asset | Primary | Backup 1 | Backup 2 |
|-------|---------|----------|----------|
| AAPL | Yahoo Finance | Yahoo query2 | Stock prices API |
| GOOGL | Yahoo Finance | Yahoo query2 | Stock prices API |
| WTI | Yahoo Finance | Yahoo query2 | — |
| Gold | Yahoo Finance | Yahoo query2 | — |
| Silver | Yahoo Finance | Yahoo query2 | — |

---

### 2. Monitor (Deviation & Staleness Watcher)

The monitor watches for incorrect or stale on-chain prices and submits corrections when needed.

**Responsibilities:**
- Reads on-chain prices from the oracle contract
- Fetches current prices from external APIs
- Compares on-chain vs API prices
- Submits corrections when anomalies are detected

**Detection logic:**
- **Price deviation ≥ 50%**: Immediately submits the correct price
- **Price age > 5 minutes**: Submits a fresh price
- Detects compromised or malfunctioning oracle submissions

The monitor uses a **different signing key** from the primary oracle, so even if the oracle key is compromised, the monitor can override bad prices.

---

### 3. Backup (Failover Server)

The backup service activates only when the primary oracle goes offline.

**Responsibilities:**
- Monitors the oracle contract for recent transactions
- Checks if any price update was submitted in the last 5 minutes
- Takes over price submissions if the primary is unresponsive
- Returns to standby mode when the primary comes back online

**Detection logic:**
- If no price update in 5 minutes → **activate** backup
- If price updates are flowing → **deactivate** backup

---

## RPC Redundancy

All services use multiple RPC endpoints with automatic failover:

| Priority | Provider |
|----------|----------|
| 1 | Arc Official RPC |
| 2 | Blockdaemon |
| 3 | dRPC |
| 4 | QuickNode |

If any RPC endpoint fails, the service automatically switches to the next available provider.

---

## Key Separation

Each component uses a **different private key**:

| Component | Key Purpose |
|-----------|-------------|
| Oracle | Primary price submissions |
| Monitor | Deviation corrections |
| Backup | Failover submissions |

This means:
- A compromised oracle key cannot prevent the monitor from correcting prices
- A compromised monitor key cannot submit bad prices without the oracle overriding
- The backup key is separate from both, providing a third layer of independence

---

## Failure Scenarios

| Failure | Detected By | Response |
|---------|-------------|----------|
| Primary server crashes | Backup | Backup takes over within 5 min |
| RPC endpoint down | Primary | Switch to next RPC immediately |
| Price source down | Primary | Use backup price source |
| Price manipulated | Monitor | Submit correct price within 30 sec |
| Gas exhaustion | Primary/Backup | Log error, next service picks up |
| Network partition | Backup | Backup activates independently |
| Private key compromise | Monitor | Monitor corrects prices with separate key |

---

## On-Chain Protections

The oracle smart contract includes several safety mechanisms:

### Price Deviation Guard
Each pair has a `maxDeviation` parameter (in BPS). If a submitted price changes more than the allowed deviation from the previous price, the submission is rejected.

### Staleness Detection
Prices have a `maxStaleness` window. If no new price is submitted within this window, the price is marked as stale and swaps are blocked until a fresh price arrives.

### Pause Mechanism
The owner can pause both the oracle and the vault in emergency situations, halting all price submissions and swaps.

### Frozen Pairs
Individual pairs can be frozen without affecting other pairs, allowing targeted intervention.

### Reentrancy Protection
All vault state-changing functions use a non-reentrant guard to prevent reentrancy attacks.

---

## Smart Contract Addresses

| Contract | Address | Network |
|----------|---------|---------|
| AchRWAOracle | `0x76398cfa526D4a76EaEC0c4709d6B7C966E5ABdB` | Arc Testnet |
| RWAVault | `0xb8dc1f767167b567227326D8849175a188A0e78C` | Arc Testnet |

---

## Summary

**No single point of failure.** The system can survive:
- Any one service going down
- Any one RPC provider failing
- Any one price source going offline
- Any one signing key being compromised
- Any one server rebooting

The oracle will continue submitting accurate prices as long as at least one service is operational.
