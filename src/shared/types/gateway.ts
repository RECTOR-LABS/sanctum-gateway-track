/**
 * Gateway API Types
 * Based on Sanctum Gateway documentation
 */

// Gateway API configuration
export interface GatewayConfig {
  apiKey: string;
  baseUrl: string;
  network: 'mainnet' | 'devnet';
}

// Compute Unit (CU) price tiers
export type CuPriceLevel = 'low' | 'median' | 'high';

// Jito tip amount tiers
export type JitoTipLevel = 'low' | 'median' | 'high' | 'max';

// Delivery methods supported by Gateway
export type DeliveryMethod = 'rpc' | 'jito' | 'triton' | 'paladin' | 'sanctum-sender' | 'unknown';

// Transaction optimization parameters
export interface OptimizeTransactionParams {
  transactions: Array<{
    params: [string]; // Base64-encoded transaction
  }>;
  cuPrice?: CuPriceLevel;
  jitoTip?: JitoTipLevel;
  deliveryDelay?: number; // milliseconds
  expirySlots?: number;
  deliveryMethods?: DeliveryMethod[];
}

// Gateway API response for optimized transaction
export interface OptimizeTransactionResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: {
    signature: string;
    deliveryMethod: DeliveryMethod;
    cost: number; // in lamports
    jitoTip?: number;
    jitoRefund?: number;
    timestamp: string;
  };
  error?: {
    code: number;
    message: string;
    data?: {
      gatewayErrorCode: string;
    };
  };
}

// Transaction metadata for tracking/analytics
export interface TransactionMetadata {
  signature: string;
  deliveryMethod: DeliveryMethod;
  cost: number;
  jitoTip?: number;
  jitoRefund?: number;
  success: boolean;
  timestamp: Date;
  responseTime?: number; // milliseconds
  error?: string;
}

// Gateway client interface
export interface IGatewayClient {
  optimizeTransaction(
    params: OptimizeTransactionParams
  ): Promise<OptimizeTransactionResponse>;
}
