# External Cloud Service Dependencies

**Date:** October 25, 2025
**Question:** Does the backend rely on other cloud services or fully run on local server?
**Answer:** ⚠️ **Backend relies on MULTIPLE external cloud services**

---

## 🌐 External Services Required

### 1. **Supabase PostgreSQL** (Database)
**Status:** ☁️ **CLOUD REQUIRED**

**Details:**
- **Service:** Supabase (PostgreSQL cloud database)
- **Endpoint:** `db.wumcwrbczmpdxexjncea.supabase.co:5432`
- **Purpose:** Stores all transaction data, analytics
- **Connection:** `postgresql://postgres:***@db.wumcwrbczmpdxexjncea.supabase.co:5432/postgres`
- **Used By:** All analytics queries, transaction storage

**Can Run Locally?**
- ✅ YES - Can replace with local PostgreSQL
- Change `DATABASE_URL` to `postgresql://localhost:5432/gateway_insights`
- Install PostgreSQL locally
- Run migrations: `npm run db:migrate`

**Required Tables:**
- `transactions` - Main transaction data
- Schema defined in: `src/backend/database/migrations/001_create_transactions_table.sql`

---

### 2. **Upstash Redis** (Cache)
**Status:** ☁️ **CLOUD REQUIRED**

**Details:**
- **Service:** Upstash (Redis cloud cache)
- **Endpoint:** `grateful-mollusk-23052.upstash.io:6379`
- **Purpose:** Real-time caching, session data
- **Connection:** `rediss://default:***@grateful-mollusk-23052.upstash.io:6379`
- **Used By:** Transaction caching, real-time updates

**Can Run Locally?**
- ✅ YES - Can replace with local Redis
- Install Redis: `brew install redis` (macOS) or `apt-get install redis` (Linux)
- Start: `redis-server`
- Change `REDIS_URL` to `redis://localhost:6379`

**Alternative:**
- Can run WITHOUT Redis (fallback to database only)
- Performance impact: Slower real-time updates
- No data loss - just caching layer

---

### 3. **Sanctum Gateway API** (Core Service)
**Status:** ☁️ **CLOUD REQUIRED - NO LOCAL ALTERNATIVE**

**Details:**
- **Service:** Sanctum Gateway (Third-party API)
- **Endpoint:** `https://tpg.sanctum.so/v1/mainnet`
- **Purpose:** Build and send Solana transactions via Gateway
- **API Key Required:** `YOUR_GATEWAY_API_KEY`
- **Used By:** Core transaction submission logic

**Endpoints Used:**
- `POST /buildGatewayTransaction` - Build transaction via Gateway
- `POST /sendTransaction` - Send transaction to Solana network

**Can Run Locally?**
- ❌ **NO** - This is Sanctum's proprietary cloud service
- **MANDATORY** for this hackathon (project requirement)
- Without Gateway API, the entire app loses its purpose

**Dependency Level:** CRITICAL

---

### 4. **Solana Mainnet RPC** (Blockchain)
**Status:** ☁️ **CLOUD REQUIRED**

**Details:**
- **Service:** Solana Public RPC
- **Endpoint:** `https://api.mainnet-beta.solana.com`
- **Purpose:** Read blockchain data, query account balances
- **Used By:** Transaction confirmation checks, balance queries

**Can Run Locally?**
- ⚠️ **TECHNICALLY YES** but not practical
- Would need to run full Solana validator node (resource-intensive)
- Requires: 1TB+ disk, 128GB+ RAM, high bandwidth

**Alternative:**
- Use different RPC providers:
  - Helius: `https://rpc.helius.xyz`
  - QuickNode: `https://quicknode.com`
  - Triton: `https://triton.one`
  - Alchemy: `https://alchemy.com`
- All are cloud services

**Recommended:** Stick with public RPC or Gateway's RPC

---

## 📊 Dependency Matrix

| Service | Type | Required? | Local Alternative? | Impact if Down |
|---------|------|-----------|-------------------|----------------|
| **Supabase PostgreSQL** | Database | ✅ Required | ✅ Yes (Local PG) | App won't start |
| **Upstash Redis** | Cache | 🟡 Optional | ✅ Yes (Local Redis) | Slower performance |
| **Sanctum Gateway API** | Core Service | ✅ **MANDATORY** | ❌ No | App is useless |
| **Solana RPC** | Blockchain | ✅ Required | ⚠️ Impractical | Can't read chain data |

---

## 🏠 Can This Run Fully Local?

### Short Answer: **NO** (Without Sacrificing Core Features)

### Why Not:
1. **Sanctum Gateway API** is cloud-only (and the entire point of the hackathon)
2. **Solana blockchain** is a distributed network (local node impractical)

### What CAN Be Local:
- ✅ Backend Node.js server (runs on localhost:3001)
- ✅ Frontend Next.js app (runs on localhost:3000)
- ✅ PostgreSQL database (can install locally)
- ✅ Redis cache (can install locally)

### What MUST Be Cloud:
- ❌ Sanctum Gateway API (proprietary service)
- ❌ Solana network (distributed blockchain)

---

## 🚀 Deployment Options

### Option 1: Hybrid (Recommended)
**App Server:** Railway/Render (cloud)
**Database:** Supabase (cloud)
**Cache:** Upstash (cloud)
**Gateway API:** Sanctum (cloud)
**Solana RPC:** Public (cloud)

**Pros:**
- ✅ Easy deployment
- ✅ Scalable
- ✅ Managed services
- ✅ Free tiers available

**Cons:**
- ⚠️ Dependent on multiple cloud providers
- ⚠️ Internet required

---

### Option 2: Self-Hosted Database
**App Server:** Your VPS/server
**Database:** Local PostgreSQL
**Cache:** Local Redis
**Gateway API:** Sanctum (cloud) - **MUST**
**Solana RPC:** Public (cloud)

**Pros:**
- ✅ More control over data
- ✅ Lower cost (free database)

**Cons:**
- ⚠️ You manage backups
- ⚠️ Still requires internet for Gateway API

---

### Option 3: Local Development Only
**App Server:** localhost:3001
**Database:** localhost:5432 (PostgreSQL)
**Cache:** localhost:6379 (Redis)
**Gateway API:** Sanctum cloud (still required)
**Solana RPC:** Solana cloud (still required)

**Use Case:** Development/testing only
**Limitation:** Can't serve public users

---

## 💡 Key Insights

### 1. Gateway API is Non-Negotiable
This is a **Sanctum Gateway Track hackathon project**. The entire value proposition is:
- "Build apps that leverage Sanctum's Gateway API"
- Without Gateway API, there's no project

**Conclusion:** Cloud dependency on Gateway is INTENTIONAL and REQUIRED.

---

### 2. Database/Redis Can Be Local
For development or self-hosting, you CAN run:
- PostgreSQL locally
- Redis locally

But for production, managed services (Supabase/Upstash) are easier.

---

### 3. Solana Network is Always External
Solana is a blockchain - it's decentralized and distributed. You always access it via RPC endpoints (cloud services).

---

## 🔧 Setup for Different Scenarios

### Scenario A: Full Cloud (Current Setup)
**No changes needed**

Current `.env`:
```env
DATABASE_URL=postgresql://postgres:***@db.wumcwrbczmpdxexjncea.supabase.co:5432/postgres
REDIS_URL=rediss://default:***@grateful-mollusk-23052.upstash.io:6379
GATEWAY_RPC_URL=https://tpg.sanctum.so/v1/mainnet?apiKey=***
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

**Status:** ✅ Ready to deploy

---

### Scenario B: Local Database + Cloud Services
**Change `.env` to:**

```env
# Local PostgreSQL
DATABASE_URL=postgresql://localhost:5432/gateway_insights

# Local Redis
REDIS_URL=redis://localhost:6379

# Cloud services (required)
GATEWAY_RPC_URL=https://tpg.sanctum.so/v1/mainnet?apiKey=YOUR_GATEWAY_API_KEY
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

**Setup Steps:**
```bash
# Install PostgreSQL
brew install postgresql@17
brew services start postgresql@17

# Install Redis
brew install redis
brew services start redis

# Create database
createdb gateway_insights

# Run migrations
npm run db:migrate
```

**Status:** ✅ Works for local development

---

### Scenario C: Production Deployment
**Recommended Stack:**

```
Frontend: Vercel (Next.js optimized)
Backend: Railway or Render
Database: Railway PostgreSQL or Supabase
Cache: Upstash Redis
Gateway: Sanctum (cloud)
Solana: Public RPC or private provider
```

**Environment Variables:**
- Set all in deployment platform
- Use production URLs
- Enable SSL for PostgreSQL

---

## ⚠️ Critical Dependencies Summary

**CANNOT run without:**
1. ❌ Sanctum Gateway API (cloud-only, proprietary)
2. ❌ Solana network access (via RPC providers)
3. ❌ PostgreSQL database (can be local OR cloud)

**CAN replace with local:**
1. ✅ PostgreSQL → Local PostgreSQL
2. ✅ Redis → Local Redis
3. ✅ App server → localhost

**Bottom Line:**
- **Backend MUST connect to external cloud services** (Gateway API, Solana RPC)
- Database/cache CAN be local or cloud (your choice)
- App server can run anywhere (local, VPS, Railway, etc.)

---

## 📝 Recommendations

### For Hackathon Submission:
**Keep current setup** (all cloud services)
- ✅ Supabase PostgreSQL (free tier)
- ✅ Upstash Redis (free tier)
- ✅ Sanctum Gateway API (provided by hackathon)
- ✅ Public Solana RPC (free)

**Why:**
- Easy to deploy
- No local infrastructure needed
- Judges can test live app
- Free tiers sufficient for demo

---

### For Long-term Production:
Consider:
- 🔹 **Helius/QuickNode RPC** (better rate limits than public RPC)
- 🔹 **Railway PostgreSQL** (integrated with app server)
- 🔹 **Keep Upstash Redis** (generous free tier)
- 🔹 **Sanctum Gateway** (production API key if available)

---

## 🎯 Answer to Your Question

> "Does the backend rely on other cloud services or fully run on local server?"

**Answer:**

The backend **RELIES HEAVILY on external cloud services**:
1. ✅ Supabase (database) - cloud
2. ✅ Upstash (cache) - cloud
3. ✅ Sanctum Gateway API - cloud (MANDATORY)
4. ✅ Solana RPC - cloud

**Can it run fully local?**
- ❌ NO - Gateway API and Solana network are always external
- ⚠️ PARTIALLY - You can run database/cache locally, but must still connect to Gateway API

**Does this matter?**
- 🎯 NO - This is expected and required for a Gateway-based project
- ✅ Your app demonstrates proper Gateway integration (the goal)
- 🏆 Judges expect cloud dependencies for blockchain apps

---

**Your app architecture is correct and appropriate for this hackathon!**

---

**Document Created:** October 25, 2025
**Status:** External dependencies documented and justified
