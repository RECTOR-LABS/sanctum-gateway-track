'use client';

import { MetricCard } from './metric-card';
import { AnalyticsOverview } from '@/lib/types';
import { Receipt, CheckCircle2, DollarSign, Clock } from 'lucide-react';
import { CardLoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';

interface MetricsOverviewProps {
  data?: AnalyticsOverview;
  isLoading?: boolean;
  error?: Error;
  onRetry?: () => void;
}

export function MetricsOverview({ data, isLoading, error, onRetry }: MetricsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <CardLoadingState />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load metrics"
        message={error.message}
        retry={onRetry}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Transactions"
        value={data.total_transactions.toLocaleString()}
        description={`${data.successful_transactions} successful, ${data.failed_transactions} failed`}
        icon={Receipt}
      />
      <MetricCard
        title="Success Rate"
        value={`${data.success_rate.toFixed(1)}%`}
        description={`${data.successful_transactions} of ${data.total_transactions} transactions`}
        icon={CheckCircle2}
      />
      <MetricCard
        title="Total Cost"
        value={`${data.total_cost_sol.toFixed(4)} SOL`}
        description={`${data.total_tips_sol.toFixed(4)} SOL in tips`}
        icon={DollarSign}
      />
      <MetricCard
        title="Avg Response Time"
        value={`${Math.round(data.avg_response_time_ms)}ms`}
        description={
          data.avg_confirmation_time_ms
            ? `${Math.round(data.avg_confirmation_time_ms)}ms confirmation`
            : 'No confirmations yet'
        }
        icon={Clock}
      />
    </div>
  );
}
