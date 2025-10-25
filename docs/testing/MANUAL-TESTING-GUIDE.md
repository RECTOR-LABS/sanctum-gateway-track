# Gateway Insights - Manual Testing Guide

## 🚀 Setup (30 seconds)

**Terminal 1 - Backend:**
```bash
cd /Users/rz/local-dev/sanctum-gateway-track/src/backend
npm run clean && npm run dev
```
**Expected:** Server starts on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd /Users/rz/local-dev/sanctum-gateway-track/src/frontend
npm run clean && npm run dev
```
**Expected:** Next.js starts on http://localhost:3000

---

## ✅ Test 1: Backend Health (1 min)

**Action:** Open browser → http://localhost:3001/health

**Expected Result:**
```json
{
  "status": "ok",
  "database": "connected",
  "websocket": { "enabled": true, "clients": 0 }
}
```

---

## ✅ Test 2: Analytics API (2 min)

**Test 2.1 - Overview:**
```bash
curl http://localhost:3001/api/analytics/overview | jq .
```
**Expected:**
- `total_transactions`: 1
- `success_rate`: 100
- `total_cost_sol`: 0.0001

**Test 2.2 - Cost Savings:**
```bash
curl http://localhost:3001/api/analytics/costs | jq .
```
**Expected:**
- `savings_percentage`: 90.91% 🎯

---

## ✅ Test 3: Frontend Dashboard (3 min)

**Action:** Open http://localhost:3000

**Expected UI Elements:**
1. ✅ Sidebar (Dashboard, Analytics, Transactions)
2. ✅ Metric cards (4 cards: Total Txns, Success Rate, Cost Savings, Avg Response)
3. ✅ Transaction trend chart
4. ✅ Recent transactions list
5. ✅ Dark mode toggle (top-right)

**Expected Values:**
- Total Transactions: **1**
- Success Rate: **100%**
- Cost Savings: **90.91%**
- Avg Response Time: **~2.77s**

---

## ✅ Test 4: Analytics Page (2 min)

**Action:** Click "Analytics" in sidebar

**Expected Charts:**
1. ✅ Cost Comparison (Gateway vs Jito vs RPC)
2. ✅ Success Rate by Delivery Method
3. ✅ Response Time Distribution
4. ✅ Delivery Method Breakdown (pie/donut chart)

**Expected Data:**
- Shows 1 transaction via "sanctum-sender"
- 100% success rate
- 90.91% savings highlighted

---

## ✅ Test 5: Real-time WebSocket (3 min)

**Action 1:** Open browser DevTools (F12) → Console tab

**Expected:** See WebSocket connection message:
```
WebSocket connected to ws://localhost:3001
```

**Action 2:** Keep dashboard open, submit new transaction (see Test 6)

**Expected:** Dashboard updates in real-time without refresh

---

## 🔥 Test 6: End-to-End Transaction (5 min)

**Terminal 3 - Submit Transaction:**
```bash
cd /Users/rz/local-dev/sanctum-gateway-track/src/backend
tsx test-build-then-send.ts
```

**Expected Console Output:**
1. ✅ "Building transaction via Gateway..."
2. ✅ "Transaction built successfully"
3. ✅ "Sending transaction via Gateway..."
4. ✅ "Transaction sent! Signature: [64-char hash]"
5. ✅ "Delivery method: [sanctum-sender/rpc/jito]"
6. ✅ "Cost: 0.0001 SOL"

**Expected in Dashboard (auto-updates):**
- Total Transactions: **2** (was 1)
- New transaction appears in "Recent Transactions" table
- Charts update with new data point
- WebSocket shows transaction event in console

---

## ✅ Test 7: Dark Mode (30 sec)

**Action:** Click moon/sun icon (top-right)

**Expected:**
- ✅ Background switches dark ↔ light
- ✅ Charts adapt colors
- ✅ Text remains readable
- ✅ No visual glitches

---

## ✅ Test 8: Mobile Responsive (1 min)

**Action:** Press F12 → Click device toolbar icon → Select "iPhone 12"

**Expected:**
- ✅ Sidebar collapses to hamburger menu
- ✅ Charts resize properly
- ✅ Metric cards stack vertically
- ✅ All text readable

---

## ✅ Test 9: Navigation (1 min)

**Click through all pages:**
1. Dashboard → ✅ Shows overview
2. Analytics → ✅ Shows detailed charts
3. Transactions → ✅ Shows transaction list

**Expected:** No 404 errors, smooth transitions

---

## 🎯 PASS/FAIL Criteria

### ✅ PASS if:
- All 7 API endpoints return valid JSON
- Dashboard loads with correct metrics (90.91% savings)
- New transaction submission works
- Real-time updates appear in dashboard
- Dark mode toggles smoothly
- Mobile view is usable

### ❌ FAIL if:
- Any API returns 500 error
- WebSocket doesn't connect
- New transaction doesn't appear in dashboard
- Charts don't render
- Dark mode breaks layout

---

## 📊 Expected Final State

**After all tests:**
- Total Transactions: 2+
- Success Rate: 100%
- Cost Savings: 90.91%
- Zero errors in browser console
- Database has 2+ transaction records

---

**Test Duration:** ~15 minutes for full suite
**Status:** Ready to test! 🚀
