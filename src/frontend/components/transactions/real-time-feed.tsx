'use client';

import { useState, useCallback, useEffect } from 'react';
import { Transaction } from '@/lib/types';
import { TransactionList } from './transaction-list';
import { useWebSocket, WSEventType, WSMessage } from '@/lib/websocket';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi } from 'lucide-react';
import { toast } from 'sonner';

interface RealTimeTransactionFeedProps {
  initialTransactions?: Transaction[];
  maxTransactions?: number;
  onTransactionClick?: (transaction: Transaction) => void;
}

export function RealTimeTransactionFeed({
  initialTransactions = [],
  maxTransactions = 100,
  onTransactionClick,
}: RealTimeTransactionFeedProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [autoScroll, setAutoScroll] = useState(true);

  // Update transactions when initialTransactions prop changes
  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  const handleMessage = useCallback((message: WSMessage) => {
    switch (message.type) {
      case WSEventType.TRANSACTION_CREATED:
        setTransactions((prev) => {
          const newTx = message.data as Transaction;

          // Check if transaction already exists
          if (prev.some((tx) => tx.id === newTx.id)) {
            return prev;
          }

          // Show toast notification for new transaction
          const sigShort = newTx.signature.slice(0, 8) + '...' + newTx.signature.slice(-8);
          const deliveryMethod = newTx.delivery_method || 'Unknown';
          const status = newTx.status === 'confirmed' ? '✅' : newTx.status === 'failed' ? '❌' : '⏳';

          toast.success(`New Transaction ${status}`, {
            description: `${sigShort} via ${deliveryMethod}`,
            duration: 4000,
          });

          // Add new transaction to the top and limit total
          return [newTx, ...prev].slice(0, maxTransactions);
        });
        break;

      case WSEventType.TRANSACTION_UPDATED:
      case WSEventType.TRANSACTION_CONFIRMED:
      case WSEventType.TRANSACTION_FAILED:
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === message.data.id
              ? { ...tx, ...message.data }
              : tx
          )
        );
        break;

      default:
        break;
    }
  }, [maxTransactions]);

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

  const { isConnected, reconnectCount } = useWebSocket({
    url: wsUrl,
    onMessage: handleMessage,
    onConnect: () => console.log('[RealTimeFeed] Connected to WebSocket'),
    onDisconnect: () => console.log('[RealTimeFeed] Disconnected from WebSocket'),
  });

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && transactions.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [transactions.length, autoScroll]);

  return (
    <div className="flex flex-col gap-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Connected
              </Badge>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-500" />
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                {reconnectCount > 0 ? `Reconnecting (${reconnectCount})...` : 'Disconnected'}
              </Badge>
            </>
          )}
        </div>

        {/* Auto-scroll Toggle */}
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded"
          />
          Auto-scroll to new
        </label>
      </div>

      {/* Transaction Count */}
      <div className="text-sm text-muted-foreground">
        Showing {transactions.length} recent transaction{transactions.length !== 1 ? 's' : ''}
        {transactions.length >= maxTransactions && ` (max ${maxTransactions})`}
      </div>

      {/* Transaction List */}
      <div className="animate-in fade-in duration-500">
        <TransactionList
          transactions={transactions}
          onTransactionClick={onTransactionClick}
        />
      </div>
    </div>
  );
}
