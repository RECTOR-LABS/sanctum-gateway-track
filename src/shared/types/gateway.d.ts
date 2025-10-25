/**
 * Gateway API Types
 * Based on Sanctum Gateway documentation
 */
export interface GatewayConfig {
    apiKey: string;
    baseUrl: string;
    network: 'mainnet' | 'devnet';
}
export type CuPriceLevel = 'low' | 'median' | 'high';
export type JitoTipLevel = 'low' | 'median' | 'high' | 'max';
export type DeliveryMethod = 'rpc' | 'jito' | 'triton' | 'paladin';
export interface OptimizeTransactionParams {
    transactions: Array<{
        params: [string];
    }>;
    cuPrice?: CuPriceLevel;
    jitoTip?: JitoTipLevel;
    deliveryDelay?: number;
    expirySlots?: number;
    deliveryMethods?: DeliveryMethod[];
}
export interface OptimizeTransactionResponse {
    jsonrpc: '2.0';
    id: string | number;
    result?: {
        signature: string;
        deliveryMethod: DeliveryMethod;
        cost: number;
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
export interface TransactionMetadata {
    signature: string;
    deliveryMethod: DeliveryMethod;
    cost: number;
    jitoTip?: number;
    jitoRefund?: number;
    success: boolean;
    timestamp: Date;
    responseTime?: number;
    error?: string;
}
export interface IGatewayClient {
    optimizeTransaction(params: OptimizeTransactionParams): Promise<OptimizeTransactionResponse>;
}
//# sourceMappingURL=gateway.d.ts.map