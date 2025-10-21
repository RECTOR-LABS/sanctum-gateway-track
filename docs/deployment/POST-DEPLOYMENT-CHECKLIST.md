# Post-Deployment Checklist

**Gateway Insights - Sanctum Gateway Track**

Comprehensive validation checklist to ensure your production deployment is fully functional and ready for submission.

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Flight Checks](#pre-flight-checks)
3. [Backend Health Checks](#backend-health-checks)
4. [Frontend Health Checks](#frontend-health-checks)
5. [Integration Testing](#integration-testing)
6. [Performance Testing](#performance-testing)
7. [Security Validation](#security-validation)
8. [Cross-Browser Testing](#cross-browser-testing)
9. [Mobile Testing](#mobile-testing)
10. [Final Validation](#final-validation)

---

## Overview

**Purpose**: Systematically verify all production functionality before submission.

**Estimated Time**: 60-90 minutes

**Required Information**:
- ✅ Railway backend URL: `https://your-app-production.up.railway.app`
- ✅ Vercel frontend URL: `https://your-app.vercel.app`
- ✅ Sanctum Gateway API key
- ✅ Test Solana wallet with small SOL balance (~0.01 SOL for testing)

---

## Pre-Flight Checks

### 1. Verify Deployment URLs

**Backend (Railway)**:
```bash
# Test basic connectivity
curl -I https://your-app-production.up.railway.app

# Expected: HTTP/2 200
```

**Frontend (Vercel)**:
```bash
# Test basic connectivity
curl -I https://your-app.vercel.app

# Expected: HTTP/2 200
```

**Status**: ⬜ Backend URL accessible | ⬜ Frontend URL accessible

---

### 2. Verify Environment Variables

**Backend (Railway Dashboard)**:
```bash
# Check all required variables are set:
✅ NODE_ENV=production
✅ PORT=3001 (or auto-assigned)
✅ GATEWAY_API_KEY=***
✅ GATEWAY_API_URL=https://gateway.sanctum.so/v1
✅ SOLANA_RPC_URL=***
✅ SOLANA_NETWORK=mainnet-beta
✅ DATABASE_URL=postgresql://***
✅ REDIS_URL=redis://***
✅ FRONTEND_URL=https://your-app.vercel.app
```

**Frontend (Vercel Dashboard)**:
```bash
# Check all required variables are set:
✅ NEXT_PUBLIC_API_URL=https://your-app-production.up.railway.app
✅ NEXT_PUBLIC_WS_URL=wss://your-app-production.up.railway.app
```

**Status**: ⬜ All backend env vars set | ⬜ All frontend env vars set

---

### 3. Check Deployment Logs

**Railway**:
1. Go to Railway Dashboard → Your Service → Logs
2. Verify no errors in last 100 lines
3. Look for successful startup message:
   ```
   Server listening on port 3001
   Database connected successfully
   Redis connected successfully
   ```

**Vercel**:
1. Go to Vercel Dashboard → Deployments → Latest
2. Verify build completed successfully
3. Check for warnings (acceptable) vs errors (fix required)

**Status**: ⬜ Backend logs clean | ⬜ Frontend build clean

---

## Backend Health Checks

### 1. API Health Endpoint

```bash
curl https://your-app-production.up.railway.app/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-21T10:00:00.000Z",
  "uptime": 123.456,
  "database": "connected",
  "redis": "connected"
}
```

**Status**: ⬜ Health endpoint returns 200 | ⬜ All systems "connected"

---

### 2. Database Connection

```bash
curl https://your-app-production.up.railway.app/api/health/db
```

**Expected Response**:
```json
{
  "database": "connected",
  "postgres": {
    "connected": true,
    "version": "PostgreSQL 15.x"
  },
  "redis": {
    "connected": true,
    "ping": "PONG"
  }
}
```

**Troubleshooting**:
- If PostgreSQL fails: Check DATABASE_URL, verify Supabase is running
- If Redis fails: Check REDIS_URL, verify Upstash is active

**Status**: ⬜ PostgreSQL connected | ⬜ Redis connected

---

### 3. Gateway Integration

```bash
curl https://your-app-production.up.railway.app/api/gateway/health
```

**Expected Response**:
```json
{
  "gateway": "configured",
  "apiKey": "present",
  "apiUrl": "https://gateway.sanctum.so/v1",
  "network": "mainnet-beta"
}
```

**Status**: ⬜ Gateway configured | ⬜ API key present

---

### 4. Transactions API

```bash
# Get recent transactions (should return empty array if none exist)
curl https://your-app-production.up.railway.app/api/transactions

# Expected: 200 OK with JSON array (may be empty)
```

**Status**: ⬜ Transactions endpoint working

---

### 5. Analytics API

```bash
# Get analytics summary
curl https://your-app-production.up.railway.app/api/analytics/summary

# Expected response:
{
  "totalTransactions": 0,
  "successRate": 0,
  "avgCost": 0,
  "totalSavings": 0
}
```

**Status**: ⬜ Analytics endpoint working

---

### 6. WebSocket Connection

```bash
# Install wscat if not already installed
npm install -g wscat

# Test WebSocket connection
wscat -c wss://your-app-production.up.railway.app

# Expected: "Connected (press CTRL+C to quit)"
# Press CTRL+C to exit
```

**Status**: ⬜ WebSocket connection successful

---

## Frontend Health Checks

### 1. Homepage Load

1. Open browser to: `https://your-app.vercel.app`
2. Verify page loads without errors
3. Check browser console (F12) for errors

**Expected**:
- ✅ Page loads in < 3 seconds
- ✅ No JavaScript errors in console
- ✅ No failed network requests (check Network tab)

**Status**: ⬜ Homepage loads | ⬜ No console errors

---

### 2. Dashboard Components

**Verify all components render**:
- ⬜ Header with navigation
- ⬜ Sidebar (if applicable)
- ⬜ Dashboard cards (Total Transactions, Success Rate, Cost Savings)
- ⬜ Recent transactions table
- ⬜ Charts/visualizations (even if empty)
- ⬜ Dark mode toggle
- ⬜ Footer

**Status**: ⬜ All components visible

---

### 3. Dark Mode Toggle

1. Click dark mode toggle (usually moon/sun icon)
2. Verify page switches between light and dark themes
3. Check all components are readable in both modes

**Status**: ⬜ Dark mode works | ⬜ Both themes readable

---

### 4. API Connection

**Open browser console** (F12) → Network tab:

1. Refresh page
2. Look for API calls to Railway backend:
   - `https://your-app-production.up.railway.app/api/transactions`
   - `https://your-app-production.up.railway.app/api/analytics/summary`

**Expected**: All API calls return 200 OK (even if data is empty)

**Status**: ⬜ API calls successful | ⬜ No CORS errors

---

### 5. WebSocket Connection (Frontend)

**Check browser console** for WebSocket connection:

**Expected log messages**:
```
WebSocket connecting to wss://your-app-production.up.railway.app
WebSocket connected
```

**If no messages**, check:
- NEXT_PUBLIC_WS_URL is set correctly
- WebSocket client code is implemented
- Railway backend allows WebSocket connections

**Status**: ⬜ WebSocket connects from frontend

---

## Integration Testing

### 1. Submit Test Transaction (CRITICAL)

This is the **most important test** - it validates the entire Gateway integration.

**Prerequisites**:
- Test wallet with ~0.01 SOL
- Wallet private key or use Phantom/Solflare extension

**Option A: Via Dashboard (Recommended)**

1. Go to `https://your-app.vercel.app`
2. Look for "Submit Transaction" or "New Transaction" button
3. Fill in transaction details:
   - **Recipient**: Any valid Solana address (or use your own wallet)
   - **Amount**: 0.001 SOL (minimal test)
   - **Delivery Method**: Auto (let Gateway decide)
4. Click "Submit"
5. Wait for confirmation

**Expected**:
- ✅ Transaction submits without errors
- ✅ Transaction appears in "Recent Transactions" table
- ✅ Status changes: Pending → Confirmed (or Failed)
- ✅ WebSocket updates in real-time
- ✅ Analytics update (total transactions +1)

**Option B: Via API (If Dashboard Not Ready)**

```bash
curl -X POST https://your-app-production.up.railway.app/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "recipientAddress": "YOUR_TEST_WALLET_ADDRESS",
    "amount": 0.001,
    "deliveryMethod": "auto"
  }'

# Expected response:
{
  "signature": "5x...",
  "status": "pending",
  "deliveryMethod": "rpc" | "jito",
  "cost": 0 | 0.001
}
```

**Wait 30-60 seconds**, then check status:

```bash
curl https://your-app-production.up.railway.app/api/transactions/[signature]

# Expected:
{
  "signature": "5x...",
  "status": "confirmed" | "failed",
  "deliveryMethod": "rpc" | "jito",
  "cost": 0.0 | 0.001,
  "finalCost": 0.0 (if RPC succeeded and Jito refunded)
}
```

**Status**: ⬜ Test transaction submitted | ⬜ Transaction confirmed | ⬜ Data saved to database

---

### 2. Verify Database Persistence

```bash
# Check if transaction was saved
curl https://your-app-production.up.railway.app/api/transactions

# Should return array with your test transaction
```

**Status**: ⬜ Transaction persisted to database

---

### 3. Verify Analytics Update

```bash
curl https://your-app-production.up.railway.app/api/analytics/summary

# Expected (after 1 transaction):
{
  "totalTransactions": 1,
  "successRate": 100.0, # If transaction succeeded
  "avgCost": 0.0, # If RPC succeeded
  "totalSavings": 0.001 # If Jito was refunded
}
```

**Status**: ⬜ Analytics reflect test transaction

---

### 4. Real-Time Updates (WebSocket)

**Test real-time updates**:

1. Open dashboard in **two browser windows** side-by-side
2. Submit a transaction from Window 1
3. Watch Window 2 for real-time update (without refresh)

**Expected**: Window 2 shows new transaction appear automatically

**Status**: ⬜ Real-time updates working

---

## Performance Testing

### 1. Lighthouse Audit (Frontend)

```bash
# Install Lighthouse CLI (if not already installed)
npm install -g lighthouse

# Run audit
lighthouse https://your-app.vercel.app \
  --view \
  --output html \
  --output-path ./lighthouse-report.html

# Open report
open lighthouse-report.html
```

**Target Scores**:
- ⬜ **Performance**: 90+
- ⬜ **Accessibility**: 95+
- ⬜ **Best Practices**: 95+
- ⬜ **SEO**: 90+

**If scores are low**, see `VERCEL-DEPLOYMENT.md` troubleshooting section.

---

### 2. Load Time Testing

**Test initial load time**:

1. Open Chrome DevTools → Network tab
2. Enable "Disable cache"
3. Refresh page
4. Check "Load" time at bottom of Network tab

**Expected**: < 3 seconds on fast connection

**Status**: ⬜ Initial load < 3s

---

### 3. API Response Time

```bash
# Test API response time
time curl https://your-app-production.up.railway.app/api/analytics/summary

# Expected: < 200ms
```

**Status**: ⬜ API responds in < 200ms

---

### 4. Database Query Performance

**Check slow query logs**:

1. Go to Railway Dashboard → Logs
2. Search for "slow query" or "timeout"
3. Verify no slow queries

**Expected**: All queries < 100ms

**Status**: ⬜ No slow queries

---

## Security Validation

### 1. HTTPS Enforcement

```bash
# Test HTTP redirect
curl -I http://your-app.vercel.app

# Expected: 301/302 redirect to https://
```

**Status**: ⬜ HTTPS enforced on frontend

```bash
# Test backend HTTPS
curl -I https://your-app-production.up.railway.app

# Expected: 200 OK with SSL
```

**Status**: ⬜ HTTPS enforced on backend

---

### 2. CORS Configuration

**Test CORS headers**:

```bash
curl -I https://your-app-production.up.railway.app/api/health \
  -H "Origin: https://your-app.vercel.app"

# Expected headers:
Access-Control-Allow-Origin: https://your-app.vercel.app
Access-Control-Allow-Credentials: true
```

**Test blocked origin**:

```bash
curl -I https://your-app-production.up.railway.app/api/health \
  -H "Origin: https://evil.com"

# Expected: No CORS headers (or error)
```

**Status**: ⬜ CORS allows frontend | ⬜ CORS blocks unauthorized origins

---

### 3. Environment Variables Not Exposed

**Check frontend source code**:

1. Open `https://your-app.vercel.app`
2. Open DevTools → Sources tab
3. Search for sensitive values:
   - ❌ Should NOT find: Database passwords, private keys, backend API keys
   - ✅ Should find: NEXT_PUBLIC_API_URL (this is okay - public by design)

**Status**: ⬜ No secrets exposed in frontend

---

### 4. Security Headers

```bash
# Check security headers
curl -I https://your-app.vercel.app

# Expected headers:
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: origin-when-cross-origin
```

**Status**: ⬜ Security headers present

---

## Cross-Browser Testing

Test on **at minimum** 3 browsers:

### 1. Chrome/Edge (Chromium)

- ⬜ Dashboard loads
- ⬜ Transactions display
- ⬜ Dark mode works
- ⬜ Charts render
- ⬜ WebSocket connects

---

### 2. Firefox

- ⬜ Dashboard loads
- ⬜ Transactions display
- ⬜ Dark mode works
- ⬜ Charts render
- ⬜ WebSocket connects

---

### 3. Safari (macOS/iOS)

- ⬜ Dashboard loads
- ⬜ Transactions display
- ⬜ Dark mode works
- ⬜ Charts render
- ⬜ WebSocket connects

**Status**: ⬜ Works in Chrome | ⬜ Works in Firefox | ⬜ Works in Safari

---

## Mobile Testing

### 1. Responsive Design

Test on **mobile device or browser DevTools** (mobile emulation):

**iPhone 13 Pro (390×844)**:
- ⬜ Dashboard fits screen
- ⬜ No horizontal scrolling
- ⬜ Navigation accessible
- ⬜ Tables scroll horizontally
- ⬜ Buttons are tappable (min 44×44px)

**iPad (810×1080)**:
- ⬜ Dashboard uses tablet layout
- ⬜ Charts readable
- ⬜ Navigation optimized

**Status**: ⬜ Mobile responsive | ⬜ Tablet responsive

---

### 2. Touch Interactions

- ⬜ Dark mode toggle tappable
- ⬜ Transaction rows tappable
- ⬜ Buttons respond to touch
- ⬜ No accidental double-taps

**Status**: ⬜ Touch interactions work

---

### 3. Mobile Performance

**Run Lighthouse on mobile**:

```bash
lighthouse https://your-app.vercel.app \
  --preset=desktop \
  --view

lighthouse https://your-app.vercel.app \
  --preset=mobile \
  --view
```

**Target Mobile Score**: 85+ (lower than desktop is acceptable)

**Status**: ⬜ Mobile performance acceptable

---

## Final Validation

### 1. End-to-End User Flow

**Complete this flow without errors**:

1. ⬜ Open dashboard
2. ⬜ View empty state (or existing transactions)
3. ⬜ Submit test transaction
4. ⬜ See transaction appear in real-time
5. ⬜ Refresh page - transaction persists
6. ⬜ View analytics update
7. ⬜ Toggle dark mode
8. ⬜ Navigate between pages (if multiple)
9. ⬜ Check responsive design on mobile

**Status**: ⬜ Complete flow successful

---

### 2. Error Handling

**Test error scenarios**:

**Invalid API request**:
```bash
curl -X POST https://your-app-production.up.railway.app/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# Expected: 400 Bad Request with error message
```

**Non-existent endpoint**:
```bash
curl https://your-app-production.up.railway.app/api/nonexistent

# Expected: 404 Not Found
```

**Frontend error handling**:
1. Disconnect internet (or block Railway in DevTools)
2. Try to load dashboard
3. Expected: Error message displayed (not blank page)

**Status**: ⬜ Errors handled gracefully

---

### 3. Documentation Accuracy

**Verify documentation matches reality**:

- ⬜ README.md API endpoints match actual endpoints
- ⬜ Environment variables in docs match required vars
- ⬜ Setup instructions work as written
- ⬜ Architecture diagram reflects actual structure

**Status**: ⬜ Documentation accurate

---

### 4. Screenshot Preparation

**Take screenshots for submission** (see `docs/VIDEO-SCRIPT.md` for list):

1. ⬜ Dashboard overview (light mode)
2. ⬜ Dashboard overview (dark mode)
3. ⬜ Transaction list with real data
4. ⬜ Analytics charts (populated)
5. ⬜ Real-time update (before/after)
6. ⬜ Mobile view
7. ⬜ Lighthouse scores

**Save to**: `docs/screenshots/` (create directory)

**Status**: ⬜ Screenshots captured

---

## Validation Summary

### Critical Issues (Must Fix Before Submission)

- ❌ Issue 1: ___________________________________
- ❌ Issue 2: ___________________________________
- ❌ Issue 3: ___________________________________

### Non-Critical Issues (Nice to Fix)

- ⚠️ Issue 1: ___________________________________
- ⚠️ Issue 2: ___________________________________

### Overall Readiness

**Backend**: ⬜ Ready ⬜ Needs Fixes
**Frontend**: ⬜ Ready ⬜ Needs Fixes
**Integration**: ⬜ Ready ⬜ Needs Fixes
**Performance**: ⬜ Ready ⬜ Needs Fixes
**Security**: ⬜ Ready ⬜ Needs Fixes

---

## Sign-Off

**Tested By**: ____________________

**Date**: ____________________

**Production URLs**:
- **Frontend**: https://____________________
- **Backend**: https://____________________

**Ready for Submission**: ⬜ YES ⬜ NO

---

## Next Steps After Validation

Once all checks pass:

1. ✅ **Update README.md** with production URLs
2. ⏳ **Record demo video** (see `docs/VIDEO-SCRIPT.md`)
3. ⏳ **Publish blog post** (see `docs/BLOG-POST.md`)
4. ⏳ **Prepare Twitter thread** (see `docs/TWITTER-THREAD.md`)
5. ⏳ **Submit to Superteam Earn**

---

**Last Updated**: October 21, 2025

**Alhamdulillah for reaching this milestone! May the deployment be successful and the submission accepted!**
