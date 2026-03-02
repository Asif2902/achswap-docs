---
sidebar_position: 3
---

# Network Setup

AchSwap and AchMarket operate on **ARC Testnet**. This guide covers adding the network to your wallet.

## What is ARC Testnet?

ARC Testnet is a blockchain network used for testing AchSwap and AchMarket. It features:

- **USDC as Native Token** - The gas token is USDC, not ETH
- **Fast Block Times** - Quick transaction confirmations
- **Low Costs** - No expensive mainnet fees

## Network Parameters

| Parameter | Value |
|-----------|-------|
| Network Name | ARC Testnet |
| Chain ID | 5042002 |
| Chain ID (Hex) | 0x4CEC52 |
| RPC URL | https://arc-testnet.drpc.org/ |
| Block Explorer | https://testnet.arcscan.app |
| Symbol | USDC |
| Decimals | 18 |

## Adding Network Automatically

When you connect your wallet to AchSwap or AchMarket, you'll typically be prompted to switch to ARC Testnet automatically. Click **Approve** or **Switch Network** when prompted.

## Adding Network Manually

### MetaMask (Browser)

1. Open MetaMask
2. Click the network dropdown (top center)
3. Click **Add Network**
4. Scroll down and click **Add a network manually**
5. Fill in the details:

```
Network Name: ARC Testnet
New RPC URL: https://arc-testnet.drpc.org/
Chain ID: 5042002
Currency Symbol: USDC
Block Explorer URL: https://testnet.arcscan.app
```

6. Click **Save**

### MetaMask (Mobile)

1. Open MetaMask app
2. Tap the hamburger menu (top left)
3. Tap **Settings** → **Networks** → **Add Network**
4. Fill in the same details as above
5. Tap **Add**

### Coinbase Wallet

1. Open Coinbase Wallet
2. Tap the settings icon
3. Tap **Networks** → **Add Network**
4. Fill in the network details
5. Tap **Add**

## Verifying Connection

After adding the network:

1. Connect your wallet to AchSwap or AchMarket
2. Look for the network indicator in the header
3. You should see "ARC Testnet" with a green dot

## Switching Between Networks

If you need to switch between ARC Testnet and other networks:

### MetaMask
Click the network dropdown and select the desired network.

### In-App
Some apps provide a network switcher in the header. Click it to see available networks.

## Getting Test Tokens

### Using the Bridge

1. Go to **Bridge** on AchSwap
2. Select your **Source Chain** (e.g., Ethereum Sepolia)
3. Select **ARC Testnet** as destination
4. Enter USDC amount
5. Complete the bridging process

### Testnet Faucets

If you need ETH for other testnets:
- Ethereum Sepolia: [faucet.sepolia.org](https://faucet.sepolia.org)
- Other chains: Check respective documentation

## Troubleshooting

### Wrong Network Error
- Switch to ARC Testnet using the dropdown in your wallet
- Or disconnect and reconnect to trigger the network prompt

### Transaction Failures
- Ensure you're on ARC Testnet
- Verify you have sufficient USDC balance for gas

### RPC Errors
- Try switching to a different RPC endpoint
- Contact support if issues persist
