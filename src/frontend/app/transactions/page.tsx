'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { RealTimeTransactionFeed } from '@/components/transactions/real-time-feed';
import { TransactionDetail } from '@/components/transactions/transaction-detail';
import { Transaction } from '@/lib/types';

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Fetch initial transactions from API
  const { data: transactionsResponse } = useSWR(
    'transactions',
    () => apiClient.getTransactions({ limit: 100 }),
    { refreshInterval: 30000 } // Refresh every 30 seconds
  );

  const initialTransactions = transactionsResponse?.data || [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Real-time transaction feed with detailed history
        </p>
      </div>

      {/* Real-time Transaction Feed */}
      <RealTimeTransactionFeed
        initialTransactions={initialTransactions}
        maxTransactions={100}
        onTransactionClick={setSelectedTransaction}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetail
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
