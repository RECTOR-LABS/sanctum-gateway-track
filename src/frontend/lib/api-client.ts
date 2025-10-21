import type {
  Transaction,
  AnalyticsOverview,
  CostComparison,
  DeliveryMethodMetrics,
  TrendDataPoint,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface TransactionFilters {
  status?: 'pending' | 'confirmed' | 'failed';
  delivery_method?: string;
  signer_pubkey?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`[API] Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  // Analytics Endpoints

  async getOverview(startDate?: string, endDate?: string): Promise<AnalyticsOverview> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const query = params.toString();
    const response = await this.fetch<APIResponse<AnalyticsOverview>>(
      `/api/analytics/overview${query ? `?${query}` : ''}`
    );

    return response.data;
  }

  async getTransactions(filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const query = params.toString();
    return this.fetch<PaginatedResponse<Transaction>>(
      `/api/analytics/transactions${query ? `?${query}` : ''}`
    );
  }

  async getCostAnalysis(startDate?: string, endDate?: string): Promise<CostComparison> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const query = params.toString();
    const response = await this.fetch<APIResponse<CostComparison>>(
      `/api/analytics/costs${query ? `?${query}` : ''}`
    );

    return response.data;
  }

  async getSuccessRates(
    startDate?: string,
    endDate?: string
  ): Promise<DeliveryMethodMetrics[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const query = params.toString();
    const response = await this.fetch<APIResponse<DeliveryMethodMetrics[]>>(
      `/api/analytics/success-rates${query ? `?${query}` : ''}`
    );

    return response.data;
  }

  async getTrends(
    type: 'transactions' | 'success_rate' | 'cost' | 'volume',
    interval: 'hour' | 'day' = 'hour',
    deliveryMethod?: string,
    startDate?: string,
    endDate?: string
  ): Promise<TrendDataPoint[]> {
    const params = new URLSearchParams();
    params.append('type', type);
    params.append('interval', interval);
    if (deliveryMethod) params.append('delivery_method', deliveryMethod);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await this.fetch<APIResponse<TrendDataPoint[]>>(
      `/api/analytics/trends?${params.toString()}`
    );

    return response.data;
  }

  async getDeliveryMethodBreakdown(
    startDate?: string,
    endDate?: string
  ): Promise<DeliveryMethodMetrics[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const query = params.toString();
    const response = await this.fetch<APIResponse<DeliveryMethodMetrics[]>>(
      `/api/analytics/delivery-methods${query ? `?${query}` : ''}`
    );

    return response.data;
  }

  // Alias for getDeliveryMethodBreakdown (used in analytics page)
  async getMethodMetrics(
    startDate?: string,
    endDate?: string
  ): Promise<DeliveryMethodMetrics[]> {
    return this.getDeliveryMethodBreakdown(startDate, endDate);
  }

  async getTopErrors(
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<any[]> {
    const params = new URLSearchParams();
    params.append('limit', String(limit));
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await this.fetch<APIResponse<any[]>>(
      `/api/analytics/errors?${params.toString()}`
    );

    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<any> {
    return this.fetch('/health');
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export class for custom instances
export { APIClient };
