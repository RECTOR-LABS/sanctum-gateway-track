export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export type DeliveryMethod = 'jito' | 'rpc' | 'sanctum-sender' | 'unknown';

export interface Transaction {
  id: number;
  signature: string;
  status: TransactionStatus;
  delivery_method: DeliveryMethod;
  cost_lamports: number;
  tip_lamports?: number;
  tip_refunded?: boolean;
  response_time_ms: number;
  confirmation_time_ms?: number;
  blockhash?: string;
  last_valid_block_height?: number;
  slot?: number;
  block_time?: number;
  instruction_count: number;
  signer_pubkey: string;
  error_code?: string;
  error_message?: string;
  project_id?: number;
  raw_transaction_data?: any;
  gateway_response?: any;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsOverview {
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  success_rate: number;
  total_cost_sol: number;
  total_tips_sol: number;
  total_refunded_sol: number;
  avg_response_time_ms: number;
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

export interface CostComparison {
  gateway_cost_sol: number;
  direct_jito_cost_sol: number;
  direct_rpc_cost_sol: number;
  savings_vs_jito_sol: number;
  savings_vs_rpc_sol: number;
  savings_percentage: number;
}

export interface DeliveryMethodMetrics {
  delivery_method: DeliveryMethod;
  total_count: number;
  success_count: number;
  failed_count: number;
  success_rate: number;
  total_cost_sol: number;
  avg_response_time_ms: number;
  avg_confirmation_time_ms: number | null;
}

export interface TrendDataPoint {
  timestamp: string;
  value: number;
}
