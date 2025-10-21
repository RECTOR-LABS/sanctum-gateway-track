'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { MetricsOverview } from '@/components/dashboard/metrics-overview';
import { TransactionTrendChart } from '@/components/charts/transaction-trend-chart';
import { DeliveryMethodChart } from '@/components/charts/delivery-method-chart';
import { CostComparisonChart } from '@/components/charts/cost-comparison-chart';

export default function DashboardPage() {
  // Fetch overview metrics
  const {
    data: overview,
    error: overviewError,
    mutate: refreshOverview,
  } = useSWR('overview', () => apiClient.getOverview(), {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch transaction trends
  const {
    data: trends,
    error: trendsError,
  } = useSWR('trends', () => apiClient.getTrends('transactions', 'hour'), {
    refreshInterval: 60000, // Refresh every minute
  });

  // Fetch delivery method breakdown
  const {
    data: deliveryMethods,
    error: deliveryError,
  } = useSWR('delivery-methods', () => apiClient.getDeliveryMethodBreakdown(), {
    refreshInterval: 30000,
  });

  // Fetch cost comparison
  const {
    data: costComparison,
    error: costError,
  } = useSWR('cost-comparison', () => apiClient.getCostAnalysis(), {
    refreshInterval: 30000,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time transaction analytics and Gateway insights
        </p>
      </div>

      {/* Metrics Overview */}
      <MetricsOverview
        data={overview}
        isLoading={!overview && !overviewError}
        error={overviewError}
        onRetry={refreshOverview}
      />

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <TransactionTrendChart
          data={trends}
          isLoading={!trends && !trendsError}
        />
        <DeliveryMethodChart
          data={deliveryMethods}
          isLoading={!deliveryMethods && !deliveryError}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <CostComparisonChart
          data={costComparison}
          isLoading={!costComparison && !costError}
        />
      </div>
    </div>
  );
}
