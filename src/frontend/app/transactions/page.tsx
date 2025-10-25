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

  // Calculate total potential Gateway savings
  const GATEWAY_FEE_LAMPORTS = 100_000; // 0.0001 SOL
  const totalSavings = useMemo(() => {
    if (!initialTransactions.length) return { lamports: 0, sol: 0, count: 0 };

    const totalSavingsLamports = initialTransactions.reduce((sum, tx) => {
      return sum + (tx.cost_lamports - GATEWAY_FEE_LAMPORTS);
    }, 0);

    return {
      lamports: totalSavingsLamports,
      sol: totalSavingsLamports / 1_000_000_000,
      count: initialTransactions.length,
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

      {/* Gateway Savings Simulation Card */}
      {totalSavings.count > 0 && (
        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-blue-900 dark:text-blue-100">
                Potential Gateway Savings (Simulation)
              </CardTitle>
            </div>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Cost comparison: What if these transactions used Sanctum Gateway?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-blue-600 dark:text-blue-400">Transactions Analyzed</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {totalSavings.count}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-blue-600 dark:text-blue-400">Gateway Fee (Fixed)</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  0.0001 SOL
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Potential Savings</p>
                <p className={`text-2xl font-bold ${totalSavings.sol > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {totalSavings.sol > 0 ? '+' : ''}{totalSavings.sol.toFixed(6)} SOL
                </p>
              </div>
            </div>

            <Alert className="border-blue-300 bg-blue-100 dark:bg-blue-900">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This is a simulated comparison showing what you could save if these transactions were sent through Sanctum Gateway (fixed 0.0001 SOL fee) instead of their actual delivery method. Real Gateway transactions appear in your dashboard analytics.
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
