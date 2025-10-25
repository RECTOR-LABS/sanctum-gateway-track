'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { RealTimeTransactionFeed } from '@/components/transactions/real-time-feed';
import { TransactionDetail } from '@/components/transactions/transaction-detail';
import { Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 50;

  // Fetch initial transactions from API with pagination
  const { data: transactionsResponse } = useSWR(
    ['transactions', page],
    () => apiClient.getTransactions({
      limit: pageSize,
      offset: (page - 1) * pageSize
    }),
    { refreshInterval: 30000 } // Refresh every 30 seconds
  );

  const initialTransactions = transactionsResponse?.data || [];
  const pagination = transactionsResponse?.pagination;

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1;
  const currentPage = page;

  // Calculate comprehensive Gateway cost comparison
  const GATEWAY_FEE_LAMPORTS = 100_000; // 0.0001 SOL
  const JITO_FEE_LAMPORTS = 1_000_000; // 0.001 SOL (typical Jito cost for MEV protection)

  const costComparison = useMemo(() => {
    if (!initialTransactions.length) return {
      count: 0,
      vsActual: { lamports: 0, sol: 0 },
      vsJito: { lamports: 0, sol: 0 },
      totalGatewayCost: { lamports: 0, sol: 0 },
      totalJitoCost: { lamports: 0, sol: 0 },
      totalActualCost: { lamports: 0, sol: 0 },
    };

    const totalActualCost = initialTransactions.reduce((sum, tx) => sum + tx.cost_lamports, 0);
    const totalGatewayCost = initialTransactions.length * GATEWAY_FEE_LAMPORTS;
    const totalJitoCost = initialTransactions.length * JITO_FEE_LAMPORTS;

    // Savings vs actual cost (can be negative - Gateway more expensive for micro txs)
    const savingsVsActual = totalActualCost - totalGatewayCost;

    // Savings vs always-using-Jito (should be positive - Gateway cheaper than Jito)
    const savingsVsJito = totalJitoCost - totalGatewayCost;

    return {
      count: initialTransactions.length,
      vsActual: {
        lamports: savingsVsActual,
        sol: savingsVsActual / 1_000_000_000,
      },
      vsJito: {
        lamports: savingsVsJito,
        sol: savingsVsJito / 1_000_000_000,
      },
      totalGatewayCost: {
        lamports: totalGatewayCost,
        sol: totalGatewayCost / 1_000_000_000,
      },
      totalJitoCost: {
        lamports: totalJitoCost,
        sol: totalJitoCost / 1_000_000_000,
      },
      totalActualCost: {
        lamports: totalActualCost,
        sol: totalActualCost / 1_000_000_000,
      },
    };
  }, [initialTransactions]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Real-time transaction feed with detailed history
        </p>
      </div>

      {/* Gateway Cost Comparison Card */}
      {costComparison.count > 0 && (
        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-blue-900 dark:text-blue-100">
                Gateway Cost Comparison (Simulation)
              </CardTitle>
            </div>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Comprehensive comparison: RPC vs Jito vs Gateway
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cost Breakdown Table */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">Direct RPC (Actual Cost)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {costComparison.totalActualCost.sol.toFixed(6)} SOL
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">⚠️ No MEV Protection</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <p className="text-sm text-orange-600 dark:text-orange-400">Jito (MEV Protected)</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {costComparison.totalJitoCost.sol.toFixed(6)} SOL
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">💰 Expensive but safe</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <p className="text-sm text-green-600 dark:text-green-400">Gateway (Smart Routing)</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {costComparison.totalGatewayCost.sol.toFixed(6)} SOL
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">✅ MEV + Cost Efficient</p>
              </div>
            </div>

            {/* Savings Comparison */}
            <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-blue-200 dark:border-blue-800">
              <div className="space-y-1">
                <p className="text-sm text-blue-600 dark:text-blue-400">vs Direct RPC</p>
                <p className={`text-xl font-bold ${costComparison.vsActual.sol > 0 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {costComparison.vsActual.sol > 0 ? '+' : ''}{Math.abs(costComparison.vsActual.sol).toFixed(6)} SOL more
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  BUT adds MEV protection (prevents front-running)
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-blue-600 dark:text-blue-400">vs Always-Using-Jito</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  +{costComparison.vsJito.sol.toFixed(6)} SOL saved
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {((costComparison.vsJito.sol / costComparison.totalJitoCost.sol) * 100).toFixed(1)}% cheaper with same MEV protection
                </p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">Summary for {costComparison.count} transactions:</p>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">•</span>
                  <span className="text-blue-800 dark:text-blue-200">
                    Direct RPC is cheapest ({costComparison.totalActualCost.sol.toFixed(6)} SOL) but you're vulnerable to MEV attacks
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  <span className="text-blue-800 dark:text-blue-200">
                    Gateway saves <strong>+{costComparison.vsJito.sol.toFixed(6)} SOL</strong> vs Jito while providing same MEV protection
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 dark:text-orange-400">⚠️</span>
                  <span className="text-blue-800 dark:text-blue-200">
                    Without MEV protection, you risk losing MORE than {Math.abs(costComparison.vsActual.sol).toFixed(6)} SOL to front-running
                  </span>
                </div>
              </div>
            </div>

            <Alert className="border-blue-300 bg-blue-100 dark:bg-blue-900">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This is a simulated comparison. Gateway provides Jito-level MEV protection at 90% lower cost through smart routing. Real Gateway transactions from your demo wallet appear in the dashboard analytics.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Pagination Info */}
      {pagination && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} transactions
          </span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}

      {/* Real-time Transaction Feed */}
      <RealTimeTransactionFeed
        initialTransactions={initialTransactions}
        maxTransactions={pageSize}
        onTransactionClick={setSelectedTransaction}
      />

      {/* Pagination Controls */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNumber)}
                  className="w-10"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!pagination.hasMore}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Transaction Detail Modal */}
      <TransactionDetail
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
