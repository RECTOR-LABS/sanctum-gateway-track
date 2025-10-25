# Next Steps: Complete Railway Setup

Bismillah! Here's what you need to do to complete the database setup:

---

## ✅ What's Already Done

- ✅ Database schema designed (`docs/DATABASE-SCHEMA.md`)
- ✅ Database configuration created (`src/backend/database/config.ts`)
- ✅ Migration files created (`src/backend/database/migrations/001_create_transactions_table.sql`)
- ✅ Migration runner built (`src/backend/database/migrate.ts`)
- ✅ Connection test script ready (`src/backend/database/test-connection.ts`)
- ✅ npm scripts added to package.json

---

## 🚀 What You Need to Do Now

### Step 1: Create Railway Account & Database (5-10 minutes)

1. **Visit Railway**: https://railway.app
2. **Sign up** with your GitHub account
3. **Create New Project**
4. **Add PostgreSQL**:
   - Click "New Project" → "Deploy PostgreSQL"
   - Wait for provisioning (~1-2 minutes)
5. **Add Redis**:
   - In your project, click "+ New"
   - Select "Database" → "Add Redis"
   - Wait for provisioning (~1 minute)

---

### Step 2: Copy Environment Variables (2 minutes)

1. **Click on PostgreSQL service** in Railway dashboard
2. Go to **"Variables"** tab
3. **Copy** these variables:
   - `DATABASE_URL` (entire connection string)

4. **Click on Redis service** in Railway dashboard
5. Go to **"Variables"** tab
6. **Copy**:
   - `REDIS_URL` (entire connection string)

---

### Step 3: Update .env File (1 minute)

Open `/Users/rz/local-dev/sanctum-gateway-track/src/backend/.env` and add:

```bash
# Railway PostgreSQL
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/railway

# Railway Redis
REDIS_URL=redis://default:PASSWORD@HOST:PORT

# Existing Gateway Config (keep these)
GATEWAY_API_KEY=your_gateway_api_key_here
GATEWAY_BASE_URL=https://tpg.sanctum.so/v1/mainnet
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta
```

**Replace** `PASSWORD`, `HOST`, `PORT` with actual values from Railway dashboard.

---

### Step 4: Test Database Connection (1 minute)

Run this command from `/Users/rz/local-dev/sanctum-gateway-track/src/backend`:

```bash
npm run db:test
```

**Expected Output:**
```
🧪 Testing Database Connections...
============================================================

✅ PostgreSQL connected successfully!
   Server time: 2025-10-12 21:30:45...
🔄 Redis: Connecting...
✅ Redis: Connected and ready!

📊 Health Check Results:

PostgreSQL: ✅ Connected
Redis:      ✅ Connected
Overall:    ✅ Healthy

📝 Testing PostgreSQL query...
   PostgreSQL version: PostgreSQL 14.x...
📝 Testing Redis operations...
   Redis GET test: Hello Gateway Insights!
   Redis DEL test: ✅

✅ All tests passed!
```

---

### Step 5: Run Database Migrations (1 minute)

```bash
npm run db:migrate
```

**Expected Output:**
```
🚀 Starting database migrations...

✅ Migrations tracking table ready
📊 Executed migrations: 0
📋 Pending migrations: 1
   - 001_create_transactions_table.sql

📝 Executing migration: 001_create_transactions_table.sql
✅ Migration 001_create_transactions_table.sql completed successfully

✅ Migrations complete! (1/1 successful)
```

---

### Step 6: Verify Migration Status (30 seconds)

```bash
npm run db:migrate:status
```

**Expected Output:**
```
📊 Migration Status

Executed migrations: 1
  ✅ 001_create_transactions_table.sql

Pending migrations: 0

✅ Database is up to date!
```

---

## ✅ Success Checklist

Once all steps complete, you should have:

- [x] Railway PostgreSQL database running
- [x] Railway Redis instance running
- [x] Environment variables configured in .env
- [x] Database connection test passing
- [x] Migrations executed successfully
- [x] `transactions` table created

---

## 🆘 Troubleshooting

### Connection Test Fails

**Error**: `❌ PostgreSQL connection failed`

**Fix**:
1. Double-check `DATABASE_URL` in `.env` matches Railway exactly
2. Ensure Railway PostgreSQL service is running (green in dashboard)
3. Check firewall/network isn't blocking connections

---

### Redis Connection Fails

**Error**: `❌ Redis connection failed`

**Fix**:
1. Double-check `REDIS_URL` in `.env`
2. Ensure Railway Redis service is running
3. Try restarting Redis service in Railway dashboard

---

### Migration Fails

**Error**: `Migration 001_create_transactions_table.sql failed`

**Fix**:
1. Check PostgreSQL connection is working (`npm run db:test`)
2. Verify you have the latest migration file
3. Try manual connection via Railway dashboard "Query" tab
4. Check migration SQL syntax

---

## 🎯 Once Complete

When all tests pass, let me know and I'll continue with:

✅ **Task 2.1.5**: Create data models and DAL (TypeScript interfaces + database access layer)

Then we'll move on to **Story 2.2**: Transaction Event Tracking!

---

**Bismillah! Let me know when Railway is set up and tests are passing!** 🚀
