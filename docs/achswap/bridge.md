---
sidebar_position: 5
---

# Cross-Chain Bridge

The Bridge page allows you to transfer USDC between different blockchain networks using Circle's CCTP (Cross-Chain Transfer Protocol).

## What is CCTP?

Circle's **Cross-Chain Transfer Protocol (CCTP)** is a trustless protocol for bridging USDC between chains. It works by:

1. Burning USDC on the source chain
2. Broadcasting a message to the destination chain
3. Minting USDC on the destination chain

## Supported Networks

### Source Chains (Testnet)

| Network | Chain ID | Status |
|--------|----------|--------|
| Ethereum Sepolia | 11155111 | Active |
| Avalanche Fuji | 43113 | Active |
| OP Sepolia | 11155420 | Active |
| Arbitrum Sepolia | 421614 | Active |
| Base Sepolia | 84532 | Active |
| Polygon Amoy | 80002 | Active |
| Unichain Sepolia | 1301 | Active |
| Linea Sepolia | 59141 | Active |

### Destination
- **ARC Testnet** (5042002) - Our native chain

## How to Bridge

### Step-by-Step

1. Navigate to **Bridge**
2. Select **Source Chain** (where you're bridging from)
3. Confirm you're connected to that network in your wallet
4. Enter **USDC Amount**
5. Toggle **Fast Transfer** if desired (optional)
6. Click **Bridge**

### The Process

```
Step 1: Approve
├─ Token spending approval
└─ Required for first bridge only

Step 2: Burn
├─ USDC burned on source chain
└─ Transaction hash generated

Step 3: Attestation
├─ Wait for Circle attestation
├─ Typically 1-10 minutes
└─ Auto-polled by interface

Step 4: Mint
├─ Switch to destination network
├─ USDC minted on ARC Testnet
└─ Transaction complete
```

## Fast Transfer

### What is Fast Transfer?

Fast Transfer uses liquidity providers to speed up bridging:
- Instant or near-instant delivery
- Small fee (typically 0.1%)
- Available for select chains

### Availability

Fast transfer availability depends on:
- Route liquidity
- Time of day
- Network congestion

## Transfer Status

### Tracking Progress

Each transfer shows:
- **Step indicator** - Current step in the process
- **Transaction hashes** - Source and destination
- **Progress bar** - Visual completion status
- **Time elapsed** - How long since initiation

### Incomplete Transfers

If a transfer fails or is interrupted:
- Transfers are saved in localStorage
- Resume from where it left off
- Click "Resume" on the Bridge page

## Understanding Limits

| Limit | Value |
|-------|-------|
| Minimum Transfer | 1 USDC |
| Maximum Transfer | Varies by source |
| Attestation Time | 1-20 minutes |

## Fees

Bridging involves two types of fees:

### Network Fees
- Gas costs on source chain
- Gas costs on destination chain
- Paid to respective networks

### CCTP Fee
- Standard: Free (included in gas)
- Fast Transfer: ~0.1%

## Troubleshooting

### "Transfer failed"
- Check wallet connectivity
- Ensure sufficient gas token on source chain
- Try again or use Fast Transfer

### "Attestation pending too long"
- Normal during high traffic
- Wait up to 20 minutes
- Contact support if >30 minutes

### Can't receive on destination
- Ensure connected to correct network
- Check wallet balance
- Verify transaction on explorer

### Wallet not connected to source chain
- Switch network in your wallet
- Refresh the page
- Reconnect wallet

## Tips

1. **Start Small** - Test with a small amount first
2. **Keep Records** - Save transaction hashes
3. **Be Patient** - Attestation takes time during congestion
4. **Use Fast Transfer** - When speed matters
