# Deployment Checklist - Day 14

**Status**: Ready to deploy
**Date**: October 21, 2025
**Build**: ✅ Passing (0 TypeScript errors)

---

## Pre-Deployment Verification

### Backend Build Status
- ✅ TypeScript compilation: PASSING
- ✅ Build output: dist/ directory created
- ✅ All production code: Type-safe
- ✅ Test files: Excluded from build

### Required Accounts
- [ ] Railway account (https://railway.app/)
- [ ] GitHub repository access (sanctum-gateway-track)
- ✅ Supabase account (already configured)
- ✅ Upstash account (already configured)
- ✅ Sanctum Gateway API key (already have)

---

## Step 1: Deploy Backend to Railway (1.5 hours)

### 1.1 Create Railway Project
1. Go to https://railway.app/dashboard
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Authorize Railway to access your GitHub
6. Select `sanctum-gateway-track` repository
7. Click "Deploy Now" (first deployment will fail - expected)

### 1.2 Configure Root Directory
1. In Railway dashboard, click on your service
2. Go to Settings tab
3. Under "Source" section, set:
   - **Root Directory**: `src/backend`
4. Click "Save"

### 1.3 Configure Build Commands
1. Still in Settings tab
2. Under "Deploy" section, set:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
3. Click "Save"

### 1.4 Add Environment Variables
1. Go to "Variables" tab
2. Click "+ New Variable"
3. Add these 12 variables:

```bash
# Node Environment
NODE_ENV=production
PORT=3001

# Gateway Configuration
GATEWAY_API_KEY=<your_gateway_api_key>
GATEWAY_API_URL=https://gateway.sanctum.so/v1

# Solana Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta

# Database (from Supabase dashboard)
DATABASE_URL=<your_supabase_connection_string>

# Redis (from Upstash dashboard)
REDIS_URL=<your_upstash_redis_url>

# CORS (will update after Vercel deployment)
FRONTEND_URL=*

# Logging
LOG_LEVEL=info
```

### 1.5 Deploy
1. Click "Deploy" button (top right)
2. Wait 2-3 minutes for build
3. Monitor logs in "Deployments" tab
4. Look for "Server listening on port 3001"

### 1.6 Get Production URL
1. Go to Settings tab
2. Under "Domains" section
3. Copy the Railway-generated URL: `https://your-app-production.up.railway.app`
4. **Save this URL** - you'll need it for frontend deployment

### 1.7 Run Database Migrations
Using Railway CLI:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link  # Select your project

# Run migrations
railway run npm run db:migrate
```

OR manually via Railway dashboard:
1. Go to Settings → Deploy
2. Add "Deploy Command": `npm run db:migrate && npm start`
3. Redeploy

### 1.8 Verify Deployment
```bash
# Test health endpoint
curl https://your-app-production.up.railway.app/health

# Expected response:
{
  "status": "ok",
  "service": "gateway-insights-backend",
  "database": "connected",
  "websocket": { "enabled": true, "clients": 0 },
  "timestamp": "2025-10-21T..."
}
```

---

## Step 2: Deploy Frontend to Vercel (1 hour)

### 2.1 Create Vercel Project
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import `sanctum-gateway-track` from GitHub
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `src/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2.2 Add Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
NEXT_PUBLIC_WS_URL=wss://your-railway-url.up.railway.app
```

### 2.3 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Copy Vercel URL: `https://your-app.vercel.app`

---

## Step 3: Configure Production CORS (30 min)

### 3.1 Update Railway Environment
1. Go to Railway dashboard → Variables
2. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Redeploy (automatic)

### 3.2 Verify Connection
1. Visit Vercel URL: `https://your-app.vercel.app`
2. Dashboard should load with data
3. Check browser console - no CORS errors

---

## Step 4: End-to-End Testing (2 hours)

### 4.1 Backend Health Checks
- [ ] GET /health - Returns OK
- [ ] GET /api - Returns API info
- [ ] GET /api/analytics/overview - Returns metrics
- [ ] GET /api/analytics/transactions - Returns transactions
- [ ] WebSocket connects successfully
- [ ] Database queries work

### 4.2 Frontend Validation
- [ ] Dashboard page loads
- [ ] Real-time feed displays
- [ ] Analytics page shows charts
- [ ] Transactions page lists data
- [ ] Dark mode toggle works
- [ ] Mobile responsive
- [ ] All navigation links work

### 4.3 Integration Testing
- [ ] Submit test transaction
- [ ] Verify appears in dashboard
- [ ] Check WebSocket real-time update
- [ ] Test analytics calculations
- [ ] Verify CSV export
- [ ] Verify JSON export

### 4.4 Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## Step 5: Performance Check (1 hour)

### 5.1 Run Lighthouse Audit
```bash
# Install Lighthouse CLI (optional)
npm install -g lighthouse

# Run audit
lighthouse https://your-app.vercel.app --view
```

OR use Chrome DevTools:
1. Open https://your-app.vercel.app
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Click "Generate report"

### 5.2 Verify Metrics
- [ ] Performance: >90
- [ ] Accessibility: >90
- [ ] Best Practices: >90
- [ ] SEO: >80
- [ ] Bundle size: <500KB
- [ ] Page load: <3s

### 5.3 Save Results
- [ ] Screenshot Lighthouse scores
- [ ] Save to `assets/screenshots/lighthouse.png`

---

## Troubleshooting Guide

### Railway Build Fails
```bash
# Check logs in Railway dashboard
# Common fixes:
- Verify Root Directory = src/backend
- Verify Build Command = npm run build
- Verify Start Command = npm start
- Check all environment variables are set
```

### Database Connection Failed
```bash
# Verify DATABASE_URL format:
postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Check Supabase:
- Database is active
- Connection pooling enabled
- IP restrictions allow Railway
```

### CORS Errors
```bash
# Check Railway variables:
FRONTEND_URL=https://your-app.vercel.app  # No trailing slash!

# Check backend logs for CORS middleware activation
```

### WebSocket Not Connecting
```bash
# Verify frontend env vars:
NEXT_PUBLIC_WS_URL=wss://your-railway-url.up.railway.app  # Use wss:// not ws://
```

---

## Success Criteria

✅ **Deployment Complete When:**
- [ ] Railway backend returns 200 on /health
- [ ] Vercel frontend loads dashboard
- [ ] Test transaction flows through system
- [ ] Real-time updates work via WebSocket
- [ ] Lighthouse score >90 on all metrics
- [ ] No console errors in browser
- [ ] Mobile responsive working

---

## Next Steps After Deployment

1. ✅ **Save Production URLs**:
   - Backend: https://your-railway-url.up.railway.app
   - Frontend: https://your-app.vercel.app

2. ⏳ **Record Video Demo** (Day 15)
   - Use production URLs in video
   - Show real transactions

3. ⏳ **Create Screenshots** (Day 15)
   - Capture from production app
   - Real data, not mocks

4. ⏳ **Final Documentation** (Day 16)
   - Update README with production URLs
   - Add deployment badges

---

**Estimated Total Time**: 6.5 hours
**Timeline**: Complete by end of Day 14 (Oct 22)

**May this deployment go smoothly! Bismillah!** 🚀
