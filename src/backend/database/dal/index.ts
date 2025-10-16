/**
 * Data Access Layer (DAL) - Barrel Export
 *
 * Central export point for all DAL functions.
 * Import from this file to access database operations.
 *
 * @example
 * import { createTransaction, getOverallMetrics } from './database/dal';
 */

// Transaction DAL exports
export {
  createTransaction,
  getTransactionBySignature,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getRecentTransactions,
  getTransactionsByStatus,
  getTotalTransactionCount,
  getCountByDeliveryMethod,
} from './transaction-dal';

// Analytics DAL exports
export {
  getOverallMetrics,
  getTransactionTimeSeries,
  getSuccessRateTimeSeries,
  getCostTimeSeries,
  getCostComparison,
  getMetricsByDeliveryMethod,
  getTopErrors,
  clearAnalyticsCache,
} from './analytics-dal';
