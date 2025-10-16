# Quick Setup Checklist
## Get Your Databases Running in 10 Minutes

Follow the detailed guide: `SUPABASE-UPSTASH-SETUP.md`

---

## ☑️ Part 1: Supabase (PostgreSQL) - 5 min

- [ ] 1. Go to https://supabase.com
- [ ] 2. Sign up with GitHub
- [ ] 3. Create new project: `gateway-insights`
- [ ] 4. Generate and **SAVE** database password
- [ ] 5. Wait for database to provision (~2 min)
- [ ] 6. Copy DATABASE_URL from Settings → Database
- [ ] 7. Replace `[YOUR-PASSWORD]` in the URL

**Your DATABASE_URL should look like:**
```
postgresql://postgres:YourPassword@db.xxxxx.supabase.co:5432/postgres
```

---

## ☑️ Part 2: Upstash (Redis) - 5 min

- [ ] 1. Go to https://upstash.com
- [ ] 2. Sign up with GitHub
- [ ] 3. Create database: `gateway-insights-redis`
- [ ] 4. Select "Regional" type (free)
- [ ] 5. Copy REDIS_URL from Details or .env tab

**Your REDIS_URL should look like:**
```
redis://default:xxxxxxxxxxxxx@usw1-redis.upstash.io:6379
```

---

## ☑️ Part 3: Update .env File - 2 min

- [ ] 1. Open `/Users/rz/local-dev/sanctum-gateway-track/src/backend/.env`
- [ ] 2. Add both URLs (see example below)
- [ ] 3. Save file

**Your .env should contain:**
```bash
DATABASE_URL=postgresql://postgres:...@db.xxxxx.supabase.co:5432/postgres
REDIS_URL=redis://default:...@usw1-redis.upstash.io:6379
GATEWAY_API_KEY=***GATEWAY_API_KEY_REDACTED***
GATEWAY_BASE_URL=https://tpg.sanctum.so/v1/mainnet
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta
```

---

## ☑️ Part 4: Test & Migrate - 2 min

Run these commands from `/Users/rz/local-dev/sanctum-gateway-track/src/backend`:

- [ ] 1. Test connections:
  ```bash
  npm run db:test
  ```
  **Expected**: ✅ PostgreSQL connected! ✅ Redis connected!

- [ ] 2. Run migrations:
  ```bash
  npm run db:migrate
  ```
  **Expected**: ✅ Migration completed successfully

- [ ] 3. Check status:
  ```bash
  npm run db:migrate:status
  ```
  **Expected**: ✅ Database is up to date!

---

## ✅ All Done!

When all checkboxes are ✅, your database infrastructure is ready!

**Next**: Continue with Task 2.1.5 (Data Models & DAL)
