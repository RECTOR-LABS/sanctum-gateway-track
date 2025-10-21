# Deployment Troubleshooting Guide

**Gateway Insights - Sanctum Gateway Track**

Comprehensive troubleshooting guide for common deployment issues on Railway and Vercel.

---

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Railway Backend Issues](#railway-backend-issues)
3. [Vercel Frontend Issues](#vercel-frontend-issues)
4. [Database & Redis Issues](#database--redis-issues)
5. [Gateway Integration Issues](#gateway-integration-issues)
6. [CORS & Network Issues](#cors--network-issues)
7. [WebSocket Issues](#websocket-issues)
8. [Performance Issues](#performance-issues)
9. [Build & Deployment Failures](#build--deployment-failures)
10. [Emergency Recovery](#emergency-recovery)

---

## Quick Diagnostics

### Step 1: Identify the Problem Layer

Run these quick tests to identify where the issue is:

```bash
# Test 1: Backend is reachable
curl -I https://your-app-production.up.railway.app/health
# ✅ 200 OK = Backend is running
# ❌ Connection refused = Backend is down
# ❌ 502/503 = Backend crashed or restarting

# Test 2: Frontend is reachable
curl -I https://your-app.vercel.app
# ✅ 200 OK = Frontend is deployed
# ❌ 404 = Deployment failed or domain issue

# Test 3: Database is connected
curl https://your-app-production.up.railway.app/api/health/db
# ✅ "connected": true = Database working
# ❌ Error = Database connection issue

# Test 4: CORS is configured
curl https://your-app-production.up.railway.app/api/health \
  -H "Origin: https://your-app.vercel.app" -I
# ✅ Access-Control-Allow-Origin header present = CORS working
# ❌ No header = CORS misconfigured
```

### Step 2: Check Logs

**Railway**:
```bash
# Via CLI
railway logs

# Via Dashboard: Railway → Your Service → Logs tab
```

**Vercel**:
```bash
# Via CLI
vercel logs

# Via Dashboard: Vercel → Deployments → Click deployment → "Logs" or "Runtime Logs"
```

---

## Railway Backend Issues

### Issue 1: Application Crashes on Startup

**Symptom**: Railway shows "Crashed" status, logs show `Application error` or `Exit code 1`

**Common Causes**:
1. Missing environment variables
2. Database connection failure
3. TypeScript compilation errors
4. Port binding issues

**Diagnostic Steps**:

```bash
# Check Railway logs for error message
railway logs --tail 100

# Common error patterns:
# "Cannot find module" → Missing dependency
# "Connection refused" → Database/Redis unreachable
# "Port already in use" → Port binding issue
# "Syntax error" → TypeScript compilation failed
```

**Solutions**:

**Solution 1A: Missing Environment Variable**

Error log:
```
Error: GATEWAY_API_KEY is not defined
```

Fix:
1. Go to Railway Dashboard → Variables
2. Add missing variable: `GATEWAY_API_KEY=your_key`
3. Click "Deploy" to restart

**Solution 1B: Database Connection Failed**

Error log:
```
Error: connect ECONNREFUSED
Error: getaddrinfo ENOTFOUND
```

Fix:
```bash
# Verify DATABASE_URL format
# Correct: postgresql://user:pass@host:6543/postgres
# Wrong: postgresql://user@host/postgres (missing password/port)

# Test connection manually
psql $DATABASE_URL -c "SELECT 1;"

# If fails, regenerate DATABASE_URL from Supabase:
# Supabase Dashboard → Settings → Database → Connection String (Pooler)
```

**Solution 1C: TypeScript Compilation Error**

Error log:
```
error TS2322: Type 'string' is not assignable to type 'number'
```

Fix:
```bash
# Fix TypeScript errors locally first
cd src/backend
npm run type-check

# Fix errors
# Commit and push
git add .
git commit -m "fix: TypeScript errors"
git push

# Railway auto-redeploys
```

**Solution 1D: Port Binding Issue**

Error log:
```
Error: listen EADDRINUSE: address already in use :::3001
```

Fix:
```typescript
// src/backend/index.ts
// Use Railway's auto-assigned PORT
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

Commit and redeploy.

---

### Issue 2: 502 Bad Gateway

**Symptom**: `curl` returns `502 Bad Gateway` when accessing backend

**Cause**: Application started but crashed or is not responding on expected port

**Solution**:

```bash
# Check Railway logs for crash reason
railway logs --tail 50

# Verify application is listening on correct port
# Logs should show: "Server listening on port 3001"

# If not, check src/backend/index.ts
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => { // Add '0.0.0.0' to listen on all interfaces
  console.log(`Server listening on port ${PORT}`);
});
```

---

### Issue 3: High Memory Usage / OOM Kills

**Symptom**: Railway logs show `Process exited with code 137` (OOM killed)

**Cause**: Application exceeds memory limit (Railway Free: 512MB)

**Solutions**:

**Solution 3A: Optimize Database Queries**

```typescript
// Bad: Loads all transactions into memory
const allTransactions = await db.query('SELECT * FROM transactions');

// Good: Use pagination
const transactions = await db.query(
  'SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100'
);
```

**Solution 3B: Limit Redis Cache**

```typescript
// Set max memory policy in Upstash dashboard
// Settings → Max Memory Policy: allkeys-lru (evicts least recently used)

// Or limit cache TTL
await redisClient.setex('key', 300, 'value'); // 5 minutes max
```

**Solution 3C: Upgrade Railway Plan**

```bash
# Free tier: 512MB RAM
# Pro tier: Up to 8GB RAM

# Go to Railway Dashboard → Settings → Plan → Upgrade
```

---

### Issue 4: Database Migration Errors

**Symptom**: Application starts but no `transactions` table exists

**Error**: `relation "transactions" does not exist`

**Solution**:

```bash
# Run migrations manually
railway run npm run db:migrate

# Or add migration to deploy command:
# Railway Dashboard → Settings → Deploy
# Deploy Command: npm run db:migrate && npm start
```

**If migration fails with "table already exists"**:

```bash
# Check current schema
railway run psql $DATABASE_URL -c "\dt"

# If table exists, skip migration
# If table doesn't exist but migration claims it does, reset migration:
railway run psql $DATABASE_URL -c "DROP TABLE IF EXISTS schema_migrations;"
railway run npm run db:migrate
```

---

## Vercel Frontend Issues

### Issue 5: Build Failure

**Symptom**: Vercel deployment shows "Build Failed" with red X

**Common Errors**:

**Error 5A: TypeScript Type Errors**

```
Type error: Property 'status' does not exist on type 'Transaction'
```

**Solution**:
```bash
cd src/frontend

# Run type check locally
npm run type-check

# Fix errors
# Commit and push
git add .
git commit -m "fix: TypeScript type errors"
git push

# Vercel auto-redeploys
```

**Error 5B: Environment Variable Not Set**

```
Error: NEXT_PUBLIC_API_URL is required
```

**Solution**:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`
3. Select **Production** environment
4. Click "Save"
5. Go to Deployments → Click latest → "Redeploy"

**Error 5C: Dependency Installation Failed**

```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/package-name
```

**Solution**:
```bash
# Verify package exists in package.json
cd src/frontend
cat package.json | grep "package-name"

# If typo, fix and commit
# If package removed from npm, find alternative
npm uninstall package-name
npm install alternative-package

git add package.json package-lock.json
git commit -m "fix: replace unavailable package"
git push
```

---

### Issue 6: Pages Return 404 After Deployment

**Symptom**: Homepage works but other routes return 404

**Cause**: Incorrect Next.js routing configuration

**Solution**:

**For App Router (Next.js 13+)**:
```bash
# Verify app directory structure
src/frontend/app/
├── layout.tsx      # ✅ Required
├── page.tsx        # ✅ Homepage (/)
└── dashboard/
    └── page.tsx    # ✅ /dashboard

# Each route MUST have page.tsx
```

**For Pages Router (legacy)**:
```bash
# Create vercel.json if needed
# src/frontend/vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**If using static export**:
```typescript
// next.config.ts
const nextConfig = {
  output: 'export', // Only if you need static HTML export
  trailingSlash: true,
};
```

---

### Issue 7: Blank Page / White Screen

**Symptom**: Deployment succeeds but page is blank

**Diagnostic**:

1. Open browser DevTools (F12) → Console
2. Look for JavaScript errors

**Common Errors**:

**Error 7A: Hydration Mismatch**

```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```

**Solution**:
```typescript
// Ensure server and client render same content
// Bad: Using Date.now() directly (different on server/client)
<div>{Date.now()}</div>

// Good: Use useEffect for client-only code
const [time, setTime] = useState<number | null>(null);
useEffect(() => {
  setTime(Date.now());
}, []);

return <div>{time ?? 'Loading...'}</div>;
```

**Error 7B: Environment Variable Undefined**

```
TypeError: Cannot read property 'NEXT_PUBLIC_API_URL' of undefined
```

**Solution**:
```typescript
// Always provide fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Or validate at build time
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is required');
}
```

---

## Database & Redis Issues

### Issue 8: Database Connection Refused

**Symptom**: `Error: connect ECONNREFUSED` or `Connection refused`

**Causes & Solutions**:

**Cause 8A: Incorrect DATABASE_URL**

```bash
# Check format
echo $DATABASE_URL

# Should be:
postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Common mistakes:
# - Missing password
# - Wrong port (5432 vs 6543)
# - Wrong host (direct vs pooler)
```

**Solution**:
```bash
# Get correct URL from Supabase
# Dashboard → Settings → Database → Connection String → "Pooler" mode (for Railway/Vercel)

# Update Railway env var
railway variables set DATABASE_URL="postgresql://..."
```

**Cause 8B: Supabase Paused**

Supabase free tier pauses after 7 days of inactivity.

**Solution**:
1. Go to Supabase Dashboard
2. Click "Restore" if project is paused
3. Wait 2-3 minutes for database to restart

**Cause 8C: IP Not Allowed**

Some database providers restrict IP addresses.

**Solution**:
```bash
# Supabase: Allow all IPs (needed for Railway/Vercel)
# Supabase Dashboard → Settings → Database → Network Restrictions
# Add: 0.0.0.0/0 (allow all)
```

---

### Issue 9: Redis Connection Failed

**Symptom**: `Error: Redis connection failed` or `ECONNREFUSED`

**Causes & Solutions**:

**Cause 9A: Incorrect REDIS_URL Format**

```bash
# Check format
echo $REDIS_URL

# Should be:
redis://default:[password]@us1-[name]-12345.upstash.io:6379

# Common mistakes:
# - Missing "redis://" prefix
# - Missing "default:" user
# - Wrong port
```

**Solution**:
```bash
# Get correct URL from Upstash
# Dashboard → Redis → Details → Copy "REDIS_URL"

# Update Railway env var
railway variables set REDIS_URL="redis://default:..."
```

**Cause 9B: Upstash Free Tier Limit Exceeded**

Upstash free tier: 10,000 commands/day

**Solution**:
```bash
# Check usage in Upstash Dashboard
# If exceeded, either:
# 1. Upgrade plan
# 2. Reduce Redis calls
# 3. Increase TTL to reduce SET operations

// Reduce Redis calls
await redisClient.setex('key', 3600, value); // Cache for 1 hour instead of 5 min
```

---

## Gateway Integration Issues

### Issue 10: Gateway API Key Invalid

**Symptom**: `Error: Unauthorized` or `401 Unauthorized` when calling Gateway

**Solution**:

```bash
# Verify API key is set
railway variables list | grep GATEWAY_API_KEY

# If missing or wrong:
# 1. Go to gateway.sanctum.so
# 2. Copy API key
# 3. Update Railway:
railway variables set GATEWAY_API_KEY="your_actual_api_key"
```

---

### Issue 11: Transaction Submission Fails

**Symptom**: `buildGatewayTransaction` or `sendTransaction` returns error

**Common Errors**:

**Error 11A: Insufficient Funds**

```
Error: Insufficient funds for transaction
```

**Solution**:
```bash
# Check wallet balance
solana balance YOUR_WALLET_ADDRESS

# If low, add SOL:
# - Mainnet: Buy SOL and transfer
# - Devnet: solana airdrop 1 YOUR_WALLET_ADDRESS
```

**Error 11B: Invalid Transaction**

```
Error: Transaction simulation failed
```

**Solution**:
```typescript
// Ensure transaction is properly constructed
const transaction = await gateway.buildGatewayTransaction({
  recipientAddress: 'VALID_SOLANA_ADDRESS', // Must be valid base58
  amount: 0.001, // Must be > 0
  // Add recent blockhash if needed
});

// Validate address before sending
import { PublicKey } from '@solana/web3.js';
try {
  new PublicKey(recipientAddress);
} catch (err) {
  throw new Error('Invalid Solana address');
}
```

**Error 11C: Network Issues**

```
Error: Network request failed
```

**Solution**:
```bash
# Verify SOLANA_RPC_URL is reachable
curl https://api.mainnet-beta.solana.com -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'

# Expected: {"jsonrpc":"2.0","result":"ok","id":1}

# If fails, try alternative RPC:
# Helius: https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
# QuickNode: https://[slug].solana-mainnet.quiknode.pro/YOUR_KEY/
```

---

## CORS & Network Issues

### Issue 12: CORS Error in Browser

**Symptom**: Browser console shows `Access to fetch at '...' has been blocked by CORS policy`

**Full Error**:
```
Access to fetch at 'https://your-backend.railway.app/api/transactions' from origin 'https://your-app.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Solution**:

**Step 1: Verify FRONTEND_URL is set in Railway**

```bash
railway variables list | grep FRONTEND_URL

# Should be:
FRONTEND_URL=https://your-app.vercel.app

# If missing or wrong:
railway variables set FRONTEND_URL="https://your-app.vercel.app"
```

**Step 2: Update CORS configuration in backend code**

```typescript
// src/backend/index.ts
import cors from 'cors';

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    // Also allow Vercel preview deployments
    /^https:\/\/.*\.vercel\.app$/,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// IMPORTANT: CORS middleware must be BEFORE routes
app.use('/api/transactions', transactionsRouter);
```

**Step 3: Test CORS**

```bash
curl -I https://your-backend.railway.app/api/health \
  -H "Origin: https://your-app.vercel.app"

# Expected header:
Access-Control-Allow-Origin: https://your-app.vercel.app
```

**Step 4: Handle OPTIONS preflight**

```typescript
// Ensure OPTIONS requests are handled
app.options('*', cors()); // Enable preflight for all routes
```

---

### Issue 13: API Calls Fail (Network Error)

**Symptom**: Frontend shows `Failed to fetch` or `Network error`

**Diagnostic**:

```bash
# Test API from command line
curl https://your-backend.railway.app/api/health

# ✅ Returns JSON = API is working
# ❌ Connection refused = API is down
# ❌ 502/503 = API crashed
```

**If API is working but frontend fails**:

**Cause 13A: Incorrect API URL in frontend**

```typescript
// Check frontend API URL
console.log(process.env.NEXT_PUBLIC_API_URL);

// Should match Railway backend URL
// https://your-backend.railway.app (no trailing slash)
```

**Solution**:
```bash
# Update Vercel env var
vercel env add NEXT_PUBLIC_API_URL production

# Enter: https://your-backend.railway.app
# Then redeploy
```

**Cause 13B: HTTPS/HTTP Mismatch**

Frontend on HTTPS cannot call backend on HTTP (mixed content blocked).

**Solution**:
```bash
# Ensure both are HTTPS
https://your-app.vercel.app → ✅
https://your-backend.railway.app → ✅
http://your-backend.railway.app → ❌ (will be blocked)
```

---

## WebSocket Issues

### Issue 14: WebSocket Connection Fails

**Symptom**: Browser console shows `WebSocket connection failed`

**Full Error**:
```
WebSocket connection to 'wss://your-backend.railway.app' failed: Error during WebSocket handshake
```

**Solutions**:

**Solution 14A: Use WSS (not WS)**

```typescript
// Bad: HTTP in production
const ws = new WebSocket('ws://your-backend.railway.app');

// Good: HTTPS in production
const ws = new WebSocket('wss://your-backend.railway.app');

// Best: Environment variable
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
const ws = new WebSocket(WS_URL);
```

**Solution 14B: Backend WebSocket Server Not Started**

```typescript
// Ensure WebSocket server is running
// src/backend/index.ts
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);
  });
});

// IMPORTANT: Listen on server, not app
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
```

**Solution 14C: CORS for WebSocket**

```typescript
// WebSocket CORS (if needed)
wss.on('connection', (ws, req) => {
  const origin = req.headers.origin;
  const allowedOrigins = [process.env.FRONTEND_URL];

  if (!allowedOrigins.includes(origin)) {
    ws.close(1008, 'Origin not allowed');
    return;
  }

  // Connection allowed
});
```

---

## Performance Issues

### Issue 15: Slow API Response Times

**Symptom**: API calls take > 1 second to respond

**Diagnostic**:

```bash
# Measure API response time
time curl https://your-backend.railway.app/api/analytics/summary

# Expected: < 200ms
# Slow: > 1s
```

**Causes & Solutions**:

**Cause 15A: Slow Database Queries**

```bash
# Check Railway logs for slow queries
railway logs | grep "slow query"

# Or enable query logging in PostgreSQL
# Supabase Dashboard → Database → Settings → Log Queries > 100ms
```

**Solution**:
```sql
-- Add indexes to frequently queried columns
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_delivery_method ON transactions(delivery_method);

-- Verify indexes exist
\d transactions
```

**Cause 15B: N+1 Query Problem**

```typescript
// Bad: N+1 queries
const transactions = await db.query('SELECT * FROM transactions');
for (const tx of transactions) {
  const analytics = await db.query('SELECT * FROM analytics WHERE transaction_id = $1', [tx.id]);
}

// Good: Join query
const transactions = await db.query(`
  SELECT t.*, a.*
  FROM transactions t
  LEFT JOIN analytics a ON t.id = a.transaction_id
`);
```

**Cause 15C: Missing Redis Cache**

```typescript
// Check if Redis is being used
// Backend should log cache hits:
console.log('Cache hit:', key);

// If no cache hits, verify Redis connection:
const isConnected = await redisClient.ping();
console.log('Redis connected:', isConnected === 'PONG');
```

---

### Issue 16: Slow Frontend Load Time

**Symptom**: Lighthouse Performance score < 50, page takes > 5s to load

**Solutions**:

**Solution 16A: Optimize Images**

```typescript
// Use Next.js Image component
import Image from 'next/image';

// Bad: <img> tag (no optimization)
<img src="/logo.png" alt="Logo" />

// Good: Next.js Image (automatic optimization)
<Image src="/logo.png" alt="Logo" width={200} height={50} />
```

**Solution 16B: Code Splitting**

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

// Bad: Import synchronously (blocks page load)
import HeavyChart from '@/components/HeavyChart';

// Good: Dynamic import (loads on demand)
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Disable server-side rendering if not needed
});
```

**Solution 16C: Reduce Bundle Size**

```bash
# Analyze bundle
npm run build -- --analyze

# Remove unused dependencies
npm prune

# Replace large libraries with smaller alternatives
# Example: date-fns instead of moment.js
npm uninstall moment
npm install date-fns
```

---

## Build & Deployment Failures

### Issue 17: Railway Build Timeout

**Symptom**: `Build exceeded maximum time limit`

**Solution**:

```bash
# Reduce build time by:
# 1. Using cache effectively
# 2. Reducing dependencies
# 3. Optimizing TypeScript config

# tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true, // Skip type checking node_modules (faster)
    "incremental": true, // Enable incremental builds
  }
}

# Or upgrade Railway plan (more build resources)
```

---

### Issue 18: Vercel Build Exceeds Size Limit

**Symptom**: `Error: Function size exceeds the maximum limit`

**Solution**:

```typescript
// next.config.ts
const nextConfig = {
  // Disable source maps (reduces size)
  productionBrowserSourceMaps: false,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Output standalone mode (smaller)
  output: 'standalone',
};
```

---

## Emergency Recovery

### Emergency: Complete Backend Failure

**If Railway backend is completely down and you can't fix it quickly**:

**Option 1: Rollback to Previous Deployment**

```bash
# Via Railway Dashboard
# Deployments → Click previous working deployment → "Redeploy"

# Via CLI
railway redeploy [deployment-id]
```

**Option 2: Deploy to Alternative Platform**

```bash
# Quick deploy to Render.com (Railway alternative)
# 1. Sign up at render.com
# 2. New → Web Service
# 3. Connect GitHub repo
# 4. Root directory: src/backend
# 5. Build command: npm run build
# 6. Start command: npm start
# 7. Add all env vars
# 8. Deploy

# Then update frontend NEXT_PUBLIC_API_URL to new URL
```

---

### Emergency: Complete Frontend Failure

**If Vercel is down**:

**Option 1: Rollback Deployment**

```bash
# Via Vercel Dashboard
# Deployments → Click previous working deployment → "Promote to Production"

# Via CLI
vercel rollback [deployment-url]
```

**Option 2: Deploy Locally via Vercel CLI**

```bash
cd src/frontend
vercel --prod --force
# Force redeploy from your local machine
```

---

## Getting Help

### Before Asking for Help

Gather this information:

1. **Error Message**: Copy exact error from logs
2. **Steps to Reproduce**: What did you do before error occurred?
3. **Environment**: Production, Preview, or Local?
4. **Recent Changes**: What was deployed recently?
5. **Logs**: Copy relevant logs (Railway/Vercel)

### Support Channels

- **Railway Discord**: https://discord.gg/railway
- **Vercel Discord**: https://vercel.com/discord
- **Stack Overflow**: Tag with `railway`, `vercel`, `nextjs`
- **GitHub Issues**: Create issue in your repo with full details

---

## Checklist: Before Submitting to Hackathon

If production is broken, **DO NOT SUBMIT**. Fix critical issues first:

- ✅ Backend `/health` returns 200 OK
- ✅ Frontend loads without errors
- ✅ Database connection working
- ✅ Gateway API integration working
- ✅ At least 1 test transaction succeeded
- ✅ No CORS errors
- ✅ WebSocket connects (if implemented)
- ✅ Lighthouse Performance > 70

**If any critical issue remains**, use troubleshooting steps above or rollback to last working version.

---

**Last Updated**: October 21, 2025

**Remember**: Most deployment issues are environment variable misconfigurations or CORS problems. Check those first!

**May Allah grant sabr and success in resolving all issues! Bismillah!**
