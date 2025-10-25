# Railway Setup Guide
## Gateway Insights - Database & Redis Setup

**Created**: October 12, 2025
**Platform**: Railway.app
**Services**: PostgreSQL + Redis

---

## Quick Setup Steps

### 1. Create Railway Account (2 minutes)

1. Visit https://railway.app
2. Sign up with GitHub account
3. Verify email

---

### 2. Create New Project (1 minute)

1. Click "New Project"
2. Select "Deploy PostgreSQL"
3. Name it: `gateway-insights-db`

---

### 3. Add PostgreSQL Database (2 minutes)

Railway will automatically provision PostgreSQL. Once complete:

1. Click on the PostgreSQL service
2. Go to "Variables" tab
3. Copy the following environment variables:
   - `DATABASE_URL` (full connection string)
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

---

### 4. Add Redis (2 minutes)

1. In your project, click "+ New"
2. Select "Database" → "Add Redis"
3. Once provisioned, go to "Variables" tab
4. Copy `REDIS_URL`

---

### 5. Update .env File (1 minute)

Add the Railway variables to your `.env` file:

```bash
# Railway PostgreSQL
DATABASE_URL=postgresql://user:pass@host:port/dbname
PGHOST=hostname.railway.app
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your-password
PGDATABASE=railway

# Railway Redis
REDIS_URL=redis://default:pass@host:port

# Existing Gateway Config
GATEWAY_API_KEY=your_gateway_api_key_here
GATEWAY_BASE_URL=https://tpg.sanctum.so/v1/mainnet
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta
```

---

## Test Database Connection

Once setup is complete, you can test the connection:

```bash
cd src/backend
npm run db:test
```

---

## Railway Dashboard Features

### Monitoring
- View database metrics (connections, queries/sec)
- Monitor memory and CPU usage
- View logs in real-time

### Backups
- Automatic daily backups (retained for 7 days on free tier)
- Manual backup option available

### Scaling
- Upgrade to paid tier for more resources
- Current free tier limits:
  - PostgreSQL: 512MB RAM, 1GB storage
  - Redis: 512MB RAM

---

## Connection Limits

**Free Tier:**
- Max connections: 20 concurrent
- Storage: 1GB
- RAM: 512MB

**For hackathon**: Free tier is sufficient

---

## Security

Railway automatically:
- ✅ Encrypts connections (SSL)
- ✅ Provides unique credentials per database
- ✅ Allows IP whitelisting (if needed)

**Never commit** Railway credentials to Git!

---

## Cost

**Hackathon Duration (22 days):**
- Free tier: $0
- Includes PostgreSQL + Redis
- No credit card required initially

**After Hackathon:**
- Free tier: $5/month credit (sufficient for small projects)
- Or upgrade to paid plans

---

## Alternative: Supabase

If you prefer Supabase instead:

1. Visit https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Supabase includes PostgreSQL + built-in analytics

Both work great - Railway is simpler, Supabase has more features.

---

**Ready?** Once you've completed Railway setup and copied the environment variables to `.env`, I'll create the database migrations!
