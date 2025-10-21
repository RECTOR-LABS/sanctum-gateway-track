# Database Schema Design
## Gateway Insights - Transaction Analytics Platform

**Created**: October 12, 2025
**Version**: 1.0
**Database**: PostgreSQL 14+

---

## Overview

This schema captures all transaction data from Sanctum Gateway for comprehensive analytics. The design supports:
- Real-time transaction tracking
- Cost analysis by delivery method
- Success rate metrics
- Historical trend analysis
- Multi-project support (future)

---

## Tables

### 1. `transactions`

Primary table storing all transaction metadata from Gateway.

```sql
CREATE TABLE transactions (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,

  -- Transaction Identifiers
  signature VARCHAR(88) NOT NULL UNIQUE,  -- Solana transaction signature (base58)

  -- Transaction Details
  status VARCHAR(20) NOT NULL,  -- 'pending', 'confirmed', 'failed'
  delivery_method VARCHAR(30) NOT NULL,  -- 'sanctum-sender', 'jito', 'rpc'

  -- Cost & Performance Metrics
  cost_lamports BIGINT NOT NULL DEFAULT 0,  -- Total cost in lamports
  tip_lamports BIGINT DEFAULT 0,  -- Jito tip amount (if applicable)
  tip_refunded BOOLEAN DEFAULT FALSE,  -- Whether Jito tip was refunded
  response_time_ms INTEGER,  -- Time from buildGatewayTransaction to sendTransaction response
  confirmation_time_ms INTEGER,  -- Time to confirmation on-chain

  -- Blockchain Data
  slot BIGINT,  -- Slot number when confirmed
  block_time TIMESTAMP,  -- Block timestamp
  blockhash VARCHAR(44),  -- Recent blockhash used
  last_valid_block_height BIGINT,  -- Last valid block height

  -- Transaction Content
  instruction_count INTEGER NOT NULL,  -- Number of instructions (should be 5+ with Gateway)
  signer_pubkey VARCHAR(44) NOT NULL,  -- Fee payer public key

  -- Error Tracking (for failed transactions)
  error_code VARCHAR(50),  -- Error code from Gateway/Solana
  error_message TEXT,  -- Full error message

  -- Metadata
  project_id BIGINT,  -- Future: multi-project support (FK to projects table)
  raw_transaction_data JSONB,  -- Full transaction data for debugging
  gateway_response JSONB,  -- Full Gateway API response

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Indexes
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'failed')),
  CONSTRAINT valid_delivery_method CHECK (delivery_method IN ('sanctum-sender', 'jito', 'rpc', 'unknown'))
);

-- Indexes for performance
CREATE INDEX idx_transactions_signature ON transactions(signature);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_delivery_method ON transactions(delivery_method);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_project_id ON transactions(project_id);
CREATE INDEX idx_transactions_signer ON transactions(signer_pubkey);

-- Composite indexes for analytics queries
CREATE INDEX idx_transactions_status_delivery ON transactions(status, delivery_method);
CREATE INDEX idx_transactions_created_delivery ON transactions(created_at DESC, delivery_method);
```

---

### 2. `analytics_snapshots`

Pre-calculated analytics for fast dashboard loading. Updated periodically.

```sql
CREATE TABLE analytics_snapshots (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,

  -- Snapshot Metadata
  snapshot_date DATE NOT NULL,  -- Date of snapshot (daily granularity)
  project_id BIGINT,  -- Future: per-project analytics

  -- Transaction Volume
  total_transactions INTEGER NOT NULL DEFAULT 0,
  successful_transactions INTEGER NOT NULL DEFAULT 0,
  failed_transactions INTEGER NOT NULL DEFAULT 0,

  -- By Delivery Method
  sanctum_sender_count INTEGER NOT NULL DEFAULT 0,
  jito_count INTEGER NOT NULL DEFAULT 0,
  rpc_count INTEGER NOT NULL DEFAULT 0,

  -- Success Rates (stored as percentages * 100 for precision)
  overall_success_rate INTEGER,  -- e.g., 9850 = 98.50%
  sanctum_sender_success_rate INTEGER,
  jito_success_rate INTEGER,
  rpc_success_rate INTEGER,

  -- Cost Metrics (in lamports)
  total_cost_lamports BIGINT NOT NULL DEFAULT 0,
  total_tips_lamports BIGINT NOT NULL DEFAULT 0,
  total_tips_refunded_lamports BIGINT NOT NULL DEFAULT 0,
  avg_cost_per_tx_lamports INTEGER,

  -- Performance Metrics
  avg_response_time_ms INTEGER,
  avg_confirmation_time_ms INTEGER,
  p95_response_time_ms INTEGER,  -- 95th percentile
  p99_response_time_ms INTEGER,  -- 99th percentile

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_snapshot_date_project UNIQUE (snapshot_date, project_id)
);

-- Indexes
CREATE INDEX idx_snapshots_date ON analytics_snapshots(snapshot_date DESC);
CREATE INDEX idx_snapshots_project ON analytics_snapshots(project_id);
```

---

### 3. `projects` (Future - Epic 5)

Multi-project support for tracking multiple applications.

```sql
CREATE TABLE projects (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,

  -- Project Details
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Configuration
  gateway_api_key_id VARCHAR(255),  -- Reference to Gateway API key

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  -- Owner
  owner_pubkey VARCHAR(44),  -- Solana wallet of project owner

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_active ON projects(is_active);
CREATE INDEX idx_projects_owner ON projects(owner_pubkey);
```

---

### 4. `api_keys` (Future - Epic 5)

API key management for external access to Gateway Insights.

```sql
CREATE TABLE api_keys (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,

  -- Key Details
  key_hash VARCHAR(64) NOT NULL UNIQUE,  -- SHA-256 hash of API key
  key_prefix VARCHAR(8) NOT NULL,  -- First 8 chars for display (gi_xxxxxx)
  name VARCHAR(255),  -- User-friendly name

  -- Permissions
  project_id BIGINT NOT NULL,  -- FK to projects
  permissions JSONB,  -- Array of permissions: ['read', 'write']

  -- Usage Tracking
  last_used_at TIMESTAMP,
  request_count INTEGER NOT NULL DEFAULT 0,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Foreign Keys
  CONSTRAINT fk_api_keys_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_project ON api_keys(project_id);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);
```

---

## Relationships

```
projects (1) ──< (many) transactions
projects (1) ──< (many) analytics_snapshots
projects (1) ──< (many) api_keys
```

---

## Data Types

### Status Values
- `pending` - Transaction submitted, awaiting confirmation
- `confirmed` - Transaction confirmed on-chain
- `failed` - Transaction failed (error occurred)

### Delivery Methods
- `sanctum-sender` - Delivered via Sanctum Sender (0.0001 SOL per tx)
- `jito` - Delivered via Jito Block Engine
- `rpc` - Delivered via standard RPC
- `unknown` - Delivery method not determined

---

## Sample Queries

### Get Recent Transactions
```sql
SELECT
  signature,
  status,
  delivery_method,
  cost_lamports,
  response_time_ms,
  created_at
FROM transactions
ORDER BY created_at DESC
LIMIT 100;
```

### Calculate Overall Success Rate
```sql
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'confirmed') as successful,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'confirmed') / COUNT(*), 2) as success_rate
FROM transactions
WHERE created_at >= NOW() - INTERVAL '7 days';
```

### Cost Analysis by Delivery Method
```sql
SELECT
  delivery_method,
  COUNT(*) as transaction_count,
  SUM(cost_lamports) as total_cost_lamports,
  AVG(cost_lamports) as avg_cost_lamports,
  SUM(tip_lamports) as total_tips,
  SUM(tip_lamports) FILTER (WHERE tip_refunded = TRUE) as refunded_tips
FROM transactions
WHERE status = 'confirmed'
GROUP BY delivery_method
ORDER BY transaction_count DESC;
```

### Success Rate by Delivery Method
```sql
SELECT
  delivery_method,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'confirmed') as successful,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'confirmed') / COUNT(*), 2) as success_rate
FROM transactions
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY delivery_method;
```

### Daily Transaction Volume
```sql
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_transactions,
  COUNT(*) FILTER (WHERE status = 'confirmed') as successful,
  COUNT(*) FILTER (WHERE status = 'failed') as failed
FROM transactions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## Redis Cache Keys

For high-performance reads, we'll cache frequently accessed data in Redis:

### Cache Keys
- `analytics:overview` - Overall dashboard metrics (TTL: 30 seconds)
- `analytics:costs` - Cost breakdown (TTL: 1 minute)
- `analytics:success-rates` - Success rates by method (TTL: 1 minute)
- `transactions:recent` - Last 100 transactions (TTL: 10 seconds)
- `transactions:{signature}` - Individual transaction details (TTL: 5 minutes)

### Cache Invalidation
- Invalidate on new transaction insert
- Invalidate on transaction status update

---

## Migration Strategy

1. **Phase 1 (Epic 2)**: Create `transactions` table only
2. **Phase 2 (Epic 4)**: Add `analytics_snapshots` table
3. **Phase 3 (Epic 5)**: Add `projects` and `api_keys` tables
4. **Phase 4 (Future)**: Add additional tables as needed

---

## Performance Considerations

1. **Partitioning**: Consider partitioning `transactions` by `created_at` (monthly) if volume exceeds 10M rows
2. **Archiving**: Archive transactions older than 90 days to separate table
3. **Indexes**: Monitor query patterns and add indexes as needed
4. **Materialized Views**: Consider for complex analytics queries
5. **Connection Pooling**: Use connection pooling (pg-pool) for better performance

---

**Next Steps:**
1. Create initial migration (transactions table)
2. Set up PostgreSQL database
3. Set up Redis
4. Create TypeScript data models
5. Implement data access layer (DAL)
