'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CostComparison } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartLoadingState } from '@/components/ui/loading-state';

interface CostComparisonChartProps {
  data?: CostComparison;
  isLoading?: boolean;
}

export function CostComparisonChart({ data, isLoading }: CostComparisonChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Comparison</CardTitle>
          <CardDescription>Gateway vs Direct Jito vs Direct RPC costs</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartLoadingState />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Comparison</CardTitle>
          <CardDescription>Gateway vs Direct Jito vs Direct RPC costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No cost comparison data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      name: 'Gateway',
      cost: data.gateway_cost_sol,
    },
    {
      name: 'Direct Jito',
      cost: data.direct_jito_cost_sol,
    },
    {
      name: 'Direct RPC',
      cost: data.direct_rpc_cost_sol,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Comparison</CardTitle>
        <CardDescription>
          Gateway: {data.savings_percentage.toFixed(1)}% savings vs always-using-Jito ({data.savings_vs_jito_sol.toFixed(6)} SOL saved)
        </CardDescription>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Gateway provides Jito-level MEV protection at RPC-level costs through smart dual-submission
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" label={{ value: 'SOL', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number) => `${value.toFixed(6)} SOL`}
            />
            <Legend />
            <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
