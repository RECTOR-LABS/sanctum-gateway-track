'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DeliveryMethodMetrics } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getDeliveryMethodName } from '@/lib/format';
import { ChartLoadingState } from '@/components/ui/loading-state';

interface DeliveryMethodChartProps {
  data?: DeliveryMethodMetrics[];
  isLoading?: boolean;
}

const COLORS = {
  jito: 'hsl(280, 70%, 60%)',
  rpc: 'hsl(210, 70%, 60%)',
  'sanctum-sender': 'hsl(180, 70%, 60%)',
  unknown: 'hsl(0, 0%, 50%)',
};

export function DeliveryMethodChart({ data, isLoading }: DeliveryMethodChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Methods</CardTitle>
          <CardDescription>Transaction distribution by delivery method</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartLoadingState />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Methods</CardTitle>
          <CardDescription>Transaction distribution by delivery method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No delivery method data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: getDeliveryMethodName(item.delivery_method),
    value: item.total_count,
    method: item.delivery_method,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Methods</CardTitle>
        <CardDescription>Transaction distribution by delivery method</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.method as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
