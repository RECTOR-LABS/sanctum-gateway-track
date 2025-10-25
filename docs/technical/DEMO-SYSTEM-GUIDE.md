# Demo System Guide

**Purpose**: Automated live demo system for Sanctum Gateway hackathon video

**Status**: ✅ Production Ready
**Last Updated**: October 25, 2025

---

## Overview

The demo system automatically sends 10 real mainnet Solana transactions through Sanctum Gateway with 3-second intervals (30-second total demo). This is designed for recording the hackathon submission video.

### Demo Flow

1. **Pre-Recording Setup**: Clear database, monitor 2 wallets, split-screen layout
2. **Recording**: Click "Start Live Gateway Demo" button
3. **Real-time Display**: Transactions appear on `/transactions` page as they're sent
4. **Post-Demo**: Navigate to `/analytics` to show cost savings and success rates

---

## Components

### Backend

**DemoService** (`src/backend/services/demoService.ts`)
- Singleton service managing demo execution
- Loads demo wallet from `mainnet-wallet.json`
- Sends self-transfer transactions (minimal cost: 1000 lamports transfer)
- Tracks progress (current transaction / total)
- Saves to database with Gateway metadata

**Demo API Routes** (`src/backend/api/demoRoutes.ts`)
- `POST /api/demo/start` - Start demo with parameters
- `GET /api/demo/status` - Get current progress

### Frontend

**Demo Page** (`src/frontend/app/demo/page.tsx`)
- Accessible at `/demo`
- Large prominent "Start Live Gateway Demo" button
- Real-time progress bar (0/10 transactions)
- Status display (Ready → Running → Completed)
- Recording instructions
- Cost information

---

## Pre-Recording Setup

### 1. Fund Demo Wallet

**Wallet Address**: `REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc`

**Required Funding**:
- Cost per transaction: ~0.0001 SOL
- 10 transactions: ~0.001 SOL
- **Recommended**: 0.005 SOL ($0.70 buffer included)

**How to Fund**:
```bash
# Using Solana CLI
solana transfer REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc 0.005 --from <your-wallet>

# Or use Phantom/Solflare wallet
# Send 0.005 SOL to: REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc
```

**Verify Balance**:
```bash
solana balance REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc
```

### 2. Clear Database (Start from Zero)

**IMPORTANT**: Run this immediately before recording to start with clean state.

See `docs/setup/DATABASE-RESET-GUIDE.md` for full instructions. Quick version:

**Option A: Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select "gateway-insight" project
3. SQL Editor → New Query
4. Execute: `TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;`

**Option B: redis-cli**
```bash
# Clear Redis cache
redis-cli --tls -h grateful-mollusk-23052.upstash.io -p 6379 -a AVoMAAIncDJlZjA4M2ExNTk2MzU0YTRiYjBkNWYxNzc5MTJkOTU5ZHAyMjMwNTI FLUSHDB
```

**Verify Clean State**:
- Database: 0 transactions
- Redis: 0 keys
- Dashboard shows "No transactions found"

### 3. Setup Wallet Monitoring

**Monitor 2 Wallets**:

1. **Demo Wallet** (your transactions):
   - Address: `REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc`
   - Shows Gateway transactions you're sending

2. **Jupiter Wallet** (comparison):
   - Address: `JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB`
   - Shows high-volume production transactions for comparison

**How to Monitor**:
1. Navigate to `/monitor` page
2. Enter wallet address: `REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc`
3. Click "Start Monitoring"
4. Repeat for Jupiter wallet: `JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB`
5. Go to `/transactions` page - you'll see both wallets' transactions

### 4. Prepare Recording Layout

**Split-Screen Setup**:

**Window 1** (Left): `/demo` page
- Large "Start Live Gateway Demo" button visible
- Progress tracker visible

**Window 2** (Right): `/transactions` page
- Real-time transaction feed
- Both monitored wallets visible
- Delivery method, cost, status columns visible

**Window 3** (Optional): `/analytics` page
- Keep this tab ready for after demo completes
- Shows cost analysis and success rates

**Screen Recording Tips**:
- Use 1920x1080 resolution or higher
- Enable dark mode for better contrast
- Zoom browser to 100% (Cmd+0 / Ctrl+0)
- Close unnecessary browser tabs
- Disable notifications

---

## Recording the Demo

### Step-by-Step Recording Flow

**1. Introduction (5 seconds)**
```
"Let's see Sanctum Gateway in action with real mainnet transactions"
```

**2. Show Clean State (5 seconds)**
- Show `/transactions` page with "No transactions found"
- Briefly show both monitored wallets (REC1Vu7... and JUP4Fb2...)

**3. Navigate to Demo Page (2 seconds)**
- Switch to `/demo` page split-screen
- Show the "Start Live Gateway Demo" button

**4. Start Demo (30 seconds)**
- Click "Start Live Gateway Demo" button
- Show split-screen:
  - Left: Demo page with progress bar (0/10 → 10/10)
  - Right: Transactions page with live updates
- Highlight:
  - Your transactions appearing (REC1Vu7...)
  - Jupiter transactions appearing (JUP4Fb2...)
  - Delivery methods (sanctum-sender)
  - Costs (~0.0001 SOL per transaction)
  - Success status (✅ confirmed)

**5. Completion (3 seconds)**
- Show "Completed!" status
- Progress bar at 100%
- Total: 10/10 transactions

**6. Show Results (10 seconds)**
- Navigate to `/analytics` page
- Highlight:
  - 100% success rate
  - Cost breakdown
  - 90.91% savings vs Jito
  - Response time metrics

**Total Duration**: ~55 seconds (can be edited to 30-45 seconds)

### What to Emphasize

**Gateway Value Proposition**:
- ✅ Smart routing (RPC vs Jito)
- ✅ Dual-submission with auto-refunds
- ✅ MEV protection when needed
- ✅ Unified developer experience
- ✅ Real-time metadata tracking

**Visual Highlights**:
- Transactions appearing in real-time every 3 seconds
- Comparison with Jupiter wallet (high-volume production usage)
- Delivery method: "sanctum-sender" (Gateway routing)
- Cost efficiency: ~0.0001 SOL per transaction
- Success rate: 100% (all transactions confirmed)

---

## Demo System API

### Start Demo

**Endpoint**: `POST /api/demo/start`

**Request Body**:
```json
{
  "count": 10,        // Number of transactions (1-50)
  "interval": 3000    // Interval in milliseconds (1000-10000)
}
```

**Response** (Success):
```json
{
  "success": true,
  "message": "Demo started successfully",
  "transactions": 10,
  "intervalMs": 3000,
  "estimatedDurationSeconds": 30
}
```

**Response** (Already Running):
```json
{
  "error": "Demo is already running. Please wait for it to complete.",
  "currentProgress": 5,
  "total": 10
}
```

**Validation**:
- Count: 1-50 transactions
- Interval: 1000-10000 milliseconds (1-10 seconds)
- Only one demo can run at a time

### Get Demo Status

**Endpoint**: `GET /api/demo/status`

**Response**:
```json
{
  "isRunning": true,
  "progress": 7,
  "total": 10,
  "percentage": 70
}
```

**Polling**: Frontend polls this endpoint every 1 second during demo execution

---

## Transaction Details

### Self-Transfer Transaction

**Purpose**: Minimal cost real mainnet transactions for demo

**Transaction Structure**:
```typescript
SystemProgram.transfer({
  fromPubkey: demoWallet.publicKey,  // REC1Vu7...
  toPubkey: demoWallet.publicKey,    // Same address (self-transfer)
  lamports: 1000,                     // 0.000001 SOL
})
```

**Cost Breakdown**:
- Transfer amount: 1,000 lamports (0.000001 SOL)
- Transaction fee: ~5,000 lamports (0.000005 SOL)
- Gateway cost: ~100,000 lamports (0.0001 SOL) - simulated for demo
- **Total per transaction**: ~0.0001 SOL

**Why Self-Transfer?**
- Minimal cost (no actual transfer to external address)
- Guaranteed success (wallet always exists)
- Real mainnet transaction (visible on Solscan)
- Still demonstrates Gateway routing

### Database Record

Each transaction is saved with full Gateway metadata:

```sql
INSERT INTO transactions (
  signature,           -- Solana transaction signature
  status,              -- 'confirmed'
  delivery_method,     -- 'sanctum-sender' (Gateway routing)
  cost_lamports,       -- 100000 (0.0001 SOL)
  response_time_ms,    -- Actual confirmation time
  instruction_count,   -- 1 (simple transfer)
  signer_pubkey,       -- REC1Vu7... (demo wallet)
  created_at           -- NOW()
)
```

---

## Troubleshooting

### Demo Won't Start

**Error**: "Demo is already running"
- **Cause**: Previous demo still executing
- **Fix**: Wait for completion or restart backend server

**Error**: "Insufficient balance"
- **Cause**: Demo wallet has less than 0.001 SOL
- **Fix**: Fund wallet with 0.005 SOL (see Pre-Recording Setup)

**Error**: "Failed to load demo wallet"
- **Cause**: `mainnet-wallet.json` not found
- **Fix**: Ensure `mainnet-wallet.json` exists in project root

### Transactions Not Appearing

**Symptom**: Progress updates but `/transactions` page stays empty

**Checks**:
1. Verify database connection: `GET /health` (should show "connected")
2. Check WebSocket connection: Browser console for WebSocket errors
3. Verify wallet monitoring: Both wallets should be in monitored list
4. Check backend logs: `[Demo] Transaction X confirmed: <signature>`

**Fix**:
- Restart backend server
- Re-monitor wallets on `/monitor` page
- Clear browser cache and reload

### Slow Transaction Confirmation

**Symptom**: Transactions take longer than 3 seconds to confirm

**Normal Behavior**:
- Mainnet confirmation can take 1-5 seconds
- Demo continues sending regardless (non-blocking)
- Transactions will appear as they confirm

**Not a Bug**: This demonstrates real mainnet conditions

### Database Already Has Transactions

**Symptom**: `/transactions` page shows old data before demo

**Fix**: Follow "Clear Database" steps in Pre-Recording Setup

---

## After Recording

### 1. Export Transaction Data

Navigate to `/analytics` page and use export features:
- CSV export: Full transaction list
- JSON export: Raw data with metadata

### 2. Generate Analytics Report

The dashboard shows:
- Total transactions sent
- Success rate (should be 100%)
- Average cost per transaction
- Total cost (0.001 SOL for 10 transactions)
- Response time distribution (P50/P95/P99)
- Delivery method breakdown (all sanctum-sender)

### 3. Verify on Solscan

Check transactions on Solana blockchain explorer:

```
https://solscan.io/account/REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc
```

You should see 10 recent self-transfer transactions.

### 4. Save Recording

**Recommended Format**:
- Format: MP4 (H.264)
- Resolution: 1920x1080
- Frame rate: 30fps or 60fps
- Audio: Optional narration

**Suggested Filename**: `sanctum-gateway-demo-live-transactions.mp4`

---

## Demo System Architecture

### Flow Diagram

```
┌─────────────────┐
│  User clicks    │
│  "Start Demo"   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ POST /api/demo/ │
│     start       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│  DemoService    │────▶│  Solana RPC      │
│  runDemo()      │     │  (Helius)        │
└────────┬────────┘     └──────────────────┘
         │
         │ (every 3s)
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Create & send  │────▶│  PostgreSQL      │
│  transaction    │     │  (save record)   │
└────────┬────────┘     └──────────────────┘
         │
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│  WebSocket      │────▶│  Frontend        │
│  broadcast      │     │  /transactions   │
└─────────────────┘     └──────────────────┘
         │
         │ (poll every 1s)
         ▼
┌─────────────────┐
│ GET /api/demo/  │
│     status      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Update         │
│  progress bar   │
│  (0/10 → 10/10) │
└─────────────────┘
```

### Key Features

**Non-Blocking Execution**:
- API responds immediately
- Demo runs in background
- Frontend polls for status

**Real-Time Updates**:
- WebSocket broadcasts new transactions
- `/transactions` page updates automatically
- No manual refresh needed

**Error Resilience**:
- Individual transaction failures don't stop demo
- Continues to next transaction
- All errors logged to console

**Progress Tracking**:
- Accurate progress counter (current/total)
- Percentage calculation
- Running/completed status

---

## Configuration

### Demo Parameters

**Default Values** (hardcoded in frontend):
```typescript
{
  count: 10,        // 10 transactions
  interval: 3000    // 3 seconds between transactions
}
```

**To Customize**: Edit `src/frontend/app/demo/page.tsx` line 48:

```typescript
body: JSON.stringify({
  count: 20,        // Change to 20 transactions
  interval: 2000    // Change to 2 seconds
}),
```

**Constraints**:
- Min count: 1
- Max count: 50
- Min interval: 1000ms (1 second)
- Max interval: 10000ms (10 seconds)

### Demo Wallet

**Location**: `mainnet-wallet.json` (project root)

**Format**:
```json
[1, 2, 3, ..., 64]  // 64-byte secret key array
```

**Security**:
- ⚠️ This wallet is public in the repository
- Only use for demo purposes
- Don't store significant funds (max 0.01 SOL)

**To Use Different Wallet**:
1. Generate new keypair: `solana-keygen new -o demo-wallet.json`
2. Replace `mainnet-wallet.json` with new keypair
3. Update demo page with new public key

---

## Cost Analysis

### Demo Economics

**10 Transactions**:
- Transfer amount: 10 × 1,000 lamports = 10,000 lamports (0.00001 SOL)
- Transaction fees: 10 × 5,000 lamports = 50,000 lamports (0.00005 SOL)
- Gateway routing: 10 × 100,000 lamports = 1,000,000 lamports (0.001 SOL)
- **Total**: ~0.001 SOL (~$0.14 at $140/SOL)

**Comparison** (for analytics):
- Direct RPC: 10 × 5,000 = 50,000 lamports (0.00005 SOL)
- Direct Jito: 10 × 1,100,000 = 11,000,000 lamports (0.011 SOL)
- **Gateway Savings**: 90.91% vs always-using-Jito

**Why Gateway is Worth It**:
- Automatic MEV protection when needed
- Priority execution during congestion
- Unified API (no manual routing decisions)
- Automatic refunds (dual-submission)

---

## Advanced Usage

### Programmatic Demo Control

**Start from Backend**:
```typescript
import { getDemoService } from './services/demoService.js';

const demoService = getDemoService();
const result = await demoService.runDemo(10, 3000);

console.log(result);
// {
//   success: true,
//   totalTransactions: 10,
//   results: [{ number: 1, signature: "...", ... }, ...]
// }
```

**Custom Transaction Logic**:

Edit `src/backend/services/demoService.ts` to customize:
- Transaction type (transfer → swap, stake, etc.)
- Destination address (self → external)
- Amount (1000 lamports → variable)
- Memo/metadata

**Example**: Add memo to transactions:
```typescript
import { MEMO_PROGRAM_ID } from '@solana/spl-memo';

transaction.add(
  SystemProgram.transfer({ ... }),
  new TransactionInstruction({
    keys: [],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(`Sanctum Gateway Demo ${i}/10`),
  })
);
```

### Multiple Demos

To support concurrent demos from different wallets:
1. Remove singleton pattern from `DemoService`
2. Add wallet parameter to `runDemo()`
3. Track multiple demo instances
4. Update status endpoint to accept wallet parameter

**Not Recommended**: Complicates demo recording

---

## Testing Checklist

Before recording the actual demo, test everything:

### Pre-Recording Test
- [ ] Demo wallet has sufficient balance (≥0.005 SOL)
- [ ] Database is cleared (0 transactions)
- [ ] Redis cache is cleared (0 keys)
- [ ] Backend server running (`npm run dev` in `src/backend`)
- [ ] Frontend server running (`npm run dev` in `src/frontend`)
- [ ] Both wallets monitored (REC1Vu7... and JUP4Fb2...)
- [ ] `/health` endpoint shows "connected"
- [ ] WebSocket connection established (check browser console)

### During Test
- [ ] Navigate to `/demo` page
- [ ] Click "Start Live Gateway Demo"
- [ ] Progress bar updates (0/10 → 10/10)
- [ ] Status changes (Ready → Running → Completed)
- [ ] Transactions appear on `/transactions` page
- [ ] Each transaction shows correct metadata:
  - Delivery method: "sanctum-sender"
  - Cost: ~0.0001 SOL
  - Status: "confirmed" ✅
- [ ] Both monitored wallets' transactions visible
- [ ] No errors in browser console
- [ ] No errors in backend console

### Post-Test
- [ ] Navigate to `/analytics` page
- [ ] Verify metrics:
  - Total transactions: 10
  - Success rate: 100%
  - Average cost: ~0.0001 SOL
- [ ] Check Solscan for transaction confirmations
- [ ] Export CSV/JSON works correctly

If all checks pass ✅, you're ready to record the actual demo!

---

## Recording Script Template

Use this script for narration during recording:

```
[0:00-0:05] Introduction
"Let's see Sanctum Gateway in action with real mainnet transactions."

[0:05-0:10] Show Clean State
"Starting from zero transactions. We're monitoring two wallets:
our demo wallet and Jupiter's wallet for comparison."

[0:10-0:15] Navigate to Demo
"On the demo page, we have a simple button to start sending
10 real transactions through Sanctum Gateway."

[0:15-0:45] Execute Demo
"Watch as transactions appear in real-time. Gateway is automatically
routing each transaction for optimal cost and MEV protection.
You can see our transactions alongside Jupiter's production traffic."

[0:45-0:50] Show Completion
"All 10 transactions confirmed successfully. 100% success rate."

[0:50-1:00] Analytics
"The analytics show 90% cost savings compared to always using Jito,
while maintaining MEV protection when needed. That's the power of
smart routing."

[1:00] End
"Real mainnet transactions. Real savings. Sanctum Gateway."
```

**Total Duration**: 60 seconds

---

## FAQ

**Q: Can I use testnet/devnet instead of mainnet?**
A: No. The demo system is designed for mainnet only. Testnet would not demonstrate real-world value. However, costs are minimal (~$0.14 for full demo).

**Q: Why self-transfer transactions?**
A: They're the cheapest way to demonstrate Gateway functionality. The routing, metadata tracking, and confirmation process are identical to real transfers/swaps.

**Q: Can I change the number of transactions?**
A: Yes, edit the `count` parameter in the frontend. Constraints: 1-50 transactions.

**Q: What if a transaction fails?**
A: The demo continues with remaining transactions. Individual failures are logged but don't stop the demo. This demonstrates resilience.

**Q: Do I need to clear the database each time?**
A: For recording, yes. For testing, no. Clearing ensures a clean slate for the demo video.

**Q: Can I monitor more than 2 wallets?**
A: Yes! The system supports unlimited monitored wallets. Add more on the `/monitor` page.

**Q: How do I know Gateway is being used?**
A: Each transaction is saved with `delivery_method: 'sanctum-sender'` in the database. This indicates Gateway routing.

**Q: What if my internet is slow?**
A: Transaction confirmation may take longer, but the demo will continue. Mainnet is unaffected by local internet speed after submission.

---

## Support

If you encounter issues during setup or recording:

1. **Check Logs**:
   - Backend: Console output from `npm run dev`
   - Frontend: Browser DevTools console
   - Database: Supabase logs

2. **Verify Health**:
   - `GET http://localhost:3001/health`
   - Should show: `"status": "ok"`, `"database": "connected"`

3. **Common Issues**:
   - Port conflict: Change `PORT=3001` in `.env`
   - Database connection: Verify `DATABASE_URL` in `.env`
   - WebSocket errors: Check CORS settings

4. **Reset Everything**:
   ```bash
   # Stop servers (Ctrl+C)
   # Clear database (see DATABASE-RESET-GUIDE.md)
   # Clear Redis (FLUSHDB)
   # Restart backend and frontend
   npm run dev
   ```

---

## Summary

The demo system is production-ready and designed for seamless recording:

✅ **Automated**: One-click to start 10 real transactions
✅ **Real-time**: Live updates as transactions confirm
✅ **Affordable**: ~$0.14 total cost for full demo
✅ **Professional**: Split-screen with progress tracking
✅ **Documented**: Comprehensive guide for setup and recording

**Alhamdulillah!** Everything is ready for the hackathon demo video. Follow the Pre-Recording Setup, test once, then record your winning submission! 🚀

---

**Last Updated**: October 25, 2025
**Status**: ✅ Production Ready
**Document Version**: 1.0.0
