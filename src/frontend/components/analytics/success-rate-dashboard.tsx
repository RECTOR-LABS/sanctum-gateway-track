'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DeliveryMethodMetrics } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { CardLoadingState } from '@/components/ui/loading-state';
import { getDeliveryMethodName } from '@/lib/format';

interface SuccessRateDashboardProps {
  data?: DeliveryMethodMetrics[];
  isLoading?: boolean;
}

export function SuccessRateDashboard({ data, isLoading }: SuccessRateDashboardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Success Rate Analysis</CardTitle>
          <CardDescription>Transaction success rates by delivery method</CardDescription>
        </CardHeader>
        <CardContent>
          <CardLoadingState />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  // Calculate overall success rate
  const totalCount = data.reduce((sum, m) => sum + m.total_count, 0);
  const totalSuccess = data.reduce((sum, m) => sum + m.success_count, 0);
  const overallSuccessRate = totalCount > 0 ? (totalSuccess / totalCount) * 100 : 0;

  // Prepare chart data
  const chartData = data.map((item) => ({
    name: getDeliveryMethodName(item.delivery_method),
    successRate: item.success_rate,
    successCount: item.success_count,
    failedCount: item.failed_count,
    totalCount: item.total_count,
  }));

  // Colors for bars
  const getBarColor = (rate: number) => {
    if (rate >= 95) return 'hsl(142, 76%, 56%)'; // Green
    if (rate >= 85) return 'hsl(47, 96%, 53%)'; // Yellow
    return 'hsl(0, 84%, 60%)'; // Red
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Success Rate Analysis</CardTitle>
        <CardDescription>Transaction success rates by delivery method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Success Rate */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Overall Success Rate</div>
              <div className="text-4xl font-bold text-green-500">
                {overallSuccessRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {totalSuccess} of {totalCount} transactions succeeded
              </div>
            </div>
            <CheckCircle2 className="h-16 w-16 text-green-500/30" />
          </div>
        </div>

        {/* Success Rate Comparison Chart */}
        <div>
          <h4 className="text-sm font-medium mb-3">Success Rate by Delivery Method</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 space-y-1">
                        <div className="font-medium">{data.name}</div>
                        <div className="text-sm text-green-500">
                          Success: {data.successCount} ({data.successRate.toFixed(1)}%)
                        </div>
                        <div className="text-sm text-red-500">
                          Failed: {data.failedCount}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total: {data.totalCount}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="successRate" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.successRate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Method-by-Method Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Detailed Breakdown</h4>
          {data.map((method) => {
            const isHighSuccess = method.success_rate >= 95;
            return (
              <div
                key={method.delivery_method}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium">
                      {getDeliveryMethodName(method.delivery_method)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {method.total_count} total transactions
                    </div>
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isHighSuccess ? 'text-green-500' : 'text-orange-500'
                    }`}
                  >
                    {method.success_rate.toFixed(1)}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Success:</span>
                    <span className="font-medium">{method.success_count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-muted-foreground">Failed:</span>
                    <span className="font-medium">{method.failed_count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-muted-foreground">Avg Response:</span>
                    <span className="font-medium">{Math.round(method.avg_response_time_ms)}ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Total Cost:</span>
                    <span className="font-mono text-xs">
                      {method.total_cost_sol.toFixed(6)} SOL
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gateway Reliability Insight */}
        {overallSuccessRate >= 95 && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="text-sm font-medium">Excellent Reliability</div>
                <div className="text-sm text-muted-foreground">
                  Gateway's intelligent routing achieves {overallSuccessRate.toFixed(1)}% success rate,
                  ensuring your transactions get through reliably.
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
