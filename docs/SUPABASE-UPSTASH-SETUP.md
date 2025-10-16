# Supabase + Upstash Setup Guide
## FREE PostgreSQL + Redis for Gateway Insights

**Time Required**: 10 minutes total
**Cost**: $0 (completely free, no credit card needed)

---

## Part 1: Supabase Setup (PostgreSQL) - 5 minutes

### Step 1: Create Supabase Account (2 minutes)

1. **Visit**: https://supabase.com
2. **Click**: "Start your project" (green button)
3. **Sign up with GitHub**:
   - Click "Continue with GitHub"
   - Authorize Supabase to access your GitHub account
   - ✅ No email verification needed with GitHub!

---

### Step 2: Create New Project (2 minutes)

1. **Click**: "New project" (or it might auto-prompt you)
2. **Fill in the form**:
   - **Name**: `gateway-insights`
   - **Database Password**: Click "Generate a password"
     - ⚠️ **IMPORTANT**: Copy this password immediately and save it somewhere safe!
   - **Region**: Choose closest to you (e.g., "US West" if you're in USA)
   - **Pricing Plan**: Make sure "Free" is selected
3. **Click**: "Create new project"
4. **Wait**: ~2 minutes for database to provision (you'll see a progress indicator)

---

### Step 3: Get Database Connection String (1 minute)

Once your project is ready:

1. **Click**: "Connect" button (top right) OR go to Settings → Database
2. **Look for**: "Connection string" section
3. **Select**: "URI" tab (NOT "Connection pooling")
4. **Copy the entire connection string**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. **Replace `[YOUR-PASSWORD]`** with the password you generated earlier

**Example**:
```
postgresql://postgres:mySecretPass123@db.abcdefgh.supabase.co:5432/postgres
```

✅ **Save this URL** - you'll need it in a moment!

---

## Part 2: Upstash Setup (Redis) - 5 minutes

### Step 1: Create Upstash Account (2 minutes)

1. **Visit**: https://upstash.com
2. **Click**: "Get Started" or "Sign Up"
3. **Sign up with GitHub**:
   - Click "Continue with GitHub"
   - Authorize Upstash
   - ✅ No credit card required!

---

### Step 2: Create Redis Database (2 minutes)

1. You'll land on the **Console** page
2. **Click**: "Create database" (big green button)
3. **Fill in the form**:
   - **Name**: `gateway-insights-redis`
   - **Type**: Select "Regional" (free tier)
   - **Region**: Choose same region as Supabase if possible (e.g., "us-west-1")
   - **Eviction**: Leave default
4. **Click**: "Create"
5. **Wait**: ~10 seconds (much faster than Supabase!)

---

### Step 3: Get Redis Connection String (1 minute)

1. Your database should now be created and you're viewing its details
2. **Scroll down** to "REST API" section OR click ".env" tab
3. **Find** and **copy** the `REDIS_URL`:
   ```
   redis://default:xxxxxxxxxxxxx@usw1-redis.upstash.io:6379
   ```

**Alternative location** (if you don't see .env tab):
- Click "Details" tab
- Look for "Endpoint" section
- Copy the full Redis URL

✅ **Save this URL** - you'll need it next!

---

## Part 3: Update Your .env File (2 minutes)

Now let's add both connection strings to your project:

### Step 1: Open .env file

Open this file in your editor:
```
/Users/rz/local-dev/sanctum-gateway-track/src/backend/.env
```

If it doesn't exist, create it!

---

### Step 2: Add Database URLs

Add these lines (replace with YOUR actual URLs from above):

```bash
# Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:YOUR-PASSWORD@db.xxxxx.supabase.co:5432/postgres

# Upstash Redis
REDIS_URL=redis://default:xxxxxxxxxxxxx@usw1-redis.upstash.io:6379

# Existing Gateway Config (keep these)
GATEWAY_API_KEY=***GATEWAY_API_KEY_REDACTED***
GATEWAY_BASE_URL=https://tpg.sanctum.so/v1/mainnet
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta
```

---

### Step 3: Save the file

**Important**:
- ✅ Make sure there are NO spaces around the `=` sign
- ✅ No quotes around the URLs
- ✅ File is saved

---

## Part 4: Test Your Setup! (2 minutes)

Let's verify everything works:

### Step 1: Navigate to backend directory

```bash
cd /Users/rz/local-dev/sanctum-gateway-track/src/backend
```

---

### Step 2: Test database connections

```bash
npm run db:test
```

**Expected Output** (if successful):
```
🧪 Testing Database Connections...
============================================================

✅ PostgreSQL connected successfully!
   Server time: 2025-10-12 22:15:30...
🔄 Redis: Connecting...
✅ Redis: Connected and ready!

📊 Health Check Results:

PostgreSQL: ✅ Connected
Redis:      ✅ Connected
Overall:    ✅ Healthy

📝 Testing PostgreSQL query...
   PostgreSQL version: PostgreSQL 15.x on x86_64-pc-linux-gnu...

📝 Testing Redis operations...
   Redis GET test: Hello Gateway Insights!
   Redis DEL test: ✅

✅ All tests passed!
============================================================
```

---

### Step 3: Run database migrations

```bash
npm run db:migrate
```

**Expected Output**:
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

### Step 4: Verify migration status

```bash
npm run db:migrate:status
```

**Expected Output**:
```
📊 Migration Status

Executed migrations: 1
  ✅ 001_create_transactions_table.sql

Pending migrations: 0

✅ Database is up to date!
```

---

## ✅ Success Checklist

You should now have:

- [x] Supabase account created
- [x] PostgreSQL database running on Supabase
- [x] Upstash account created
- [x] Redis database running on Upstash
- [x] Both URLs added to `.env` file
- [x] Connection test passing (`npm run db:test`)
- [x] Migrations executed successfully
- [x] `transactions` table created in database

---

## 🎉 Congratulations!

Your database infrastructure is **100% ready**! You now have:

✅ **PostgreSQL** for permanent data storage (Supabase)
✅ **Redis** for fast caching (Upstash)
✅ **Zero cost** - both completely free!
✅ **Production-ready** - no changes needed for deployment!

---

## 🆘 Troubleshooting

### ❌ PostgreSQL Connection Failed

**Error**: `connection to server at "db.xxxxx.supabase.co" failed`

**Solutions**:
1. Double-check `DATABASE_URL` in `.env` matches Supabase exactly
2. Ensure you replaced `[YOUR-PASSWORD]` with actual password
3. Check Supabase project status (must be "Active" not "Paused")
4. Try regenerating connection string from Supabase dashboard

---

### ❌ Redis Connection Failed

**Error**: `Redis connection failed`

**Solutions**:
1. Verify `REDIS_URL` is correct in `.env`
2. Check Upstash database status (should show "Active")
3. Ensure no firewall blocking port 6379
4. Try copying URL again from Upstash dashboard

---

### ❌ Migration Failed

**Error**: `Migration 001_create_transactions_table.sql failed`

**Solutions**:
1. First ensure PostgreSQL connection works (`npm run db:test`)
2. Check if table already exists (try migration status first)
3. Verify you're using PostgreSQL 14+ (Supabase uses 15)
4. Check Supabase logs in dashboard for detailed error

---

### ❌ Password Contains Special Characters

If your Supabase password has special characters (`@`, `#`, `/`, etc.), you need to URL-encode them:

**Example**:
- Password: `myPass@123#`
- Encoded: `myPass%40123%23`

Use this tool: https://www.urlencoder.org/

---

## 🎯 Next Steps

Once all tests pass, you're ready for:

✅ **Task 2.1.5**: Create TypeScript data models and DAL
✅ **Story 2.2**: Transaction event tracking
✅ **Story 2.3**: Analytics API development

---

**🚀 Let me know when all tests pass and we'll continue building!**
