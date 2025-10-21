# Railway Backend Deployment Guide

**Gateway Insights - Sanctum Gateway Track**

Complete step-by-step guide for deploying the Gateway Insights backend to Railway.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Railway Project Setup](#railway-project-setup)
3. [Database Configuration](#database-configuration)
4. [Environment Variables](#environment-variables)
5. [Build Configuration](#build-configuration)
6. [Deployment](#deployment)
7. [Health Checks & Verification](#health-checks--verification)
8. [Monitoring & Logs](#monitoring--logs)
9. [Custom Domain (Optional)](#custom-domain-optional)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ [Railway account](https://railway.app/) (GitHub sign-in recommended)
- ✅ [Supabase account](https://supabase.com/) (PostgreSQL database)
- ✅ [Upstash account](https://upstash.com/) (Redis cache)
- ✅ [Sanctum Gateway API key](https://gateway.sanctum.so/)

### Required Tools
```bash
# Railway CLI (optional but recommended)
npm install -g @railway/cli

# Verify installation
railway --version
```

### Required Information
Before starting, gather:
- ✅ Supabase DATABASE_URL (from Supabase dashboard → Settings → Database)
- ✅ Upstash REDIS_URL (from Upstash dashboard → Redis → Details)
- ✅ Sanctum Gateway API key (from Gateway dashboard)
- ✅ GitHub repository URL (this project)

---

## Railway Project Setup

### Step 1: Create New Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select **`sanctum-gateway-track`** repository
6. Click **"Deploy Now"**

**Expected Result**: Railway creates a new project and attempts initial deployment (will fail due to missing env vars - this is expected).

### Step 2: Configure Root Directory

By default, Railway deploys from the repository root. We need to configure it to deploy from `src/backend`:

1. In Railway project dashboard, click on your service
2. Go to **Settings** tab
3. Scroll to **"Source"** section
4. Set **Root Directory** to: `src/backend`
5. Click **"Save"**

**Expected Result**: Railway will now use `src/backend` as the deployment root.

### Step 3: Configure Start Command

Railway needs to know how to start the application:

1. Still in **Settings** tab
2. Scroll to **"Deploy"** section
3. Set **Start Command** to: `npm start`
4. Set **Build Command** to: `npm run build`
5. Click **"Save"**

**Expected Result**: Railway will run `npm run build` during deployment and `npm start` to run the app.

---

## Database Configuration

### Option A: Use Existing Supabase (Recommended)

If you already have Supabase configured (as per `docs/setup/SUPABASE-UPSTASH-SETUP.md`):

1. Copy your **DATABASE_URL** from Supabase:
   - Go to Supabase Dashboard → Settings → Database
   - Copy **Connection String** (Pooler mode recommended for production)
   - Format: `postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

2. Copy your **REDIS_URL** from Upstash:
   - Go to Upstash Dashboard → Redis → Details
   - Copy **REDIS_URL**
   - Format: `redis://default:[password]@us1-[name]-12345.upstash.io:6379`

**Skip to [Environment Variables](#environment-variables) section.**

### Option B: Railway PostgreSQL (Alternative)

If you want to use Railway's managed PostgreSQL:

1. In Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway provisions a PostgreSQL database
4. Click on the PostgreSQL service
5. Go to **"Variables"** tab
6. Copy the **DATABASE_URL** value

**Note**: You'll still need Upstash Redis from Option A above.

### Database Migration

After deployment, you need to run migrations:

```bash
# Using Railway CLI (recommended)
railway login
railway link  # Select your project
railway run npm run db:migrate

# Or manually via Railway dashboard
# 1. Go to your service → Settings → Deploy
# 2. Add "Deploy Command": npm run db:migrate
# 3. This runs migrations on every deploy
```

---

## Environment Variables

### Step 1: Access Variables Tab

1. In Railway project dashboard, click on your **backend service**
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**

### Step 2: Add Required Variables

Add the following environment variables one by one:

#### Core Application Settings

```bash
# Node Environment
NODE_ENV=production

# Server Port (Railway auto-assigns PORT, but we can set default)
PORT=3001
```

#### Sanctum Gateway Configuration

```bash
# Gateway API Key (from gateway.sanctum.so)
GATEWAY_API_KEY=your_gateway_api_key_here

# Gateway API URL (production)
GATEWAY_API_URL=https://gateway.sanctum.so/v1
```

#### Solana Configuration

```bash
# Solana RPC URL (use reliable provider)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Or use Helius/QuickNode for better reliability:
# SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
# SOLANA_RPC_URL=https://dimensional-purple-night.solana-mainnet.quiknode.pro/YOUR_KEY/

# Network
SOLANA_NETWORK=mainnet-beta
```

#### Database Configuration

```bash
# PostgreSQL (from Supabase or Railway PostgreSQL)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Redis (from Upstash)
REDIS_URL=redis://default:[password]@us1-[name]-12345.upstash.io:6379
```

#### CORS Configuration

```bash
# Frontend URL (will update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app

# Or during testing, allow all origins:
# CORS_ORIGIN=*
```

#### Optional: Monitoring & Logging

```bash
# Log level
LOG_LEVEL=info

# Optional: Add monitoring service URLs
# SENTRY_DSN=https://...
# DATADOG_API_KEY=...
```

### Step 3: Verify Variables

After adding all variables:

1. Click **"Deploy"** to trigger redeployment
2. Railway will rebuild with new environment variables

**Expected Result**: Deployment should succeed if all variables are correct.

---

## Build Configuration

### Verify package.json Scripts

Ensure `src/backend/package.json` has correct scripts:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch index.ts",
    "db:migrate": "tsx database/migrate.ts",
    "db:test": "tsx database/test-connection.ts",
    "type-check": "tsc --noEmit"
  }
}
```

### TypeScript Configuration

Verify `src/backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Build Process

Railway automatically runs:

1. **Install**: `npm install` (installs dependencies)
2. **Build**: `npm run build` (compiles TypeScript → JavaScript)
3. **Start**: `npm start` (runs compiled code from `dist/`)

**Build Output**: Check Railway logs to verify successful compilation:

```
[Build] > npm run build
[Build] > tsc
[Build] Build completed successfully
[Deploy] > npm start
[Deploy] > node dist/index.js
[Deploy] Server listening on port 3001
```

---

## Deployment

### Step 1: Trigger Deployment

Railway automatically deploys on:
- ✅ Git push to `main` branch (or configured branch)
- ✅ Manual "Deploy" button click
- ✅ Environment variable changes

**Manual Deployment**:
1. Go to Railway project dashboard
2. Click on your service
3. Click **"Deploy"** button (top right)

### Step 2: Monitor Deployment

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Watch the build logs in real-time

**Deployment Stages**:
```
1. Building... (2-3 minutes)
   - Cloning repository
   - Installing dependencies
   - Running build command

2. Deploying... (30 seconds)
   - Creating container
   - Starting application
   - Health checks

3. Active (green checkmark)
   - Deployment successful
   - Application running
```

### Step 3: Get Production URL

Once deployed:

1. Go to **"Settings"** tab
2. Scroll to **"Domains"** section
3. Railway auto-generates a domain: `your-app-production.up.railway.app`
4. Copy this URL

**Expected Result**: Your backend API is now live at `https://your-app-production.up.railway.app`

---

## Health Checks & Verification

### Step 1: Test API Health Endpoint

```bash
# Replace with your Railway URL
curl https://your-app-production.up.railway.app/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-10-21T10:00:00.000Z",
  "uptime": 123.456,
  "database": "connected",
  "redis": "connected"
}
```

### Step 2: Test Database Connection

```bash
curl https://your-app-production.up.railway.app/api/health/db

# Expected response:
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

### Step 3: Test Gateway Integration

```bash
curl https://your-app-production.up.railway.app/api/gateway/health

# Expected response:
{
  "gateway": "configured",
  "apiKey": "present",
  "network": "mainnet-beta"
}
```

### Step 4: Verify WebSocket Connection

```bash
# Using wscat (install: npm install -g wscat)
wscat -c wss://your-app-production.up.railway.app

# You should see: Connected (press CTRL+C to quit)
```

### Common Issues

If health checks fail:

1. **Database connection failed**:
   - Verify `DATABASE_URL` is correct
   - Check Supabase IP allowlist (should allow all IPs for Railway)
   - Check Railway logs for connection errors

2. **Redis connection failed**:
   - Verify `REDIS_URL` format
   - Ensure Upstash Redis is active
   - Check Upstash dashboard for connection attempts

3. **Gateway not configured**:
   - Verify `GATEWAY_API_KEY` is set
   - Check key is valid on gateway.sanctum.so

---

## Monitoring & Logs

### Real-time Logs

1. Go to Railway project dashboard
2. Click on your service
3. Go to **"Logs"** tab
4. View real-time application logs

**Log Levels**:
- `INFO`: Normal operations
- `WARN`: Non-critical issues
- `ERROR`: Critical errors requiring attention

### Key Metrics to Monitor

Railway provides built-in metrics:

1. Go to **"Metrics"** tab
2. Monitor:
   - **CPU Usage**: Should stay < 80%
   - **Memory Usage**: Should stay < 512MB (Railway free tier)
   - **Network**: Request/response rates
   - **Crash Counts**: Should be 0

### Set Up Alerts (Optional)

1. Go to **"Settings"** → **"Integrations"**
2. Add webhook for deployment notifications
3. Configure Slack/Discord alerts

**Example Webhook**:
```bash
# Slack webhook
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"Backend deployed successfully to Railway!"}'
```

---

## Custom Domain (Optional)

### Add Custom Domain

1. Go to **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"+ Add Domain"**
4. Enter your domain: `api.yourdomain.com`

### Configure DNS

Add CNAME record in your DNS provider:

```
Type:  CNAME
Name:  api
Value: your-app-production.up.railway.app
TTL:   3600
```

### SSL Certificate

Railway automatically provisions SSL certificates via Let's Encrypt:
- ✅ Takes 5-10 minutes after DNS propagation
- ✅ Auto-renews every 90 days
- ✅ Forces HTTPS redirect

**Verification**:
```bash
curl https://api.yourdomain.com/health
```

---

## Troubleshooting

### Deployment Failed

**Error**: `Build failed: Command "npm run build" exited with code 1`

**Solution**:
```bash
# Locally test the build
cd src/backend
npm run build

# Fix TypeScript errors
npm run type-check

# Commit fixes and redeploy
```

---

### Application Crashes on Start

**Error**: `Application crashed during startup`

**Check Logs**:
1. Go to Railway dashboard → Logs
2. Look for error messages in startup logs

**Common Causes**:
- Missing environment variable
- Database connection failure
- Port binding issue

**Solution**:
```bash
# Verify all env vars are set
railway variables

# Test locally with production env
cp .env.production .env
npm start

# Check database connectivity
npm run db:test
```

---

### Database Migration Errors

**Error**: `Migration failed: relation "transactions" already exists`

**Solution**:
```bash
# Check current migration status
railway run npm run db:migrate:status

# If migrations are already applied, skip
# If not, run manually:
railway run npm run db:migrate
```

---

### High Memory Usage

**Error**: Memory usage exceeds Railway limits

**Railway Free Tier**: 512MB RAM
**Railway Pro**: Up to 8GB RAM

**Solutions**:

1. **Optimize Database Queries**:
```typescript
// Bad: Loads all records into memory
const allTransactions = await transactionDal.getAllTransactions();

// Good: Use pagination
const transactions = await transactionDal.getTransactions({
  limit: 100,
  offset: 0
});
```

2. **Upgrade Railway Plan**:
   - Go to Settings → Plan
   - Upgrade to Pro for more resources

---

### CORS Errors

**Error**: Frontend cannot connect to backend

**Solution**:

1. Update `FRONTEND_URL` env var:
```bash
# In Railway dashboard → Variables
FRONTEND_URL=https://your-app.vercel.app
```

2. Or allow all origins temporarily:
```bash
CORS_ORIGIN=*
```

3. Verify CORS configuration in code:
```typescript
// src/backend/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

---

### WebSocket Connection Failed

**Error**: `WebSocket connection failed: 502 Bad Gateway`

**Solution**:

Railway requires WebSocket support to be enabled:

1. Check Railway docs: WebSocket is supported by default
2. Verify client connection URL uses `wss://` (not `ws://`)
3. Check firewall/proxy settings

```typescript
// Frontend WebSocket client
const ws = new WebSocket('wss://your-app-production.up.railway.app');
```

---

## Performance Optimization

### Enable Caching Headers

```typescript
// Add to Express middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api/analytics')) {
    res.set('Cache-Control', 'public, max-age=60'); // 1 minute cache
  }
  next();
});
```

### Connection Pooling

PostgreSQL connection pool is already configured:

```typescript
// src/backend/database/config.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum 20 connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Redis Caching

Already implemented for frequently accessed data:

```typescript
// Transaction lookups cached for 5 minutes
await redisClient.setex(`transaction:${signature}`, 300, JSON.stringify(data));
```

---

## Cost Optimization

### Railway Pricing (as of 2025)

- **Free Tier**: $0/month
  - 512MB RAM
  - 1GB Disk
  - 100GB Network

- **Pro Tier**: $5/month per service
  - Up to 8GB RAM
  - 100GB Disk
  - Unlimited Network

### Recommendations

**For Development/Testing**: Use Free tier
**For Production**: Consider Pro tier for:
- Better reliability
- More resources
- Priority support

### Alternative Cost Savings

1. **Use Supabase Free Tier** (500MB database, 1GB transfer)
2. **Use Upstash Free Tier** (10,000 commands/day)
3. **Optimize database queries** (reduce billable operations)

---

## Security Checklist

Before going to production:

- ✅ All environment variables are set via Railway dashboard (not hardcoded)
- ✅ Database credentials are secure and rotated regularly
- ✅ CORS is configured to allow only frontend domain
- ✅ Rate limiting is enabled (TODO: implement in Epic 5)
- ✅ Input validation is implemented on all endpoints
- ✅ API authentication is implemented (if required)
- ✅ Secrets are not exposed in logs
- ✅ HTTPS is enforced (Railway does this automatically)

---

## Next Steps

After successful Railway deployment:

1. ✅ **Note your production URL**: `https://your-app-production.up.railway.app`
2. ⏳ **Deploy Frontend to Vercel** (see `VERCEL-DEPLOYMENT.md`)
3. ⏳ **Update frontend API URL** with Railway backend URL
4. ⏳ **Run post-deployment tests** (see `POST-DEPLOYMENT-CHECKLIST.md`)
5. ⏳ **Monitor logs** for first 24 hours
6. ⏳ **Set up custom domain** (optional)

---

## Support & Resources

- **Railway Docs**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app/
- **Project Issues**: https://github.com/yourusername/sanctum-gateway-track/issues

---

**Deployment Status**: ⏳ Ready to Deploy

**Estimated Time**: 30-45 minutes (first deployment)

**Last Updated**: October 21, 2025

---

**May this deployment bring barakah to the project! Tawakkul ala Allah!**
