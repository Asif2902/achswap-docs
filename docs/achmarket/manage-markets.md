---
sidebar_position: 6
---

# Manage Markets

How to resolve, cancel, and manage your prediction markets.

## Market Management

### Owner Dashboard

Access management via Owner Dashboard:
- `/owner` - Create new markets
- `/owner/active` - Active markets
- `/owner/pending` - Markets needing resolution
- `/owner/resolved` - Resolved history
- `/owner/cancelled` - Cancelled/expired

## Managing Active Markets

### View Active Markets

See all trading markets:
- Current status
- Volume and participants
- Deadline countdown
- Quick actions

### Actions Available

| Action | Stage | Description |
|--------|-------|-------------|
| Resolve | Any Active | End with winner |
| Cancel | Active | Cancel with refund |

## Resolving Markets

### When to Resolve

After deadline passes:
- Trading has ended
- Outcome is known
- Provide proof

### How to Resolve

1. Go to **Pending Resolution** (or Active)
2. Find the market
3. Click **Resolve**
4. Select winning outcome
5. Enter proof URI (link to proof)
6. Click **Confirm**
7. Approve transaction

### Resolution Form

```
┌─────────────────────────────────────────────────────────┐
│ Resolve Market                                         │
├─────────────────────────────────────────────────────────┤
│ Market: Will BTC hit $100k?                            │
│                                                         │
│ Select Winning Outcome:                                │
│   ○ Yes                                               │
│   ○ No                                                │
│                                                         │
│ Proof URI: [https://example.com/proof]                │
│ (Link to news, source confirming outcome)             │
│                                                         │
│ Confirm Resolution                                     │
└─────────────────────────────────────────────────────────┘
```

### Proof URI

A link to evidence:
- News article
- Official announcement
- Any verifiable source

### After Resolution

- Market marked as Resolved
- 0.25% fee collected
- Winners can claim
- Losers' shares worthless

## Cancelling Markets

### When to Cancel

- Event cancelled
- Market invalid
- No consensus possible
- Requested by users

### How to Cancel

1. Go to **Active Markets**
2. Find market
3. Click **Cancel**
4. Confirm cancellation
5. Approve transaction

### Cancellation Effects

- No fee collected
- Full refunds to all
- Market marked Cancelled
- Participants claim deposits

## Grace Period

### What is Grace Period

After deadline:
- 3 days to resolve/cancel
- Trading already stopped
- Waiting for creator action

### Pending Resolution Tab

Markets in grace period:
- Shown in Pending Resolution
- Countdown timer
- Urgent action needed

## Auto-Expiration

### After Grace Period

If not resolved:
- Market auto-expires
- Treated as cancelled
- Full refunds available
- No creator action needed

## Best Practices

### Resolution Tips

1. **Be Quick** - Resolve within grace period
2. **Provide Proof** - Link to official source
3. **Be Accurate** - Correct winning outcome

### Cancellation Tips

1. **Last Resort** - Only when necessary
2. **Transparent** - Explain why
3. **Fair** - Full refunds given

## Managing Multiple Markets

### Bulk Actions

Review all markets in dashboard:
- See all pending
- Filter by status
- Track volumes

---

## Related Links

- [Open AchMarket →](https://market.achswapfi.xyz)
