'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import {
  TrendingDown,
  DollarSign,
  Award,
} from 'lucide-react';
import { CardLoadingState } from '@/components/ui/loading-state';
import type { CostComparison } from '@/lib/types';

interface ComparativeAnalysisProps {
  data?: CostComparison;
  isLoading?: boolean;
}

export function ComparativeAnalysis({ data, isLoading }: ComparativeAnalysisProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gateway Value Analysis</CardTitle>
          <CardDescription>Before & after comparison - Gateway advantage</CardDescription>
        </CardHeader>
        <CardContent>
          <CardLoadingState />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  // Comparison chart data
  const costComparisonData = [
    {
      metric: 'Total Cost (SOL)',
      Gateway: data.gateway_cost_sol,
      'Direct Jito': data.direct_jito_cost_sol,
      'Direct RPC': data.direct_rpc_cost_sol,
    },
  ];

  const isSavingMoney = data.savings_vs_jito_sol > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gateway Value Analysis</CardTitle>
        <CardDescription>Quantifying Gateway's impact on your transactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hero Metric - Total Savings */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-500" />
                <div className="text-sm text-muted-foreground">Total Savings with Gateway</div>
              </div>
              <div className="text-4xl font-bold text-green-500">
                {data.savings_percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {data.savings_vs_jito_sol.toFixed(6)} SOL saved vs Direct Jito
              </div>
            </div>
            <TrendingDown className="h-16 w-16 text-green-500/30" />
          </div>
        </div>

        {/* Gateway Advantages Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Gateway Cost</div>
            </div>
            <div className="text-2xl font-bold">
              {data.gateway_cost_sol.toFixed(6)} SOL
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Actual cost paid
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Direct Jito Cost</div>
            </div>
            <div className="text-2xl font-bold text-purple-500">
              {data.direct_jito_cost_sol.toFixed(6)} SOL
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Estimated alternative cost
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Direct RPC Cost</div>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {data.direct_rpc_cost_sol.toFixed(6)} SOL
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Base network fee
            </div>
          </div>
        </div>

        {/* Cost Comparison Chart */}
        <div>
          <h4 className="text-sm font-medium mb-4">Cost Comparison: Gateway vs Direct Methods</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costComparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="metric" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Bar dataKey="Gateway" fill="hsl(142, 76%, 56%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Direct Jito" fill="hsl(280, 70%, 60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Direct RPC" fill="hsl(210, 70%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Savings Breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Gateway vs Direct Jito</div>
              <Badge variant={isSavingMoney ? 'default' : 'secondary'}>
                {isSavingMoney ? 'Saving' : 'Similar'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Cost Reduction</span>
                  <span className="font-medium text-green-500">
                    {data.savings_percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={data.savings_percentage} className="h-2" />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Direct Jito Cost:</span>
                  <span className="font-mono">{data.direct_jito_cost_sol.toFixed(6)} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>Gateway Cost:</span>
                  <span className="font-mono">{data.gateway_cost_sol.toFixed(6)} SOL</span>
                </div>
                <div className="flex justify-between text-green-500 font-medium">
                  <span>Savings:</span>
                  <span className="font-mono">{data.savings_vs_jito_sol.toFixed(6)} SOL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Gateway vs Direct RPC</div>
              <Badge variant={data.savings_vs_rpc_sol < 0 ? 'secondary' : 'default'}>
                {data.savings_vs_rpc_sol < 0 ? 'Premium' : 'Saving'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Direct RPC Cost:</span>
                  <span className="font-mono">{data.direct_rpc_cost_sol.toFixed(6)} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>Gateway Cost:</span>
                  <span className="font-mono">{data.gateway_cost_sol.toFixed(6)} SOL</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Difference:</span>
                  <span className="font-mono">
                    {data.savings_vs_rpc_sol < 0 ? '+' : ''}{Math.abs(data.savings_vs_rpc_sol).toFixed(6)} SOL
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Gateway provides reliability & observability premium over basic RPC
              </p>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="p-4 rounded-lg border bg-muted/50 space-y-2">
          <h4 className="font-medium">Gateway Value Proposition</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• <strong>Cost Optimization:</strong> {data.savings_percentage.toFixed(1)}% savings vs direct Jito submission</li>
            <li>• <strong>Unified API:</strong> Single API for RPC + Jito + Sanctum Sender delivery methods</li>
            <li>• <strong>Automatic Refunds:</strong> Dual-submission with tip refunds when RPC succeeds first</li>
            <li>• <strong>Comprehensive Observability:</strong> Unified tracking across all delivery methods</li>
            <li>• <strong>Intelligent Routing:</strong> Automatic failover and retry logic built-in</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
