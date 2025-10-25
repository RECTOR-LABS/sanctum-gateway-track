'use client';

import { Transaction } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { formatSignature, formatRelativeTime, formatSol, getStatusColor, getDeliveryMethodColor, getDeliveryMethodName } from '@/lib/format';
import { ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TransactionRowProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function TransactionRow({ transaction, onClick }: TransactionRowProps) {
  const [copied, setCopied] = useState(false);

  const copySignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(transaction.signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openExplorer = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://solscan.io/tx/${transaction.signature}`, '_blank');
  };

  // Calculate potential Gateway savings
  // Gateway fee: 0.0001 SOL = 100,000 lamports
  const GATEWAY_FEE_LAMPORTS = 100_000;
  const actualCostLamports = transaction.cost_lamports;
  const savingsLamports = actualCostLamports - GATEWAY_FEE_LAMPORTS;
  const savingsSol = savingsLamports / 1_000_000_000;
  const isSavings = savingsLamports > 0;

  return (
    <tr
      className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
      onClick={onClick}
    >
      <td className="p-4">
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono">
            {formatSignature(transaction.signature, 12)}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={copySignature}
          >
            {copied ? (
              <span className="text-xs text-green-500">✓</span>
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={openExplorer}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </td>
      <td className="p-4">
        <Badge
          variant="outline"
          className={getStatusColor(transaction.status)}
        >
          {transaction.status}
        </Badge>
      </td>
      <td className="p-4">
        <Badge
          variant="outline"
          className={getDeliveryMethodColor(transaction.delivery_method)}
        >
          {getDeliveryMethodName(transaction.delivery_method)}
        </Badge>
      </td>
      <td className="p-4 font-mono text-sm">
        {formatSol(transaction.cost_lamports)} SOL
      </td>
      <td className="p-4 font-mono text-sm">
        {isSavings ? (
          <span className="text-green-600 dark:text-green-400">
            +{savingsSol.toFixed(8)} SOL
          </span>
        ) : (
          <span className="text-red-600 dark:text-red-400">
            {savingsSol.toFixed(8)} SOL
          </span>
        )}
      </td>
      <td className="p-4 text-sm text-muted-foreground">
        {transaction.response_time_ms ? `${transaction.response_time_ms}ms` : 'N/A'}
      </td>
      <td className="p-4 text-sm text-muted-foreground">
        {formatRelativeTime(transaction.block_time || transaction.created_at)}
      </td>
    </tr>
  );
}
