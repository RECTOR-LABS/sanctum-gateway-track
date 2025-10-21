'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CostComparison } from '@/lib/types';
import { TrendingDown, Sparkles, AlertCircle } from 'lucide-react';
import { CardLoadingState } from '@/components/ui/loading-state';
import { Progress } from '@/components/ui/progress';

interface SavingsCalculatorProps {
  data?: CostComparison;
  isLoading?: boolean;
}

export function SavingsCalculator({ data, isLoading }: SavingsCalculatorProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Calculator</CardTitle>
          <CardDescription>Gateway cost savings vs direct submission</CardDescription>
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

  const savingsPercentage = data.savings_percentage;
  const isSavingMoney = savingsPercentage > 0;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Savings Calculator</CardTitle>
        </div>
        <CardDescription>Your cost savings by using Gateway</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Savings Display */}
        <div className="text-center space-y-4 p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="flex items-center justify-center gap-2">
            <TrendingDown className="h-8 w-8 text-green-500" />
            <div className="text-5xl font-bold text-green-500">
              {savingsPercentage.toFixed(1)}%
            </div>
          </div>
          <div className="text-lg font-medium">
            {isSavingMoney ? 'Cost Savings' : 'Additional Cost'} vs Direct Jito
          </div>
          <div className="text-3xl font-bold">
            {Math.abs(data.savings_vs_jito_sol).toFixed(6)} SOL
          </div>
          <div className="text-sm text-muted-foreground">
            {isSavingMoney ? 'Saved' : 'Additional'} by using Gateway
          </div>
        </div>

        {/* Comparison Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Cost Comparison Breakdown</h4>

          {/* Gateway Actual Cost */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Gateway (Actual)</span>
              <span className="font-mono">{data.gateway_cost_sol.toFixed(6)} SOL</span>
            </div>
            <Progress value={100} className="h-2 bg-primary/20" />
            <div className="text-xs text-muted-foreground">
              What you actually paid using Gateway
            </div>
          </div>

          {/* Direct Jito Cost (What If) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Direct Jito (What If)</span>
              <span className="font-mono text-orange-500">{data.direct_jito_cost_sol.toFixed(6)} SOL</span>
            </div>
            <Progress
              value={(data.direct_jito_cost_sol / data.gateway_cost_sol) * 100}
              className="h-2 bg-orange-500/20"
            />
            <div className="text-xs text-muted-foreground">
              What you would have paid submitting directly to Jito
            </div>
          </div>

          {/* Direct RPC Cost (What If) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Direct RPC (What If)</span>
              <span className="font-mono text-blue-500">{data.direct_rpc_cost_sol.toFixed(6)} SOL</span>
            </div>
            <Progress
              value={(data.direct_rpc_cost_sol / data.gateway_cost_sol) * 100}
              className="h-2 bg-blue-500/20"
            />
            <div className="text-xs text-muted-foreground">
              What you would have paid using standard RPC
            </div>
          </div>
        </div>

        {/* Savings vs RPC */}
        {data.savings_vs_rpc_sol !== 0 && (
          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="text-sm font-medium">
                  Gateway vs RPC Comparison
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.savings_vs_rpc_sol < 0 ? (
                    <>
                      You paid{' '}
                      <span className="font-mono text-orange-500">
                        {Math.abs(data.savings_vs_rpc_sol).toFixed(6)} SOL
                      </span>{' '}
                      more than basic RPC, but gained priority execution and higher success rates.
                    </>
                  ) : (
                    <>
                      You saved{' '}
                      <span className="font-mono text-green-500">
                        {data.savings_vs_rpc_sol.toFixed(6)} SOL
                      </span>{' '}
                      compared to basic RPC.
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gateway Value Proposition */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="text-sm font-medium mb-2">💡 Gateway Value</div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>• Automatic routing to best delivery method</div>
            <div>• Jito tip refunds when transactions fail</div>
            <div>• Unified API for RPC and Jito</div>
            <div>• Built-in observability and analytics</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
