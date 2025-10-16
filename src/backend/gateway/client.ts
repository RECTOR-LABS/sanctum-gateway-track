import type {
  GatewayConfig,
  OptimizeTransactionParams,
  OptimizeTransactionResponse,
  IGatewayClient,
} from '../../shared/types/gateway.js';

/**
 * Gateway API Client
 * Handles all communication with Sanctum Gateway API
 */
export class GatewayClient implements IGatewayClient {
  private config: GatewayConfig;
  private apiUrl: string;

  constructor(config: GatewayConfig) {
    this.config = config;
    this.apiUrl = `${config.baseUrl}?apiKey=${config.apiKey}`;
  }

  /**
   * Build a Gateway-optimized transaction
   * Gateway adds tip instructions and optimization automatically
   *
   * @param unsignedTransaction Base64-encoded unsigned transaction
   * @returns Modified transaction with tip instructions and blockhash info
   */
  async buildGatewayTransaction(unsignedTransaction: string): Promise<{
    transaction: string;
    latestBlockhash: {
      blockhash: string;
      lastValidBlockHeight: number;
    };
  }> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'buildGatewayTransaction',
          params: [unsignedTransaction],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gateway API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(
          `Gateway API error: ${data.error.message} (code: ${data.error.code})`
        );
      }

      if (!data.result) {
        throw new Error('Gateway response missing result field');
      }

      return data.result;
    } catch (error) {
      console.error('buildGatewayTransaction error:', error);
      throw error;
    }
  }

  /**
   * Send a signed transaction via Gateway
   *
   * @param signedTransaction Base64-encoded signed transaction
   * @returns Transaction signature
   */
  async sendTransaction(signedTransaction: string): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'sendTransaction',
          params: [signedTransaction, { encoding: 'base64' }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gateway API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(
          `Gateway API error: ${data.error.message} (code: ${data.error.code})`
        );
      }

      if (!data.result) {
        throw new Error('Gateway response missing transaction signature');
      }

      return data.result;
    } catch (error) {
      console.error('sendTransaction error:', error);
      throw error;
    }
  }

  /**
   * Optimize and submit transaction via Gateway (DEPRECATED)
   * Use buildGatewayTransaction + sendTransaction instead
   */
  async optimizeTransaction(
    params: OptimizeTransactionParams
  ): Promise<OptimizeTransactionResponse> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'optimizeTransaction',
          params,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gateway API request failed: ${response.statusText}`);
      }

      const data: OptimizeTransactionResponse = await response.json();

      if (data.error) {
        throw new Error(
          `Gateway API error: ${data.error.message} (code: ${data.error.code})`
        );
      }

      return data;
    } catch (error) {
      console.error('Gateway API error:', error);
      throw error;
    }
  }

  /**
   * Get the configured network
   */
  getNetwork(): 'mainnet' | 'devnet' {
    return this.config.network;
  }

  /**
   * Get the API URL (without exposing the API key)
   */
  getApiUrl(): string {
    return this.config.baseUrl;
  }
}

/**
 * Create a Gateway client instance from environment variables
 */
export function createGatewayClient(): GatewayClient {
  const apiKey = process.env.GATEWAY_API_KEY;
  const baseUrl = process.env.GATEWAY_BASE_URL || 'https://tpg.sanctum.so/v1/mainnet';

  if (!apiKey) {
    throw new Error('GATEWAY_API_KEY environment variable is required');
  }

  return new GatewayClient({
    apiKey,
    baseUrl,
    network: baseUrl.includes('devnet') ? 'devnet' : 'mainnet',
  });
}
