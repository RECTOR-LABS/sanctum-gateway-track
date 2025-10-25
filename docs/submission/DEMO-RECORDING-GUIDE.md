# Demo Recording Guide

**Quick guide for recording the Sanctum Gateway hackathon demo video**

---

## Pre-Recording Setup (5 minutes)

### 1. Fund Demo Wallet
```bash
solana transfer REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc 0.005
```
- Cost: ~$0.70 (0.005 SOL)
- Covers 10 demo transactions + buffer

### 2. Clear Database
**Supabase Dashboard:**
- Go to: https://supabase.com/dashboard
- Project: `gateway-insight`
- SQL Editor → New Query:
```sql
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
```
- Click "Run"
- Verify: 0 transactions

**Clear Redis Cache:**
```bash
redis-cli --tls \
  -h grateful-mollusk-23052.upstash.io \
  -p 6379 \
  -a AVoMAAIncDJlZjA4M2ExNTk2MzU0YTRiYjBkNWYxNzc5MTJkOTU5ZHAyMjMwNTI \
  FLUSHDB
```

### 3. Monitor Wallets
Navigate to: `http://localhost:3000/monitor`

Add two wallets:
1. **Your Demo Wallet**: `REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc`
2. **Jupiter Wallet**: `JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB`

Click "Start Monitoring" for each.

### 4. Setup Screen
**Split-screen layout:**
- **Left half**: `http://localhost:3000/demo`
- **Right half**: `http://localhost:3000/transactions`

**Browser setup:**
- 1920x1080 resolution (or higher)
- Dark mode enabled
- Zoom: 100%
- Close extra tabs

---

## Recording Flow (45-60 seconds)

### Timeline

**[0:00-0:05] Introduction**
- Show `/transactions` page
- Empty state: "No transactions found"
- Both monitored wallets visible

**[0:05-0:10] Navigate to Demo**
- Switch to split-screen view
- Left: `/demo` page
- Right: `/transactions` page
- Show big "Start Live Gateway Demo" button

**[0:10-0:40] Execute Demo**
- Click "Start Live Gateway Demo"
- Show progress bar: 0/10 → 10/10
- Watch transactions appear every 3 seconds:
  - Your wallet (REC1Vu7...)
  - Jupiter wallet (JUP4Fb2...)
  - Delivery method: "sanctum-sender"
  - Cost: ~0.0001 SOL
  - Status: ✅ confirmed

**[0:40-0:50] Show Completion**
- Status: "Completed!"
- Progress: 10/10 transactions
- All confirmed ✅

**[0:50-1:00] Analytics**
- Navigate to `/analytics`
- Highlight:
  - 100% success rate
  - 90.91% savings vs Jito
  - Response time metrics
  - Cost breakdown

---

## Narration Script (Optional)

```
"Let's see Sanctum Gateway in action with real mainnet transactions.

Starting from zero. We're monitoring our demo wallet and Jupiter's
wallet for comparison.

Click 'Start Live Gateway Demo' - and watch as 10 real transactions
appear every 3 seconds.

Gateway automatically routes each transaction for optimal cost and
MEV protection.

All confirmed. 100% success rate. 90% cost savings vs always-using-Jito.

Real mainnet. Real savings. Sanctum Gateway."
```

---

## Pre-Recording Checklist

Before recording:
- [ ] Backend running: `npm run dev` (port 3001)
- [ ] Frontend running: `npm run dev` (port 3000)
- [ ] Database cleared (0 transactions)
- [ ] Demo wallet funded (≥0.005 SOL)
- [ ] 2 wallets monitored (REC1Vu7... + JUP4Fb2...)
- [ ] Split-screen ready
- [ ] Browser: dark mode, 100% zoom, full screen
- [ ] Screen recorder ready

---

## Demo Details

**What Happens:**
- 10 real mainnet transactions
- 3-second intervals (30 seconds total)
- Self-transfer transactions (minimal cost)
- Saved to database with Gateway metadata
- Real-time WebSocket updates

**Cost Breakdown:**
- Per transaction: ~0.0001 SOL
- 10 transactions: ~0.001 SOL
- Total USD: ~$0.14 (at $140/SOL)

**Demo Wallets:**
- **Demo**: `REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc`
- **Jupiter**: `JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB`

---

## Troubleshooting

**WebSocket error?**
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Check backend is running on port 3001
- Verify: `curl http://localhost:3001/health`

**Demo button disabled?**
- Previous demo still running - wait 30 seconds
- Or restart backend server

**Transactions not appearing?**
- Check WebSocket status badge (should be green "Connected")
- Verify both wallets monitored
- Check browser console for errors

**Database not empty?**
- Re-run TRUNCATE command
- Restart backend server

---

## After Recording

1. **Export Data** (optional):
   - Navigate to `/analytics`
   - Export CSV/JSON

2. **Verify Transactions**:
   - Check on Solscan: https://solscan.io/account/REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc
   - Should see 10 recent self-transfer transactions

3. **Video Editing** (optional):
   - Trim intro/outro
   - Add title card
   - Add background music
   - Target: 30-60 seconds

---

## Summary

**Setup**: Fund wallet (0.005 SOL) → Clear database → Monitor 2 wallets → Split-screen

**Record**: Click button → Watch 10 transactions appear → Show analytics

**Duration**: 30 seconds of automated demo + 15-30 seconds showing results

**Cost**: ~$0.14 for 10 real mainnet transactions

**Result**: Professional demo showcasing Gateway's smart routing and cost savings! 🚀

---

**Alhamdulillah! You're ready to record your winning demo! 🎬**
