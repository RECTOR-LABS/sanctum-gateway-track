/**
 * Database Types and Interfaces
 *
 * Type-safe interfaces matching our PostgreSQL schema.
 * These types ensure compile-time safety when working with database records.
 */

/**
 * Transaction status enum
 */
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

/**
 * Delivery method enum - matches Gateway's delivery strategies
 */
export type DeliveryMethod = 'rpc' | 'jito' | 'triton' | 'paladin' | 'sanctum-sender' | 'unknown';

/**
 * Transaction record interface
 * Matches the transactions table schema in PostgreSQL
 */
export interface Transaction {
  id: number;
  signature: string;
  status: TransactionStatus;
  delivery_method: DeliveryMethod;
  cost_lamports: number;
  tip_lamports?: number;
  tip_refunded?: boolean;
  response_time_ms?: number;
  confirmation_time_ms?: number;
  slot?: number;
  block_time?: Date;
  blockhash?: string;
  last_valid_block_height?: number;
  instruction_count: number;
  signer_pubkey: string;
  error_code?: string;
  error_message?: string;
  project_id?: number;
  raw_transaction_data?: Record<string, any>;
  gateway_response?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

/**
 * Input type for creating a new transaction
 * Omits auto-generated fields (id, timestamps)
 */
export interface CreateTransactionInput {
  signature: string;
  status: TransactionStatus;
  delivery_method: DeliveryMethod;
  cost_lamports: number;
  tip_lamports?: number;
  tip_refunded?: boolean;
  response_time_ms?: number;
  confirmation_time_ms?: number;
  slot?: number;
  block_time?: Date;
  blockhash?: string;
  last_valid_block_height?: number;
  instruction_count: number;
  signer_pubkey: string;
  error_code?: string;
  error_message?: string;
  project_id?: number;
  raw_transaction_data?: Record<string, any>;
  gateway_response?: Record<string, any>;
}

/**
 * Input type for updating a transaction
 * All fields optional except signature (used for lookup)
 */
export interface UpdateTransactionInput {
  signature: string;
  status?: TransactionStatus;
  delivery_method?: DeliveryMethod;
  cost_lamports?: number;
  tip_lamports?: number;
  tip_refunded?: boolean;
  response_time_ms?: number;
  confirmation_time_ms?: number;
  slot?: number;
  block_time?: Date;
  blockhash?: string;
  last_valid_block_height?: number;
  instruction_count?: number;
  signer_pubkey?: string;
  error_code?: string;
  error_message?: string;
  project_id?: number;
  raw_transaction_data?: Record<string, any>;
  gateway_response?: Record<string, any>;
}

/**
 * Analytics snapshot interface
 * Pre-calculated metrics stored for fast dashboard loading
 */
export interface AnalyticsSnapshot {
  id: number;
  snapshot_date: Date;
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  total_cost_lamports: number;
  total_tips_lamports: number;
  total_tips_refunded_lamports: number;
  avg_response_time_ms?: number;
  avg_confirmation_time_ms?: number;
  jito_transaction_count: number;
  rpc_transaction_count: number;
  sanctum_sender_count: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Query filter for fetching transactions
 */
export interface TransactionFilter {
  status?: TransactionStatus;
  delivery_method?: DeliveryMethod;
  signer_pubkey?: string;
  project_id?: number;
  start_date?: Date;
  end_date?: Date;
  min_cost?: number;
  max_cost?: number;
  limit?: number;
  offset?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * Analytics metrics response
 */
export interface AnalyticsMetrics {
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  success_rate: number;
  total_cost_sol: number;
  total_tips_sol: number;
  total_refunded_sol: number;
  avg_response_time_ms: number | null;
  avg_confirmation_time_ms: number | null;
  delivery_breakdown: {
    jito: number;
    rpc: number;
    sanctum_sender: number;
    unknown: number;
  };
  cost_by_delivery: {
    jito_cost_sol: number;
    rpc_cost_sol: number;
    sanctum_sender_cost_sol: number;
  };
}

/**
 * Time-series data point for charts
 */
export interface TimeSeriesDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

/**
 * Cost comparison metrics
 */
export interface CostComparison {
  gateway_cost_sol: number;
  direct_jito_cost_sol: number;
  direct_rpc_cost_sol: number;
  savings_vs_jito_sol: number;
  savings_vs_rpc_sol: number;
  savings_percentage: number;
}
