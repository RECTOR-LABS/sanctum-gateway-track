'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Clock, Zap, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CardLoadingState } from '@/components/ui/loading-state';
import { getDeliveryMethodName } from '@/lib/format';

interface ResponseTimeData {
  delivery_method: string;
  avg_response_time_ms: number;
  min_response_time_ms: number;
  max_response_time_ms: number;
  p50_response_time_ms?: number;
  p95_response_time_ms?: number;
  p99_response_time_ms?: number;
  total_count: number;
}

interface ResponseTimeAnalysisProps {
  data?: ResponseTimeData[];
  distribution?: {
    bucket_start: number;
    bucket_end: number;
    count: number;
  }[];
  isLoading?: boolean;
}

export function ResponseTimeAnalysis({ data, distribution, isLoading }: ResponseTimeAnalysisProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response Time Analysis</CardTitle>
          <CardDescription>Performance metrics by delivery method</CardDescription>
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

  // Calculate overall statistics
  const totalTransactions = data.reduce((sum, d) => sum + d.total_count, 0);
  const weightedAvg = data.reduce(
    (sum, d) => sum + (d.avg_response_time_ms * d.total_count),
    0
  ) / totalTransactions;

  const fastestMethod = data.reduce((min, d) =>
    d.avg_response_time_ms < min.avg_response_time_ms ? d : min
  );
  const slowestMethod = data.reduce((max, d) =>
    d.avg_response_time_ms > max.avg_response_time_ms ? d : max
  );

  // Performance rating
  const getPerformanceRating = (avgMs: number) => {
    if (avgMs < 1000) return { rating: 'Excellent', color: 'text-green-500', icon: Zap };
    if (avgMs < 3000) return { rating: 'Good', color: 'text-blue-500', icon: CheckCircle2 };
    if (avgMs < 5000) return { rating: 'Fair', color: 'text-orange-500', icon: Clock };
    return { rating: 'Needs Improvement', color: 'text-red-500', icon: AlertCircle };
  };

  const overallRating = getPerformanceRating(weightedAvg);
  const OverallIcon = overallRating.icon;

  // Prepare chart data
  const chartData = data.map((item) => ({
    name: getDeliveryMethodName(item.delivery_method),
    avg: Math.round(item.avg_response_time_ms),
    min: Math.round(item.min_response_time_ms),
    max: Math.round(item.max_response_time_ms),
    p50: item.p50_response_time_ms ? Math.round(item.p50_response_time_ms) : undefined,
    p95: item.p95_response_time_ms ? Math.round(item.p95_response_time_ms) : undefined,
    p99: item.p99_response_time_ms ? Math.round(item.p99_response_time_ms) : undefined,
  }));

  // Color coding for bars
  const getBarColor = (avgMs: number) => {
    if (avgMs < 1000) return 'hsl(142, 76%, 56%)'; // Green
    if (avgMs < 3000) return 'hsl(210, 70%, 60%)'; // Blue
    if (avgMs < 5000) return 'hsl(47, 96%, 53%)'; // Yellow
    return 'hsl(0, 84%, 60%)'; // Red
  };

  // Distribution chart data
  const distributionData = distribution?.map((bucket) => ({
    range: `${bucket.bucket_start}-${bucket.bucket_end}ms`,
    count: bucket.count,
    percentage: ((bucket.count / totalTransactions) * 100).toFixed(1),
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time Analysis</CardTitle>
        <CardDescription>Performance metrics by delivery method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Performance */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Overall Average Response Time</div>
              <div className="text-4xl font-bold">{Math.round(weightedAvg)}ms</div>
              <div className="flex items-center gap-2 mt-2">
                <OverallIcon className={`h-4 w-4 ${overallRating.color}`} />
                <span className={`text-sm font-medium ${overallRating.color}`}>
                  {overallRating.rating}
                </span>
              </div>
            </div>
            <Clock className="h-16 w-16 text-blue-500/30" />
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-green-500" />
              <div className="text-sm text-muted-foreground">Fastest Method</div>
            </div>
            <div className="font-medium">{getDeliveryMethodName(fastestMethod.delivery_method)}</div>
            <div className="text-sm text-green-500">{Math.round(fastestMethod.avg_response_time_ms)}ms avg</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div className="text-sm text-muted-foreground">Total Analyzed</div>
            </div>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <div className="text-sm text-muted-foreground">transactions</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div className="text-sm text-muted-foreground">Slowest Method</div>
            </div>
            <div className="font-medium">{getDeliveryMethodName(slowestMethod.delivery_method)}</div>
            <div className="text-sm text-orange-500">{Math.round(slowestMethod.avg_response_time_ms)}ms avg</div>
          </div>
        </div>

        {/* Average Response Time by Method */}
        <div>
          <h4 className="text-sm font-medium mb-3">Average Response Time by Method</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
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
                        <div className="text-sm">
                          <span className="text-muted-foreground">Average:</span> {data.avg}ms
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Min:</span> {data.min}ms
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Max:</span> {data.max}ms
                        </div>
                        {data.p95 && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">P95:</span> {data.p95}ms
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.avg)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time Distribution */}
        {distributionData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Response Time Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" className="text-xs" angle={-45} textAnchor="end" height={80} />
                <YAxis className="text-xs" label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
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
                        <div className="p-3">
                          <div className="font-medium">{data.range}</div>
                          <div className="text-sm">
                            Count: {data.count} ({data.percentage}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Method-by-Method Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Detailed Performance Metrics</h4>
          {data.map((method) => {
            const rating = getPerformanceRating(method.avg_response_time_ms);
            const RatingIcon = rating.icon;

            return (
              <div key={method.delivery_method} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium">{getDeliveryMethodName(method.delivery_method)}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingIcon className={`h-3 w-3 ${rating.color}`} />
                      <Badge variant="outline" className={rating.color}>
                        {rating.rating}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{Math.round(method.avg_response_time_ms)}ms</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Min</div>
                    <div className="font-medium">{Math.round(method.min_response_time_ms)}ms</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Max</div>
                    <div className="font-medium">{Math.round(method.max_response_time_ms)}ms</div>
                  </div>
                  {method.p95_response_time_ms && (
                    <div>
                      <div className="text-muted-foreground">P95</div>
                      <div className="font-medium">{Math.round(method.p95_response_time_ms)}ms</div>
                    </div>
                  )}
                  {method.p99_response_time_ms && (
                    <div>
                      <div className="text-muted-foreground">P99</div>
                      <div className="font-medium">{Math.round(method.p99_response_time_ms)}ms</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Insights */}
        {weightedAvg < 2000 && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="text-sm font-medium">Excellent Performance</div>
                <div className="text-sm text-muted-foreground">
                  Gateway's intelligent routing delivers sub-2-second average response times,
                  ensuring a smooth user experience for your transactions.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Comparison Insight */}
        {data.length > 1 && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="text-sm font-medium">Multi-Method Performance</div>
                <div className="text-sm text-muted-foreground">
                  Gateway dynamically routes to the fastest available method. {getDeliveryMethodName(fastestMethod.delivery_method)}
                  {' '}is currently {Math.round(((slowestMethod.avg_response_time_ms - fastestMethod.avg_response_time_ms) / fastestMethod.avg_response_time_ms) * 100)}%
                  faster than {getDeliveryMethodName(slowestMethod.delivery_method)}.
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
