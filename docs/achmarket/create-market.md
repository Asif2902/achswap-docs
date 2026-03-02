---
sidebar_position: 5
---

# Create a Market

Learn how to create prediction markets on AchMarket as an owner.

## Owner Access

### Who Can Create?

Only the contract owner can create markets:
- Address that deployed the factory
- Typically the platform operator
- See Owner badge when connected

## Creating a Market

### Access

1. Connect wallet as owner
2. Redirected to Owner Dashboard
3. Click "Create Market"

### Form Fields

```
┌─────────────────────────────────────────────────────────┐
│ Create New Market                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Title: [________________________________]              │
│ Description: [________________________________]       │
│                                                         │
│ Category: [Sports ▼]                                   │
│                                                         │
│ Outcomes:                                              │
│   1. [Yes        ]                                     │
│   2. [No         ]                                     │
│   [+ Add Outcome]                                       │
│                                                         │
│ Duration: [7 ▼] days                                   │
│                                                         │
│ Liquidity Parameter (b): [500 ▼]                       │
│                                                         │
│ Header Image (optional):                                │
│   [URL input or upload]                                │
│                                                         │
│ [Create Market]                                        │
└─────────────────────────────────────────────────────────┘
```

## Field Details

### Title

The market question:
- Should be clear and specific
- Example: "Will BTC close above $100k?"
- Max ~200 characters

### Description

Additional context:
- Market rules
- Source for resolution
- Clarifications

### Category

Select category:
- Crypto, Sports, Politics, Entertainment, Science, Other
- Helps users find your market

### Outcomes

Define at least 2 outcomes:
- Most common: Yes/No
- Custom: Team A, Team B, Draw
- Up to 10 outcomes supported

### Duration

How long market trades:
- 1-30 days
- Or custom end date
- After this, grace period begins

### Liquidity Parameter (b)

Controls pricing sensitivity:

| Value | Effect |
|-------|--------|
| Lower (100-300) | More volatile, bigger potential returns |
| Higher (500-1000) | More stable prices |

Default: 500

### Header Image

Optional but recommended:
- IPFS hash
- HTTPS URL
- Helps market stand out

## Creating Process

### Step-by-Step

1. Fill in market details
2. Click "Create Market"
3. Confirm in wallet
4. Wait for confirmation
5. Market appears in Active Markets

### Transaction

Creates:
- New PredictionMarket contract
- Registers with factory
- Market immediately active

## After Creation

### Market Appears

- Listed on Home page
- Category filters work
- Trading starts immediately

### Managing

Access management from:
- Owner Dashboard
- Active Markets list

## Best Practices

### Market Design

1. **Clear Question** - Unambiguous resolution
2. **Defined Outcomes** - Binary is simpler
3. **Reasonable Duration** - Enough time for trading

### Liquidity Parameter

- Start with default (500)
- Lower = more speculation
- Higher = more stable

### Categories

Choose accurate category:
- Helps users discover
- Sets expectations

---

## Related Links

- [Open AchMarket →](https://market.achswapfi.xyz)
