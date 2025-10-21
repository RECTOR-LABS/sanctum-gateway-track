'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { CostBreakdown } from '@/components/analytics/cost-breakdown';
import { SavingsCalculator } from '@/components/analytics/savings-calculator';
import { CostTrend } from '@/components/analytics/cost-trend';
import { AnalyticsFiltersComponent, AnalyticsFilters } from '@/components/analytics/analytics-filters';
import { SuccessRateDashboard } from '@/components/analytics/success-rate-dashboard';
import { FailureAnalysis } from '@/components/analytics/failure-analysis';
import { ResponseTimeAnalysis } from '@/components/analytics/response-time-analysis';
import { HistoricalTrends } from '@/components/analytics/historical-trends';
import { ComparativeAnalysis } from '@/components/analytics/comparative-analysis';
import { AlertSystem } from '@/components/analytics/alert-system';
import { ExportButton } from '@/components/analytics/export-button';
import {
  formatAnalyticsForExport,
  formatMethodMetricsForExport,
  generateFilename,
} from '@/lib/export';
import { Download } from 'lucide-react';

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({});

  // Fetch overview for cost breakdown
  const { data: overview, error: overviewError } = useSWR(
    ['overview', filters.startDate, filters.endDate],
    () => apiClient.getOverview(filters.startDate, filters.endDate),
    { refreshInterval: 30000 }
  );

  // Fetch cost comparison for savings calculator
  const { data: costComparison, error: costError } = useSWR(
    ['cost-comparison', filters.startDate, filters.endDate],
    () => apiClient.getCostAnalysis(filters.startDate, filters.endDate),
    { refreshInterval: 30000 }
  );

  // Fetch cost trends for each delivery method
  const { data: jitoTrends } = useSWR(
    ['cost-trends-jito', filters.startDate, filters.endDate],
    () => apiClient.getTrends('cost', 'hour', 'jito', filters.startDate, filters.endDate),
    { refreshInterval: 60000 }
  );

  const { data: rpcTrends } = useSWR(
    ['cost-trends-rpc', filters.startDate, filters.endDate],
    () => apiClient.getTrends('cost', 'hour', 'rpc', filters.startDate, filters.endDate),
    { refreshInterval: 60000 }
  );

  const { data: sanctumTrends } = useSWR(
    ['cost-trends-sanctum', filters.startDate, filters.endDate],
    () => apiClient.getTrends('cost', 'hour', 'sanctum-sender', filters.startDate, filters.endDate),
    { refreshInterval: 60000 }
  );

  // Fetch success rate metrics
  const { data: methodMetrics } = useSWR(
    ['method-metrics', filters.startDate, filters.endDate],
    () => apiClient.getMethodMetrics(filters.startDate, filters.endDate),
    { refreshInterval: 30000 }
  );

  // Fetch failure data
  const { data: topErrors } = useSWR(
    ['top-errors', filters.startDate, filters.endDate],
    () => apiClient.getTopErrors(10, filters.startDate, filters.endDate),
    { refreshInterval: 60000 }
  );

  // Fetch historical trends (volume, success rate, cost)
  const { data: volumeTrends } = useSWR(
    ['volume-trends', filters.startDate, filters.endDate],
    () => apiClient.getTrends('volume', 'hour', undefined, filters.startDate, filters.endDate),
    { refreshInterval: 60000 }
  );

  const { data: successTrends } = useSWR(
    ['success-trends', filters.startDate, filters.endDate],
    () => apiClient.getTrends('success_rate', 'hour', undefined, filters.startDate, filters.endDate),
    { refreshInterval: 60000 }
  );

  // Fetch alerts (mock data for now - backend implementation pending)
  const { data: alerts } = useSWR(
    ['alerts'],
    () => Promise.resolve([]), // TODO: Implement alerts API endpoint
    { refreshInterval: 30000 }
  );

  // Prepare export data
  const exportData = overview ? formatAnalyticsForExport(overview) : [];
  const exportMethodData = methodMetrics ? formatMethodMetricsForExport(methodMetrics) : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Export */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for Gateway transactions
          </p>
        </div>
        <ExportButton
          data={exportData}
          filename={generateFilename('gateway-analytics')}
          formats={['csv', 'json']}
        />
      </div>

      {/* Filters */}
      <AnalyticsFiltersComponent onFiltersChange={setFilters} />

      {/* Alert System */}
      <AlertSystem alerts={alerts} isLoading={!alerts} />

      {/* Cost Analysis Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Cost Analysis</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <CostBreakdown
              data={overview}
              isLoading={!overview && !overviewError}
            />
            <SavingsCalculator
              data={costComparison}
              isLoading={!costComparison && !costError}
            />
          </div>
        </div>

        <CostTrend
          jitoData={jitoTrends}
          rpcData={rpcTrends}
          sanctumData={sanctumTrends}
          isLoading={!jitoTrends && !rpcTrends && !sanctumTrends}
        />
      </div>

      {/* Success Rate & Performance Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Success Rate & Performance</h2>

        <SuccessRateDashboard
          data={methodMetrics}
          isLoading={!methodMetrics}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FailureAnalysis
            errors={topErrors}
            failureRateByMethod={methodMetrics?.map(m => ({
              delivery_method: m.delivery_method,
              failure_rate: ((m.failed_count / m.total_count) * 100),
              failed_count: m.failed_count,
              total_count: m.total_count,
            }))}
            isLoading={!topErrors}
          />
          <ResponseTimeAnalysis
            data={methodMetrics}
            isLoading={!methodMetrics}
          />
        </div>
      </div>

      {/* Historical Trends Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Historical Trends</h2>

        <HistoricalTrends
          volumeData={volumeTrends}
          successRateData={successTrends}
          costData={jitoTrends} // Using jito as overall cost proxy
          isLoading={!volumeTrends}
        />
      </div>

      {/* Gateway Value Proposition */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Gateway Value Proposition</h2>

        <ComparativeAnalysis
          data={costComparison}
          isLoading={!costComparison}
        />
      </div>
    </div>
  );
}
