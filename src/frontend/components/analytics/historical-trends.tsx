'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendDataPoint } from '@/lib/types';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from 'recharts';
import { ChartLoadingState } from '@/components/ui/loading-state';
import { Calendar, TrendingUp, Activity, DollarSign, Target } from 'lucide-react';

interface HistoricalTrendsProps {
  volumeData?: TrendDataPoint[];
  successRateData?: TrendDataPoint[];
  costData?: TrendDataPoint[];
  methodDistributionData?: {
    timestamp: string;
    jito: number;
    rpc: number;
    sanctum: number;
  }[];
  isLoading?: boolean;
}

type TimeRange = '24h' | '7d' | '30d' | 'all';
type MetricView = 'volume' | 'success' | 'cost' | 'methods' | 'combined';

export function HistoricalTrends({
  volumeData,
  successRateData,
  costData,
  methodDistributionData,
  isLoading,
}: HistoricalTrendsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [metricView, setMetricView] = useState<MetricView>('combined');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical Trends</CardTitle>
          <CardDescription>Long-term performance and usage patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartLoadingState />
        </CardContent>
      </Card>
    );
  }

  if (!volumeData || volumeData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical Trends</CardTitle>
          <CardDescription>Long-term performance and usage patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No historical data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format timestamp for display
  const formatTimestamp = (timestamp: string, range: TimeRange) => {
    const date = new Date(timestamp);
    if (range === '24h') {
      return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    }
    if (range === '7d') {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric' });
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Combine all metrics into one dataset
  const combinedData = volumeData.map((volume, index) => ({
    timestamp: volume.timestamp,
    volume: volume.value,
    successRate: successRateData?.[index]?.value || 0,
    cost: costData?.[index]?.value || 0,
    jitoUsage: methodDistributionData?.[index]?.jito || 0,
    rpcUsage: methodDistributionData?.[index]?.rpc || 0,
    sanctumUsage: methodDistributionData?.[index]?.sanctum || 0,
  }));

  // Calculate summary statistics
  const totalVolume = volumeData.reduce((sum, d) => sum + d.value, 0);
  const avgSuccessRate = successRateData
    ? successRateData.reduce((sum, d) => sum + d.value, 0) / successRateData.length
    : 0;
  const totalCost = costData ? costData.reduce((sum, d) => sum + d.value, 0) : 0;

  // Trend analysis
  const volumeTrend = volumeData.length > 1
    ? ((volumeData[volumeData.length - 1].value - volumeData[0].value) / volumeData[0].value) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Historical Trends</CardTitle>
            <CardDescription>Long-term performance and usage patterns</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {(['24h', '7d', '30d', 'all'] as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </div>
            <div className="text-2xl font-bold">{totalVolume}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {volumeTrend > 0 ? '↑' : '↓'} {Math.abs(volumeTrend).toFixed(1)}% trend
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-500" />
              <div className="text-sm text-muted-foreground">Avg Success Rate</div>
            </div>
            <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground mt-1">across all periods</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <div className="text-sm text-muted-foreground">Total Cost</div>
            </div>
            <div className="text-2xl font-bold font-mono">{totalCost.toFixed(4)}</div>
            <div className="text-xs text-muted-foreground mt-1">SOL</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div className="text-sm text-muted-foreground">Data Points</div>
            </div>
            <div className="text-2xl font-bold">{volumeData.length}</div>
            <div className="text-xs text-muted-foreground mt-1">time intervals</div>
          </div>
        </div>

        {/* Metric View Selector */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={metricView === 'combined' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMetricView('combined')}
          >
            Combined View
          </Button>
          <Button
            variant={metricView === 'volume' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMetricView('volume')}
          >
            Volume
          </Button>
          <Button
            variant={metricView === 'success' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMetricView('success')}
          >
            Success Rate
          </Button>
          <Button
            variant={metricView === 'cost' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMetricView('cost')}
          >
            Cost
          </Button>
          <Button
            variant={metricView === 'methods' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMetricView('methods')}
          >
            Method Distribution
          </Button>
        </div>

        {/* Combined Multi-Metric View */}
        {metricView === 'combined' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Transaction Volume Over Time</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => formatTimestamp(value, timeRange)}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="hsl(210, 70%, 60%)"
                    fill="hsl(210, 70%, 60%)"
                    fillOpacity={0.2}
                    name="Transactions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Success Rate Trend</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => formatTimestamp(value, timeRange)}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                  <Line
                    type="monotone"
                    dataKey="successRate"
                    stroke="hsl(142, 76%, 56%)"
                    strokeWidth={2}
                    dot={false}
                    name="Success Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Volume-Only View */}
        {metricView === 'volume' && (
          <div>
            <h4 className="text-sm font-medium mb-3">Transaction Volume Trend</h4>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => formatTimestamp(value, timeRange)}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="volume"
                  fill="hsl(210, 70%, 60%)"
                  fillOpacity={0.3}
                  stroke="hsl(210, 70%, 60%)"
                  strokeWidth={2}
                  name="Transaction Count"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Success Rate View */}
        {metricView === 'success' && successRateData && (
          <div>
            <h4 className="text-sm font-medium mb-3">Success Rate Over Time</h4>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => formatTimestamp(value, timeRange)}
                  className="text-xs"
                />
                <YAxis className="text-xs" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="successRate"
                  fill="hsl(142, 76%, 56%)"
                  fillOpacity={0.3}
                  stroke="hsl(142, 76%, 56%)"
                  strokeWidth={2}
                  name="Success Rate %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Cost View */}
        {metricView === 'cost' && costData && (
          <div>
            <h4 className="text-sm font-medium mb-3">Cost Trend Over Time</h4>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => formatTimestamp(value, timeRange)}
                  className="text-xs"
                />
                <YAxis
                  className="text-xs"
                  tickFormatter={(value) => `${value.toFixed(6)} SOL`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => `${value.toFixed(6)} SOL`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="hsl(280, 70%, 60%)"
                  strokeWidth={2}
                  dot={false}
                  name="Cost per Period"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Method Distribution View */}
        {metricView === 'methods' && methodDistributionData && (
          <div>
            <h4 className="text-sm font-medium mb-3">Delivery Method Distribution Over Time</h4>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => formatTimestamp(value, timeRange)}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="sanctumUsage"
                  stackId="1"
                  stroke="hsl(180, 70%, 60%)"
                  fill="hsl(180, 70%, 60%)"
                  fillOpacity={0.8}
                  name="Sanctum Sender"
                />
                <Area
                  type="monotone"
                  dataKey="jitoUsage"
                  stackId="1"
                  stroke="hsl(280, 70%, 60%)"
                  fill="hsl(280, 70%, 60%)"
                  fillOpacity={0.8}
                  name="Jito"
                />
                <Area
                  type="monotone"
                  dataKey="rpcUsage"
                  stackId="1"
                  stroke="hsl(210, 70%, 60%)"
                  fill="hsl(210, 70%, 60%)"
                  fillOpacity={0.8}
                  name="RPC"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Insights */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="text-sm font-medium">Historical Insights</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {totalVolume} total transactions processed over the selected period</li>
                <li>• Average success rate maintained at {avgSuccessRate.toFixed(1)}%</li>
                {volumeTrend !== 0 && (
                  <li>
                    • Transaction volume {volumeTrend > 0 ? 'increased' : 'decreased'} by {Math.abs(volumeTrend).toFixed(1)}%
                  </li>
                )}
                <li>• Total network fees spent: {totalCost.toFixed(6)} SOL</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
