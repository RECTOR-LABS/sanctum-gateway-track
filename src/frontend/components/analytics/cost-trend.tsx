'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendDataPoint } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from 'recharts';
import { ChartLoadingState } from '@/components/ui/loading-state';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp } from 'lucide-react';

interface CostTrendProps {
  jitoData?: TrendDataPoint[];
  rpcData?: TrendDataPoint[];
  sanctumData?: TrendDataPoint[];
  isLoading?: boolean;
}

type TimeRange = '24h' | '7d' | '30d' | 'all';

export function CostTrend({ jitoData, rpcData, sanctumData, isLoading }: CostTrendProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Trends Over Time</CardTitle>
          <CardDescription>Historical cost analysis by delivery method</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartLoadingState />
        </CardContent>
      </Card>
    );
  }

  // Combine all data sources
  const combinedData = (jitoData || []).map((jito, index) => ({
    timestamp: jito.timestamp,
    jito: jito.value,
    rpc: rpcData?.[index]?.value || 0,
    sanctum: sanctumData?.[index]?.value || 0,
    total: jito.value + (rpcData?.[index]?.value || 0) + (sanctumData?.[index]?.value || 0),
  }));

  if (combinedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Trends Over Time</CardTitle>
          <CardDescription>Historical cost analysis by delivery method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No cost trend data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate cumulative costs
  let cumulativeJito = 0;
  let cumulativeRpc = 0;
  let cumulativeSanctum = 0;

  const cumulativeData = combinedData.map((point) => {
    cumulativeJito += point.jito;
    cumulativeRpc += point.rpc;
    cumulativeSanctum += point.sanctum;

    return {
      ...point,
      cumulativeJito,
      cumulativeRpc,
      cumulativeSanctum,
      cumulativeTotal: cumulativeJito + cumulativeRpc + cumulativeSanctum,
    };
  });

  const totalCost = cumulativeData[cumulativeData.length - 1]?.cumulativeTotal || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Cost Trends Over Time</CardTitle>
            <CardDescription>Historical cost analysis by delivery method</CardDescription>
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
        {/* Total Cost Summary */}
        <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50 border">
          <TrendingUp className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Total Running Cost</div>
            <div className="text-2xl font-bold">{totalCost.toFixed(6)} SOL</div>
          </div>
        </div>

        {/* Cumulative Cost Chart */}
        <div>
          <h4 className="text-sm font-medium mb-3">Cumulative Cost</h4>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
                className="text-xs"
              />
              <YAxis
                className="text-xs"
                tickFormatter={(value) => `${value.toFixed(4)} SOL`}
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
              <Area
                type="monotone"
                dataKey="cumulativeTotal"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Total Cost"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Cost by Method Chart */}
        <div>
          <h4 className="text-sm font-medium mb-3">Cost by Delivery Method</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                  });
                }}
                className="text-xs"
              />
              <YAxis
                className="text-xs"
                tickFormatter={(value) => `${value.toFixed(6)}`}
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
                dataKey="sanctum"
                stroke="hsl(180, 70%, 60%)"
                strokeWidth={2}
                dot={false}
                name="Sanctum Sender"
              />
              <Line
                type="monotone"
                dataKey="jito"
                stroke="hsl(280, 70%, 60%)"
                strokeWidth={2}
                dot={false}
                name="Jito"
              />
              <Line
                type="monotone"
                dataKey="rpc"
                stroke="hsl(210, 70%, 60%)"
                strokeWidth={2}
                dot={false}
                name="RPC"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
