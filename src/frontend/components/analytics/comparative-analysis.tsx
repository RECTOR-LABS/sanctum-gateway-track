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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  Shield,
  Award,
  ArrowRight,
} from 'lucide-react';
import { CardLoadingState } from '@/components/ui/loading-state';

interface ComparisonMetrics {
  gateway: {
    total_cost_sol: number;
    avg_cost_per_tx: number;
    success_rate: number;
    avg_response_time_ms: number;
    total_transactions: number;
    tips_refunded_sol: number;
  };
  direct_jito: {
    estimated_cost_sol: number;
    avg_cost_per_tx: number;
    estimated_success_rate: number;
    avg_response_time_ms: number;
  };
  direct_rpc: {
    estimated_cost_sol: number;
    avg_cost_per_tx: number;
    estimated_success_rate: number;
    avg_response_time_ms: number;
  };
}

interface ComparativeAnalysisProps {
  data?: ComparisonMetrics;
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

  const { gateway, direct_jito, direct_rpc } = data;

  // Calculate savings
  const savingsVsJito = {
    cost: direct_jito.estimated_cost_sol - gateway.total_cost_sol,
    costPercentage: ((direct_jito.estimated_cost_sol - gateway.total_cost_sol) / direct_jito.estimated_cost_sol) * 100,
    successRate: gateway.success_rate - direct_jito.estimated_success_rate,
    responseTime: direct_jito.avg_response_time_ms - gateway.avg_response_time_ms,
  };

  const savingsVsRpc = {
    cost: direct_rpc.estimated_cost_sol - gateway.total_cost_sol,
    costPercentage: ((direct_rpc.estimated_cost_sol - gateway.total_cost_sol) / direct_rpc.estimated_cost_sol) * 100,
    successRate: gateway.success_rate - direct_rpc.estimated_success_rate,
    responseTime: direct_rpc.avg_response_time_ms - gateway.avg_response_time_ms,
  };

  // ROI calculation (assuming time saved = money saved for developers)
  const estimatedDeveloperHourlyCost = 100; // $100/hour
  const timesSavedHours = (
    (savingsVsJito.responseTime + savingsVsRpc.responseTime) / 2 * gateway.total_transactions
  ) / (1000 * 60 * 60); // Convert ms to hours
  const roiFromTimeSavings = timesSavedHours * estimatedDeveloperHourlyCost;

  // Comparison chart data
  const costComparisonData = [
    {
      metric: 'Total Cost',
      Gateway: gateway.total_cost_sol,
      'Direct Jito': direct_jito.estimated_cost_sol,
      'Direct RPC': direct_rpc.estimated_cost_sol,
    },
    {
      metric: 'Cost per TX',
      Gateway: gateway.avg_cost_per_tx * 1000000, // Convert to lamports for visibility
      'Direct Jito': direct_jito.avg_cost_per_tx * 1000000,
      'Direct RPC': direct_rpc.avg_cost_per_tx * 1000000,
    },
  ];

  const performanceComparisonData = [
    {
      subject: 'Success Rate',
      Gateway: gateway.success_rate,
      'Direct Jito': direct_jito.estimated_success_rate,
      'Direct RPC': direct_rpc.estimated_success_rate,
    },
    {
      subject: 'Speed (inv.)',
      Gateway: 100 - (gateway.avg_response_time_ms / 100),
      'Direct Jito': 100 - (direct_jito.avg_response_time_ms / 100),
      'Direct RPC': 100 - (direct_rpc.avg_response_time_ms / 100),
    },
    {
      subject: 'Reliability',
      Gateway: 95,
      'Direct Jito': 85,
      'Direct RPC': 80,
    },
    {
      subject: 'Cost Efficiency',
      Gateway: 100 - savingsVsJito.costPercentage,
      'Direct Jito': 100,
      'Direct RPC': 100 - savingsVsRpc.costPercentage,
    },
  ];

  const isSavingMoney = savingsVsJito.cost > 0 || savingsVsRpc.cost > 0;

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
                {Math.max(savingsVsJito.cost, savingsVsRpc.cost).toFixed(6)} SOL
              </div>
              <div className="text-sm text-muted-foreground">
                + ${roiFromTimeSavings.toFixed(2)} developer time saved
              </div>
            </div>
            <TrendingDown className="h-16 w-16 text-green-500/30" />
          </div>
        </div>

        {/* Gateway Advantages Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Cost Savings</div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground mb-1">vs Direct Jito</div>
                <div className="text-lg font-bold text-green-500">
                  {savingsVsJito.costPercentage.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">vs Direct RPC</div>
                <div className="text-lg font-bold text-green-500">
                  {savingsVsRpc.costPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Success Rate</div>
            </div>
            <div className="text-2xl font-bold text-blue-500">{gateway.success_rate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {savingsVsJito.successRate > 0 && `+${savingsVsJito.successRate.toFixed(1)}% vs alternatives`}
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Performance</div>
            </div>
            <div className="text-2xl font-bold text-purple-500">
              {Math.round(gateway.avg_response_time_ms)}ms
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              avg response time
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Tips Refunded</div>
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {gateway.tips_refunded_sol.toFixed(6)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">SOL saved</div>
          </div>
        </div>

        {/* Before & After Comparison */}
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

        {/* Performance Radar Chart */}
        <div>
          <h4 className="text-sm font-medium mb-4">Multi-Dimensional Performance Comparison</h4>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={performanceComparisonData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" className="text-xs" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Gateway"
                dataKey="Gateway"
                stroke="hsl(142, 76%, 56%)"
                fill="hsl(142, 76%, 56%)"
                fillOpacity={0.6}
              />
              <Radar
                name="Direct Jito"
                dataKey="Direct Jito"
                stroke="hsl(280, 70%, 60%)"
                fill="hsl(280, 70%, 60%)"
                fillOpacity={0.3}
              />
              <Radar
                name="Direct RPC"
                dataKey="Direct RPC"
                stroke="hsl(210, 70%, 60%)"
                fill="hsl(210, 70%, 60%)"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Side-by-Side Savings Breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Gateway vs Direct Jito</div>
              <Badge variant={savingsVsJito.cost > 0 ? 'default' : 'secondary'}>
                {savingsVsJito.cost > 0 ? 'Saving' : 'Similar'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Cost Reduction</span>
                  <span className="font-medium text-green-500">
                    {savingsVsJito.costPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={savingsVsJito.costPercentage} className="h-2" />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Direct Jito Cost:</span>
                  <span className="font-mono">{direct_jito.estimated_cost_sol.toFixed(6)} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>Gateway Cost:</span>
                  <span className="font-mono">{gateway.total_cost_sol.toFixed(6)} SOL</span>
                </div>
                <div className="flex justify-between text-green-500 font-medium">
                  <span>Savings:</span>
                  <span className="font-mono">{savingsVsJito.cost.toFixed(6)} SOL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Gateway vs Direct RPC</div>
              <Badge variant={savingsVsRpc.cost > 0 ? 'default' : 'secondary'}>
                {savingsVsRpc.cost > 0 ? 'Saving' : 'Similar'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Cost Reduction</span>
                  <span className="font-medium text-green-500">
                    {savingsVsRpc.costPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={savingsVsRpc.costPercentage} className="h-2" />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Direct RPC Cost:</span>
                  <span className="font-mono">{direct_rpc.estimated_cost_sol.toFixed(6)} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>Gateway Cost:</span>
                  <span className="font-mono">{gateway.total_cost_sol.toFixed(6)} SOL</span>
                </div>
                <div className="flex justify-between text-green-500 font-medium">
                  <span>Savings:</span>
                  <span className="font-mono">{savingsVsRpc.cost.toFixed(6)} SOL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="text-sm font-medium">Why Gateway Wins</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>
                    Saves {Math.max(savingsVsJito.costPercentage, savingsVsRpc.costPercentage).toFixed(1)}%
                    on transaction costs through intelligent routing
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>
                    Achieves {gateway.success_rate.toFixed(1)}% success rate with automatic failover
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>
                    Refunds {gateway.tips_refunded_sol.toFixed(6)} SOL in unused Jito tips
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>
                    Saves ${roiFromTimeSavings.toFixed(2)} in developer time through better performance
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>
                    Single integration replaces multiple provider setups
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
