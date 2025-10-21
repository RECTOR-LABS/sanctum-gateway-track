'use client';

import { Transaction } from '@/lib/types';
import { TransactionRow } from './transaction-row';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onTransactionClick }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No transactions yet. Waiting for new transactions...
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Signature</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Response Time</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              onClick={() => onTransactionClick?.(tx)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
