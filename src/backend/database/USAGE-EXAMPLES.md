# Database Layer Usage Examples

This guide shows how to use the Data Access Layer (DAL) for common operations.

## Table of Contents
- [Importing](#importing)
- [Transaction Operations](#transaction-operations)
- [Analytics Queries](#analytics-queries)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## Importing

```typescript
// Import specific functions
import { createTransaction, getOverallMetrics } from './database/dal';

// Import types
import { CreateTransactionInput, TransactionFilter } from './database/types';
```

---

## Transaction Operations

### 1. Creating a Transaction

```typescript
import { createTransaction } from './database/dal';
import { CreateTransactionInput } from './database/types';

// Example: Track a Gateway transaction
async function trackGatewayTransaction(gatewayResponse: any) {
  const input: CreateTransactionInput = {
    signature: gatewayResponse.signature,
    status: 'pending',
    delivery_method: gatewayResponse.deliveryMethod || 'unknown',
    cost_lamports: gatewayResponse.fee || 0,
    tip_lamports: gatewayResponse.tip || 0,
    instruction_count: gatewayResponse.instructionCount || 1,
    signer_pubkey: gatewayResponse.signer,
    gateway_response: gatewayResponse, // Store full response
  };

  try {
    const transaction = await createTransaction(input);
    console.log(`Transaction tracked: ${transaction.signature}`);
    return transaction;
  } catch (error) {
    console.error('Failed to track transaction:', error);
    throw error;
  }
}
```

### 2. Updating Transaction Status

```typescript
import { updateTransaction } from './database/dal';

// Example: Update transaction when confirmed
async function confirmTransaction(signature: string, confirmationData: any) {
  const update = {
    signature,
    status: 'confirmed' as const,
    confirmation_time_ms: confirmationData.confirmationTime,
    slot: confirmationData.slot,
    block_time: new Date(confirmationData.blockTime * 1000),
  };

  const updated = await updateTransaction(update);
  return updated;
}

// Example: Mark transaction as failed
async function failTransaction(signature: string, errorMessage: string) {
  const update = {
    signature,
    status: 'failed' as const,
    error_code: 'TRANSACTION_FAILED',
    error_message: errorMessage,
  };

  return await updateTransaction(update);
}
```

### 3. Querying Transactions

```typescript
import { getTransactions, getRecentTransactions } from './database/dal';
import { TransactionFilter } from './database/types';

// Example: Get recent transactions
async function getLatestTransactions() {
  const transactions = await getRecentTransactions(20);
  return transactions;
}

// Example: Filter transactions
async function getJitoTransactions() {
  const filter: TransactionFilter = {
    delivery_method: 'jito',
    status: 'confirmed',
    limit: 100,
    offset: 0,
  };

  const result = await getTransactions(filter);
  console.log(`Found ${result.total} Jito transactions`);
  console.log(`Showing ${result.data.length} transactions`);
  console.log(`Has more: ${result.hasMore}`);
  return result;
}

// Example: Get transactions by date range
async function getTransactionsByDateRange(startDate: Date, endDate: Date) {
  const filter: TransactionFilter = {
    start_date: startDate,
    end_date: endDate,
    limit: 1000,
  };

  return await getTransactions(filter);
}
```

### 4. Getting Specific Transaction

```typescript
import { getTransactionBySignature } from './database/dal';

async function lookupTransaction(signature: string) {
  const transaction = await getTransactionBySignature(signature);

  if (!transaction) {
    console.log('Transaction not found');
    return null;
  }

  console.log(`Status: ${transaction.status}`);
  console.log(`Delivery: ${transaction.delivery_method}`);
  console.log(`Cost: ${transaction.cost_lamports / 1_000_000_000} SOL`);

  return transaction;
}
```

---

## Analytics Queries

### 1. Overall Metrics

```typescript
import { getOverallMetrics } from './database/dal';

// Example: Dashboard metrics
async function getDashboardMetrics() {
  const metrics = await getOverallMetrics();

  console.log(`Total Transactions: ${metrics.total_transactions}`);
  console.log(`Success Rate: ${metrics.success_rate.toFixed(2)}%`);
  console.log(`Total Cost: ${metrics.total_cost_sol.toFixed(4)} SOL`);
  console.log(`Jito Count: ${metrics.delivery_breakdown.jito}`);
  console.log(`RPC Count: ${metrics.delivery_breakdown.rpc}`);

  return metrics;
}

// Example: Metrics for specific date range
async function getWeeklyMetrics() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const metrics = await getOverallMetrics(startDate, new Date());
  return metrics;
}
```

### 2. Time-Series Data for Charts

```typescript
import {
  getTransactionTimeSeries,
  getSuccessRateTimeSeries,
  getCostTimeSeries,
} from './database/dal';

// Example: Transaction volume chart (last 24 hours)
async function getHourlyTransactionChart() {
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - 24);

  const dataPoints = await getTransactionTimeSeries('hour', startDate);

  // Format for Recharts
  const chartData = dataPoints.map((point) => ({
    time: point.timestamp.toLocaleTimeString(),
    count: point.value,
  }));

  return chartData;
}

// Example: Success rate trend (last 7 days)
async function getSuccessRateTrend() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const dataPoints = await getSuccessRateTimeSeries('day', startDate);

  return dataPoints.map((point) => ({
    date: point.timestamp.toLocaleDateString(),
    successRate: point.value.toFixed(2),
  }));
}

// Example: Cost comparison chart
async function getCostComparisonChart() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const [jitoCosts, rpcCosts, sanctumCosts] = await Promise.all([
    getCostTimeSeries('jito', 'day', startDate),
    getCostTimeSeries('rpc', 'day', startDate),
    getCostTimeSeries('sanctum-sender', 'day', startDate),
  ]);

  // Combine into single chart data
  const chartData = jitoCosts.map((jitoPoint, index) => ({
    date: jitoPoint.timestamp.toLocaleDateString(),
    jito: jitoPoint.value,
    rpc: rpcCosts[index]?.value || 0,
    sanctum: sanctumCosts[index]?.value || 0,
  }));

  return chartData;
}
```

### 3. Cost Savings Analysis

```typescript
import { getCostComparison } from './database/dal';

// Example: Show Gateway value proposition
async function calculateSavings() {
  const comparison = await getCostComparison();

  console.log(`Gateway Cost: ${comparison.gateway_cost_sol.toFixed(4)} SOL`);
  console.log(`Direct Jito Cost: ${comparison.direct_jito_cost_sol.toFixed(4)} SOL`);
  console.log(`Savings: ${comparison.savings_vs_jito_sol.toFixed(4)} SOL`);
  console.log(`Savings: ${comparison.savings_percentage.toFixed(2)}%`);

  return {
    message: `You saved ${comparison.savings_percentage.toFixed(0)}% by using Gateway!`,
    savings_sol: comparison.savings_vs_jito_sol,
  };
}
```

### 4. Delivery Method Comparison

```typescript
import { getMetricsByDeliveryMethod } from './database/dal';

// Example: Compare delivery methods
async function compareDeliveryMethods() {
  const metrics = await getMetricsByDeliveryMethod();

  metrics.forEach((method) => {
    console.log(`\n${method.delivery_method.toUpperCase()}`);
    console.log(`  Total: ${method.total_count}`);
    console.log(`  Success Rate: ${method.success_rate.toFixed(2)}%`);
    console.log(`  Avg Response: ${method.avg_response_time_ms?.toFixed(0) || 'N/A'} ms`);
    console.log(`  Total Cost: ${method.total_cost_sol.toFixed(4)} SOL`);
  });

  return metrics;
}
```

### 5. Error Analysis

```typescript
import { getTopErrors } from './database/dal';

// Example: Identify common failures
async function analyzeErrors() {
  const errors = await getTopErrors(5);

  console.log('Top 5 Errors:');
  errors.forEach((error, index) => {
    console.log(`\n${index + 1}. ${error.error_code}`);
    console.log(`   Message: ${error.error_message}`);
    console.log(`   Occurrences: ${error.occurrence_count}`);
    console.log(`   Last seen: ${error.last_occurrence.toLocaleString()}`);
  });

  return errors;
}
```

---

## Error Handling

### Best Practices

```typescript
import { createTransaction } from './database/dal';

async function safeCreateTransaction(input: CreateTransactionInput) {
  try {
    const transaction = await createTransaction(input);
    return { success: true, data: transaction };
  } catch (error) {
    // Handle duplicate signature error
    if (error.code === '23505') {
      // PostgreSQL unique violation
      console.warn(`Transaction ${input.signature} already exists`);
      return { success: false, error: 'DUPLICATE_TRANSACTION' };
    }

    // Handle other errors
    console.error('Database error:', error);
    return { success: false, error: 'DATABASE_ERROR' };
  }
}
```

### Connection Errors

```typescript
import { pool } from './database/config';

async function checkDatabaseHealth() {
  try {
    const result = await pool.query('SELECT NOW()');
    return { healthy: true, timestamp: result.rows[0].now };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { healthy: false, error: error.message };
  }
}
```

---

## Best Practices

### 1. Use Transactions for Multiple Operations

```typescript
import { pool } from './database/config';

async function processMultipleTransactions(inputs: CreateTransactionInput[]) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const input of inputs) {
      // Insert each transaction
      await client.query(
        `INSERT INTO transactions (...) VALUES (...)`,
        [/* values */]
      );
    }

    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### 2. Clear Cache After Updates

```typescript
import { createTransaction, clearAnalyticsCache } from './database/dal';

async function createAndInvalidateCache(input: CreateTransactionInput) {
  const transaction = await createTransaction(input);

  // Clear analytics cache so next request gets fresh data
  await clearAnalyticsCache();

  return transaction;
}
```

### 3. Use Pagination for Large Datasets

```typescript
import { getTransactions } from './database/dal';

async function getAllTransactionsPaginated() {
  const pageSize = 100;
  let offset = 0;
  let allTransactions = [];

  while (true) {
    const result = await getTransactions({ limit: pageSize, offset });

    allTransactions.push(...result.data);

    if (!result.hasMore) {
      break;
    }

    offset += pageSize;
  }

  return allTransactions;
}
```

### 4. Type Safety

```typescript
import { Transaction, TransactionStatus } from './database/types';

// Good: TypeScript ensures valid status
function processTransaction(tx: Transaction) {
  const validStatuses: TransactionStatus[] = ['pending', 'confirmed', 'failed'];

  if (validStatuses.includes(tx.status)) {
    // TypeScript knows tx.status is valid
    console.log(`Status: ${tx.status}`);
  }
}
```

---

## Real-World Example: Complete Flow

```typescript
import {
  createTransaction,
  updateTransaction,
  getOverallMetrics,
  getCostComparison,
  clearAnalyticsCache,
} from './database/dal';

/**
 * Complete flow: Submit transaction via Gateway, track it, update on confirmation
 */
async function submitAndTrackGatewayTransaction(transactionData: any) {
  // 1. Create initial record (status: pending)
  const transaction = await createTransaction({
    signature: transactionData.signature,
    status: 'pending',
    delivery_method: transactionData.deliveryMethod,
    cost_lamports: transactionData.fee,
    tip_lamports: transactionData.tip,
    instruction_count: transactionData.instructions.length,
    signer_pubkey: transactionData.signer,
    gateway_response: transactionData,
  });

  console.log(`Created transaction: ${transaction.signature}`);

  // 2. Wait for confirmation (simulated)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // 3. Update with confirmation data
  const confirmed = await updateTransaction({
    signature: transaction.signature,
    status: 'confirmed',
    slot: 123456789,
    confirmation_time_ms: 4500,
    block_time: new Date(),
  });

  console.log(`Transaction confirmed in slot ${confirmed?.slot}`);

  // 4. Invalidate analytics cache
  await clearAnalyticsCache();

  // 5. Get updated metrics
  const metrics = await getOverallMetrics();
  const savings = await getCostComparison();

  console.log(`\nUpdated Metrics:`);
  console.log(`Total Transactions: ${metrics.total_transactions}`);
  console.log(`Success Rate: ${metrics.success_rate.toFixed(2)}%`);
  console.log(`Savings vs Jito: ${savings.savings_percentage.toFixed(2)}%`);

  return { transaction, metrics, savings };
}
```

---

## Next Steps

1. **API Layer**: Use these DAL functions in Express/Fastify routes
2. **WebSocket**: Push updates when transactions are created/updated
3. **Frontend**: Fetch data from API and render with Recharts
4. **Real-time**: Implement WebSocket listeners for live dashboard updates

**Alhamdulillah!** The DAL is production-ready and type-safe!
