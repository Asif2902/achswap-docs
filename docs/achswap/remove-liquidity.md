---
sidebar_position: 3
---

# Remove Liquidity

Remove your liquidity from V2 pools or V3 positions to retrieve your tokens plus earned fees.

## Removing V2 Liquidity

### Process

1. Navigate to **Remove Liquidity**
2. Select **V2** mode
3. Choose the pool (e.g., USDC/ACHS)
4. Select your LP position
5. Enter amount to remove ( useor percentage slider)
6. Review tokens received
7. Click **Remove Liquidity**
8. Confirm in your wallet

### Understanding the Interface

```
Pool: USDC/ACHS
Your LP Balance: 100.00

Remove Amount: [────●────] 50%

You'll receive:
- USDC: 500.00
- ACHS: 1,250.00
+ Fees: 2.50 USDC
```

### Fee Collection

V2 automatically collects accrued fees when you remove liquidity. No separate claim needed.

## Removing V3 Liquidity

V3 requires two steps: collect fees, then remove liquidity.

### Step 1: Collect Fees

1. Select **V3** mode
2. Choose your position
3. Review accrued fees
4. Click **Collect Fees**
5. Confirm in wallet

### Step 2: Remove Liquidity

1. Enter amount to remove
2. Choose destination (wallet or position)
3. Review tokens received
4. Click **Remove Liquidity**
5. Confirm in wallet

### V3 Fee Collection

V3 tracks fees separately from principal:

```
Position: USDC/ACHS (0.3%)
Range: $0.80 - $1.20

Fees Earned:
- USDC: 1.50
- ACHS: 0.75

Principal:
- USDC: 500.00
- ACHS: 400.00
```

## Understanding Returns

### What You Receive

When removing liquidity:

1. **Principal** - Your original tokens
2. **Accrued Fees** - Trading fees earned
3. **Pool Share** - Pro-rata share of any pool changes

### Slippage

Remove liquidity has minimal slippage but uses a small buffer:
- Default: 0.5%
- Ensures you receive at least the displayed amount

## Partial vs Full Removal

### Partial Removal

Remove a percentage of your position:
- Fees continue accruing on remaining
- Your pool share decreases proportionally

### Full Removal

Remove 100% of your position:
- Collect all accrued fees first
- Position is closed completely

## Troubleshooting

### "Cannot remove during active trade"
- Wait for any pending swaps to complete
- Refresh the page

### Fees not showing
- Check if you've actually earned fees
- Click "Collect Fees" for V3 positions

### Amount incorrect
- Pool balances may have changed
- Check block explorer for transaction history
