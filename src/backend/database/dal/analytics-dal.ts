/**
 * Analytics Data Access Layer (DAL)
 *
 * Provides complex analytics queries for the Gateway Insights dashboard.
 * Handles aggregations, time-series data, and cost comparisons.
 */

import { pool, redisClient } from '../config';
import {
  AnalyticsMetrics,
  TimeSeriesDataPoint,
  CostComparison,
  DeliveryMethod,
} from '../types';

/**
 * Lamports to SOL conversion constant
 */
const LAMPORTS_PER_SOL = 1_000_000_000;

/**
 * Get overall analytics metrics
 * Includes success rates, costs, delivery breakdown, etc.
 */
export async function getOverallMetrics(
  startDate?: Date,
  endDate?: Date
): Promise<AnalyticsMetrics> {
  const cacheKey = `analytics:overall:${startDate?.toISOString() || 'all'}:${endDate?.toISOString() || 'all'}`;

  // Try cache first (5 minute TTL)
  if (redisClient.isOpen) {
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Redis get failed:', error);
    }
  }

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (startDate) {
    conditions.push(`created_at >= $${paramIndex++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`created_at <= $${paramIndex++}`);
    values.push(endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      COUNT(*) as total_transactions,
      COUNT(*) FILTER (WHERE status = 'confirmed') as successful_transactions,
      COUNT(*) FILTER (WHERE status = 'failed') as failed_transactions,
      COALESCE(SUM(cost_lamports), 0) as total_cost_lamports,
      COALESCE(SUM(tip_lamports), 0) as total_tips_lamports,
      COALESCE(SUM(CASE WHEN tip_refunded THEN tip_lamports ELSE 0 END), 0) as total_refunded_lamports,
      AVG(response_time_ms) as avg_response_time_ms,
      AVG(confirmation_time_ms) as avg_confirmation_time_ms,
      COUNT(*) FILTER (WHERE delivery_method = 'jito') as jito_count,
      COUNT(*) FILTER (WHERE delivery_method = 'rpc') as rpc_count,
      COUNT(*) FILTER (WHERE delivery_method = 'sanctum-sender') as sanctum_sender_count,
      COUNT(*) FILTER (WHERE delivery_method = 'unknown') as unknown_count,
      COALESCE(SUM(CASE WHEN delivery_method = 'jito' THEN cost_lamports ELSE 0 END), 0) as jito_cost_lamports,
      COALESCE(SUM(CASE WHEN delivery_method = 'rpc' THEN cost_lamports ELSE 0 END), 0) as rpc_cost_lamports,
      COALESCE(SUM(CASE WHEN delivery_method = 'sanctum-sender' THEN cost_lamports ELSE 0 END), 0) as sanctum_sender_cost_lamports
    FROM transactions
    ${whereClause}
  `;

  const result = await pool.query(query, values);
  const row = result.rows[0];

  const totalTransactions = parseInt(row.total_transactions, 10);
  const successfulTransactions = parseInt(row.successful_transactions, 10);
  const failedTransactions = parseInt(row.failed_transactions, 10);

  const metrics: AnalyticsMetrics = {
    total_transactions: totalTransactions,
    successful_transactions: successfulTransactions,
    failed_transactions: failedTransactions,
    success_rate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0,
    total_cost_sol: parseInt(row.total_cost_lamports, 10) / LAMPORTS_PER_SOL,
    total_tips_sol: parseInt(row.total_tips_lamports, 10) / LAMPORTS_PER_SOL,
    total_refunded_sol: parseInt(row.total_refunded_lamports, 10) / LAMPORTS_PER_SOL,
    avg_response_time_ms: row.avg_response_time_ms ? parseFloat(row.avg_response_time_ms) : null,
    avg_confirmation_time_ms: row.avg_confirmation_time_ms
      ? parseFloat(row.avg_confirmation_time_ms)
      : null,
    delivery_breakdown: {
      jito: parseInt(row.jito_count, 10),
      rpc: parseInt(row.rpc_count, 10),
      sanctum_sender: parseInt(row.sanctum_sender_count, 10),
      unknown: parseInt(row.unknown_count, 10),
    },
    cost_by_delivery: {
      jito_cost_sol: parseInt(row.jito_cost_lamports, 10) / LAMPORTS_PER_SOL,
      rpc_cost_sol: parseInt(row.rpc_cost_lamports, 10) / LAMPORTS_PER_SOL,
      sanctum_sender_cost_sol: parseInt(row.sanctum_sender_cost_lamports, 10) / LAMPORTS_PER_SOL,
    },
  };

  // Cache for 5 minutes
  if (redisClient.isOpen) {
    try {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(metrics));
    } catch (error) {
      console.warn('Redis set failed:', error);
    }
  }

  return metrics;
}

/**
 * Get transaction count time series
 * Returns hourly/daily transaction counts for charts
 */
export async function getTransactionTimeSeries(
  interval: 'hour' | 'day' = 'hour',
  startDate?: Date,
  endDate?: Date
): Promise<TimeSeriesDataPoint[]> {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (startDate) {
    conditions.push(`created_at >= $${paramIndex++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`created_at <= $${paramIndex++}`);
    values.push(endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const truncFunc = interval === 'hour' ? "date_trunc('hour', created_at)" : "date_trunc('day', created_at)";

  const query = `
    SELECT
      ${truncFunc} as time_bucket,
      COUNT(*) as count
    FROM transactions
    ${whereClause}
    GROUP BY time_bucket
    ORDER BY time_bucket ASC
  `;

  const result = await pool.query(query, values);

  return result.rows.map((row) => ({
    timestamp: new Date(row.time_bucket),
    value: parseInt(row.count, 10),
  }));
}

/**
 * Get success rate time series
 */
export async function getSuccessRateTimeSeries(
  interval: 'hour' | 'day' = 'hour',
  startDate?: Date,
  endDate?: Date
): Promise<TimeSeriesDataPoint[]> {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (startDate) {
    conditions.push(`created_at >= $${paramIndex++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`created_at <= $${paramIndex++}`);
    values.push(endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const truncFunc = interval === 'hour' ? "date_trunc('hour', created_at)" : "date_trunc('day', created_at)";

  const query = `
    SELECT
      ${truncFunc} as time_bucket,
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'confirmed') as successful
    FROM transactions
    ${whereClause}
    GROUP BY time_bucket
    ORDER BY time_bucket ASC
  `;

  const result = await pool.query(query, values);

  return result.rows.map((row) => {
    const total = parseInt(row.total, 10);
    const successful = parseInt(row.successful, 10);
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    return {
      timestamp: new Date(row.time_bucket),
      value: successRate,
    };
  });
}

/**
 * Get cost time series by delivery method
 */
export async function getCostTimeSeries(
  deliveryMethod?: DeliveryMethod,
  interval: 'hour' | 'day' = 'day',
  startDate?: Date,
  endDate?: Date
): Promise<TimeSeriesDataPoint[]> {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (deliveryMethod) {
    conditions.push(`delivery_method = $${paramIndex++}`);
    values.push(deliveryMethod);
  }
  if (startDate) {
    conditions.push(`created_at >= $${paramIndex++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`created_at <= $${paramIndex++}`);
    values.push(endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const truncFunc = interval === 'hour' ? "date_trunc('hour', created_at)" : "date_trunc('day', created_at)";

  const query = `
    SELECT
      ${truncFunc} as time_bucket,
      COALESCE(SUM(cost_lamports), 0) as total_cost
    FROM transactions
    ${whereClause}
    GROUP BY time_bucket
    ORDER BY time_bucket ASC
  `;

  const result = await pool.query(query, values);

  return result.rows.map((row) => ({
    timestamp: new Date(row.time_bucket),
    value: parseInt(row.total_cost, 10) / LAMPORTS_PER_SOL,
  }));
}

/**
 * Calculate cost comparison vs direct Jito/RPC usage
 *
 * This demonstrates Gateway's value by comparing actual costs
 * vs hypothetical costs if using Jito or RPC directly
 */
export async function getCostComparison(
  startDate?: Date,
  endDate?: Date
): Promise<CostComparison> {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (startDate) {
    conditions.push(`created_at >= $${paramIndex++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`created_at <= $${paramIndex++}`);
    values.push(endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      COUNT(*) as total_transactions,
      COALESCE(SUM(cost_lamports), 0) as total_cost_lamports,
      COALESCE(SUM(tip_lamports), 0) as total_tips_lamports,
      COALESCE(SUM(CASE WHEN tip_refunded THEN tip_lamports ELSE 0 END), 0) as refunded_tips_lamports
    FROM transactions
    ${whereClause}
  `;

  const result = await pool.query(query, values);
  const row = result.rows[0];

  const totalTransactions = parseInt(row.total_transactions, 10);
  const gatewayCostLamports = parseInt(row.total_cost_lamports, 10);
  const totalTipsLamports = parseInt(row.total_tips_lamports, 10);
  const refundedTipsLamports = parseInt(row.refunded_tips_lamports, 10);

  // Actual Gateway cost (in SOL)
  const gatewayCostSol = gatewayCostLamports / LAMPORTS_PER_SOL;

  // Hypothetical costs if using Jito exclusively (all transactions pay tips)
  // Assume average Jito tip = 0.001 SOL (1,000,000 lamports)
  const avgJitoTipLamports = 1_000_000;
  const directJitoCostLamports = totalTransactions * avgJitoTipLamports + gatewayCostLamports;
  const directJitoCostSol = directJitoCostLamports / LAMPORTS_PER_SOL;

  // Hypothetical costs if using RPC exclusively (base transaction fees)
  // Assume average RPC fee = 0.000005 SOL (5,000 lamports)
  const avgRpcFeeLamports = 5_000;
  const directRpcCostLamports = totalTransactions * avgRpcFeeLamports;
  const directRpcCostSol = directRpcCostLamports / LAMPORTS_PER_SOL;

  // Savings calculations
  const savingsVsJitoSol = directJitoCostSol - gatewayCostSol;
  const savingsVsRpcSol = gatewayCostSol - directRpcCostSol; // May be negative (Gateway more expensive)

  // Calculate percentage savings (vs Jito, since Gateway's main value is Jito optimization)
  const savingsPercentage = directJitoCostSol > 0 ? (savingsVsJitoSol / directJitoCostSol) * 100 : 0;

  return {
    gateway_cost_sol: gatewayCostSol,
    direct_jito_cost_sol: directJitoCostSol,
    direct_rpc_cost_sol: directRpcCostSol,
    savings_vs_jito_sol: savingsVsJitoSol,
    savings_vs_rpc_sol: savingsVsRpcSol,
    savings_percentage: savingsPercentage,
  };
}

/**
 * Get metrics by delivery method
 */
export async function getMetricsByDeliveryMethod(startDate?: Date, endDate?: Date) {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (startDate) {
    conditions.push(`created_at >= $${paramIndex++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`created_at <= $${paramIndex++}`);
    values.push(endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      delivery_method,
      COUNT(*) as total_count,
      COUNT(*) FILTER (WHERE status = 'confirmed') as success_count,
      COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
      COALESCE(SUM(cost_lamports), 0) as total_cost_lamports,
      AVG(response_time_ms) as avg_response_time_ms,
      AVG(confirmation_time_ms) as avg_confirmation_time_ms
    FROM transactions
    ${whereClause}
    GROUP BY delivery_method
  `;

  const result = await pool.query(query, values);

  return result.rows.map((row) => {
    const totalCount = parseInt(row.total_count, 10);
    const successCount = parseInt(row.success_count, 10);

    return {
      delivery_method: row.delivery_method,
      total_count: totalCount,
      success_count: successCount,
      failed_count: parseInt(row.failed_count, 10),
      success_rate: totalCount > 0 ? (successCount / totalCount) * 100 : 0,
      total_cost_sol: parseInt(row.total_cost_lamports, 10) / LAMPORTS_PER_SOL,
      avg_response_time_ms: row.avg_response_time_ms ? parseFloat(row.avg_response_time_ms) : null,
      avg_confirmation_time_ms: row.avg_confirmation_time_ms
        ? parseFloat(row.avg_confirmation_time_ms)
        : null,
    };
  });
}

/**
 * Get top error messages
 */
export async function getTopErrors(limit = 10, startDate?: Date, endDate?: Date) {
  const conditions: string[] = ['error_message IS NOT NULL'];
  const values: any[] = [];
  let paramIndex = 1;

  if (startDate) {
    conditions.push(`created_at >= $${paramIndex++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`created_at <= $${paramIndex++}`);
    values.push(endDate);
  }

  values.push(limit);

  const query = `
    SELECT
      error_code,
      error_message,
      COUNT(*) as occurrence_count,
      MAX(created_at) as last_occurrence
    FROM transactions
    WHERE ${conditions.join(' AND ')}
    GROUP BY error_code, error_message
    ORDER BY occurrence_count DESC
    LIMIT $${paramIndex}
  `;

  const result = await pool.query(query, values);

  return result.rows.map((row) => ({
    error_code: row.error_code,
    error_message: row.error_message,
    occurrence_count: parseInt(row.occurrence_count, 10),
    last_occurrence: new Date(row.last_occurrence),
  }));
}

/**
 * Clear analytics cache
 * Call this when new transactions are added
 */
export async function clearAnalyticsCache(): Promise<void> {
  if (redisClient.isOpen) {
    try {
      const keys = await redisClient.keys('analytics:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.warn('Failed to clear analytics cache:', error);
    }
  }
}
