'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsOverview } from '@/lib/types';
import { formatSol } from '@/lib/format';
import { DollarSign, TrendingDown, TrendingUp, Coins } from 'lucide-react';
import { CardLoadingState } from '@/components/ui/loading-state';

interface CostBreakdownProps {
  data?: AnalyticsOverview;
  isLoading?: boolean;
}

export function CostBreakdown({ data, isLoading }: CostBreakdownProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription>Detailed cost analysis by delivery method</CardDescription>
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

  const jitoTipsRefunded = data.total_refunded_sol;
  const jitoTipsPaid = data.total_tips_sol - jitoTipsRefunded;
  const avgCostPerTx = data.total_transactions > 0
    ? data.total_cost_sol / data.total_transactions
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
        <CardDescription>Detailed cost analysis by delivery method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Costs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Total Cost
            </div>
            <div className="text-2xl font-bold">
              {data.total_cost_sol.toFixed(6)} SOL
            </div>
            <div className="text-xs text-muted-foreground">
              {data.total_transactions} transactions
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="h-4 w-4" />
              Avg Cost/Transaction
            </div>
            <div className="text-2xl font-bold">
              {avgCostPerTx.toFixed(6)} SOL
            </div>
            <div className="text-xs text-muted-foreground">
              Per transaction average
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Jito Tips Paid
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {jitoTipsPaid.toFixed(6)} SOL
            </div>
            <div className="text-xs text-muted-foreground">
              Tips sent to Jito
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-green-500" />
              Tips Refunded
            </div>
            <div className="text-2xl font-bold text-green-500">
              {jitoTipsRefunded.toFixed(6)} SOL
            </div>
            <div className="text-xs text-muted-foreground">
              Returned by Jito
            </div>
          </div>
        </div>

        {/* Cost by Delivery Method */}
        <div>
          <h4 className="text-sm font-medium mb-3">Cost by Delivery Method</h4>
          <div className="space-y-3">
            {/* Sanctum Sender */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-500 font-bold text-sm">S</span>
                </div>
                <div>
                  <div className="font-medium">Sanctum Sender</div>
                  <div className="text-sm text-muted-foreground">
                    {data.delivery_breakdown.sanctum_sender} transactions
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold">
                  {data.cost_by_delivery.sanctum_sender_cost_sol.toFixed(6)} SOL
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.delivery_breakdown.sanctum_sender > 0
                    ? (data.cost_by_delivery.sanctum_sender_cost_sol / data.delivery_breakdown.sanctum_sender).toFixed(6)
                    : '0.000000'} SOL/tx
                </div>
              </div>
            </div>

            {/* Jito */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-500 font-bold text-sm">J</span>
                </div>
                <div>
                  <div className="font-medium">Jito</div>
                  <div className="text-sm text-muted-foreground">
                    {data.delivery_breakdown.jito} transactions
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold">
                  {data.cost_by_delivery.jito_cost_sol.toFixed(6)} SOL
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.delivery_breakdown.jito > 0
                    ? (data.cost_by_delivery.jito_cost_sol / data.delivery_breakdown.jito).toFixed(6)
                    : '0.000000'} SOL/tx
                </div>
              </div>
            </div>

            {/* RPC */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-500 font-bold text-sm">R</span>
                </div>
                <div>
                  <div className="font-medium">RPC</div>
                  <div className="text-sm text-muted-foreground">
                    {data.delivery_breakdown.rpc} transactions
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold">
                  {data.cost_by_delivery.rpc_cost_sol.toFixed(6)} SOL
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.delivery_breakdown.rpc > 0
                    ? (data.cost_by_delivery.rpc_cost_sol / data.delivery_breakdown.rpc).toFixed(6)
                    : '0.000000'} SOL/tx
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
