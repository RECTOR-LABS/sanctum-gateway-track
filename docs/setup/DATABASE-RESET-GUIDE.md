# Database Reset Guide

**Project**: Gateway Insights
**Purpose**: Clear all data and start fresh
**Last Updated**: October 25, 2025

---

## Tables to Clear

Based on your current schema, here are the tables that store data:

### 1. **`transactions`** (Primary table) ⭐ **MAIN TABLE**

This table stores:
- All Gateway transaction data
- Wallet monitoring transaction data
- Transaction metadata (signature, status, delivery_method, cost, etc.)
- Error logs

**Data Impact**: Clearing this will reset ALL transaction history and analytics.

### 2. **Redis Cache** (Optional)

While not a database table, Redis stores:
- Cached analytics (`analytics:overview`, `analytics:costs`, etc.)
- Recent transactions cache
- API response caches

**Data Impact**: Cache will automatically rebuild from database.

---

## Option 1: Complete Database Reset (Recommended for Fresh Start)

### SQL Command (PostgreSQL)

```sql
-- Clear all transaction data
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
```

**What this does**:
- ✅ Deletes ALL rows from `transactions` table
- ✅ Resets the `id` sequence to 1 (next insert will be id=1)
- ✅ CASCADE ensures any dependent data is also cleared
- ✅ **Much faster** than `DELETE` for large datasets
- ✅ Maintains table structure and indexes

### Execute via psql

```bash
# Connect to your Supabase database
psql "postgresql://postgres.[YOUR-PROJECT-REF].supabase.co:6543/postgres?sslmode=require" \
  -U postgres \
  -c "TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;"
```

**You'll be prompted for password** (found in your Supabase dashboard)

---

## Option 2: Selective Data Deletion

If you want to keep some data and only delete specific records:

### Delete by Date Range

```sql
-- Delete all transactions older than 7 days
DELETE FROM transactions
WHERE created_at < NOW() - INTERVAL '7 days';
```

### Delete by Delivery Method

```sql
-- Delete all transactions from a specific delivery method
DELETE FROM transactions
WHERE delivery_method = 'jito';
```

### Delete Failed Transactions Only

```sql
-- Delete only failed transactions
DELETE FROM transactions
WHERE status = 'failed';
```

### Delete by Wallet Address

```sql
-- Delete all transactions from a specific signer
DELETE FROM transactions
WHERE signer_pubkey = 'REC1Vu7...';
```

---

## Option 3: Using Backend API (Safest)

If you want to avoid direct database access, create an admin endpoint:

### Add to `src/backend/api/adminRoutes.ts`

```typescript
import { Router } from 'express';
import pool from '../database/pool';

const router = Router();

// DELETE /api/admin/reset-database
router.delete('/reset-database', async (req, res) => {
  try {
    // Require admin authentication here
    const confirmCode = req.body.confirm;

    if (confirmCode !== 'RESET_ALL_DATA') {
      return res.status(400).json({
        error: 'Confirmation code required. Send { "confirm": "RESET_ALL_DATA" }'
      });
    }

    await pool.query('TRUNCATE TABLE transactions RESTART IDENTITY CASCADE');

    res.json({
      success: true,
      message: 'Database reset successfully. All transaction data deleted.'
    });
  } catch (error) {
    console.error('Database reset error:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

export default router;
```

### Call via cURL

```bash
curl -X DELETE http://localhost:3001/api/admin/reset-database \
  -H "Content-Type: application/json" \
  -d '{"confirm": "RESET_ALL_DATA"}'
```

---

## Option 4: Drop and Recreate Table (Complete Rebuild)

If you want to reset table structure as well:

```sql
-- WARNING: This deletes the table AND all indexes/constraints
DROP TABLE IF EXISTS transactions CASCADE;

-- Then run your migration again
-- Execute: src/backend/database/migrations/001_create_transactions_table.sql
```

---

## Clear Redis Cache (Optional but Recommended)

After clearing the database, clear Redis cache to avoid stale data:

### Via Redis CLI

```bash
# Connect to Upstash Redis
redis-cli -h [your-upstash-host] -p [port] -a [password]

# Clear analytics caches
DEL analytics:overview
DEL analytics:costs
DEL analytics:success-rates
DEL analytics:trends
DEL analytics:delivery-methods
DEL analytics:errors
DEL analytics:alerts
DEL transactions:recent

# Or clear ALL keys (nuclear option)
FLUSHDB
```

### Via Backend Code

Add to your admin endpoint:

```typescript
import redis from '../database/redis';

// Clear all analytics caches
await redis.del(
  'analytics:overview',
  'analytics:costs',
  'analytics:success-rates',
  'analytics:trends',
  'analytics:delivery-methods',
  'analytics:errors',
  'analytics:alerts',
  'transactions:recent'
);
```

---

## Verification After Reset

### Check Transaction Count

```sql
-- Should return 0 after reset
SELECT COUNT(*) FROM transactions;
```

### Check Sequence Reset

```sql
-- Should show next value as 1
SELECT currval(pg_get_serial_sequence('transactions', 'id'));
```

### Test Insert

```sql
-- Insert a test record - should get id=1
INSERT INTO transactions (
  signature,
  status,
  delivery_method,
  instruction_count,
  signer_pubkey
) VALUES (
  'test_sig_123',
  'pending',
  'sanctum-sender',
  5,
  'REC1Vu7Test123'
);

-- Verify
SELECT * FROM transactions WHERE signature = 'test_sig_123';

-- Clean up test
DELETE FROM transactions WHERE signature = 'test_sig_123';
```

---

## Important Notes

### ⚠️ Data Loss Warning

**TRUNCATE is PERMANENT!** There is no undo. Make sure you:
1. ✅ Have a backup if needed
2. ✅ Are absolutely sure you want to delete everything
3. ✅ Have notified anyone else using the database

### 📊 Analytics Impact

After clearing:
- Dashboard will show "No data" until new transactions arrive
- All charts will be empty
- Historical trends will be lost
- Success rates will reset

### 🔄 Automated Services

If you have any automated services polling the database:
- WebSocket connections will continue working
- New transactions will populate normally
- Analytics will rebuild as data comes in

### 🚀 Performance

After a TRUNCATE:
- Table size: 0 bytes
- Indexes: Empty but intact
- Queries: Instant (no rows to scan)
- Next insert: Very fast (no fragmentation)

---

## Quick Reference

### Just Clear Everything

```sql
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
```

### Clear Everything + Redis Cache

```bash
# PostgreSQL
psql $DATABASE_URL -c "TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;"

# Redis (if using redis-cli)
redis-cli -h $REDIS_HOST -a $REDIS_PASSWORD FLUSHDB
```

### Verify It's Empty

```sql
SELECT COUNT(*) FROM transactions;
-- Expected: 0
```

---

## Recommended Workflow for Fresh Start

1. **Stop the backend** (to prevent new transactions during reset)
   ```bash
   # Ctrl+C in the terminal running backend
   ```

2. **Clear PostgreSQL**
   ```sql
   TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
   ```

3. **Clear Redis** (optional but recommended)
   ```bash
   redis-cli -h [host] -a [password] FLUSHDB
   ```

4. **Restart the backend**
   ```bash
   cd src/backend && npm run dev
   ```

5. **Verify the dashboard** - Should show "No transactions yet"

6. **Start fresh!** - Monitor a new wallet or submit new transactions

---

## Backup Before Reset (Optional)

If you want to keep a backup before clearing:

```sql
-- Export to CSV
COPY transactions TO '/tmp/transactions_backup.csv' CSV HEADER;

-- Or create a backup table
CREATE TABLE transactions_backup AS SELECT * FROM transactions;
```

---

## Troubleshooting

### Error: "cannot truncate a table referenced in a foreign key constraint"

**Solution**: Use `CASCADE` option
```sql
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
```

### Error: "permission denied for table transactions"

**Solution**: Ensure you're connected as the database owner or have DELETE permission.

### Dashboard still showing old data

**Solution**: Clear Redis cache and hard-refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

---

## Summary

**To start completely fresh**:

```bash
# 1. Connect to database
psql $DATABASE_URL

# 2. Clear all data
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;

# 3. Verify
SELECT COUNT(*) FROM transactions;
-- Expected output: 0

# 4. Exit
\q
```

**Done!** Your database is now clean and ready for new data.

---

**Note**: This guide assumes your current schema with only the `transactions` table. If you've added more tables (analytics_snapshots, monitored_wallets, etc.), adjust the TRUNCATE commands accordingly.

**Bismillah! Ready for a fresh start! 🚀**
