'use client';

import { Transaction } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  formatSignature,
  formatTimestamp,
  formatSol,
  getStatusColor,
  getDeliveryMethodColor,
  getDeliveryMethodName,
} from '@/lib/format';
import { ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';

interface TransactionDetailProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

export function TransactionDetail({ transaction, open, onClose }: TransactionDetailProps) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!transaction) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const openExplorer = () => {
    window.open(`https://solscan.io/tx/${transaction.signature}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Complete information for transaction {formatSignature(transaction.signature)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status & Method */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={getStatusColor(transaction.status)}
            >
              {transaction.status}
            </Badge>
            <Badge
              variant="outline"
              className={getDeliveryMethodColor(transaction.delivery_method)}
            >
              {getDeliveryMethodName(transaction.delivery_method)}
            </Badge>
          </div>

          <Separator />

          {/* Signature */}
          <div>
            <div className="text-sm font-medium mb-2">Signature</div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted p-2 rounded font-mono flex-1 break-all">
                {transaction.signature}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(transaction.signature, 'signature')}
              >
                {copied === 'signature' ? (
                  <span className="text-xs text-green-500">✓</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={openExplorer}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Cost</div>
              <div className="text-lg font-mono">{formatSol(transaction.cost_lamports)} SOL</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Response Time</div>
              <div className="text-lg font-mono">{transaction.response_time_ms}ms</div>
            </div>
            {transaction.tip_lamports && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Jito Tip</div>
                <div className="text-lg font-mono">
                  {formatSol(transaction.tip_lamports)} SOL
                  {transaction.tip_refunded && (
                    <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500">
                      Refunded
                    </Badge>
                  )}
                </div>
              </div>
            )}
            {transaction.confirmation_time_ms && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Confirmation Time</div>
                <div className="text-lg font-mono">{transaction.confirmation_time_ms}ms</div>
              </div>
            )}
          </div>

          <Separator />

          {/* Blockchain Details */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Blockchain Details</div>
            {transaction.slot && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Slot</span>
                <span className="text-sm font-mono">{transaction.slot}</span>
              </div>
            )}
            {transaction.blockhash && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Blockhash</div>
                <code className="text-xs bg-muted p-2 rounded font-mono block break-all">
                  {transaction.blockhash}
                </code>
              </div>
            )}
            {transaction.last_valid_block_height && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Valid Block Height</span>
                <span className="text-sm font-mono">{transaction.last_valid_block_height}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Instruction Count</span>
              <span className="text-sm font-mono">{transaction.instruction_count}</span>
            </div>
          </div>

          <Separator />

          {/* Signer */}
          <div>
            <div className="text-sm font-medium mb-2">Signer</div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted p-2 rounded font-mono flex-1 break-all">
                {transaction.signer_pubkey}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(transaction.signer_pubkey, 'signer')}
              >
                {copied === 'signer' ? (
                  <span className="text-xs text-green-500">✓</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Error Details */}
          {transaction.error_code && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium text-red-500">Error Details</div>
                <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                  <div className="text-xs text-muted-foreground mb-1">Error Code</div>
                  <div className="text-sm font-mono text-red-500 mb-2">{transaction.error_code}</div>
                  {transaction.error_message && (
                    <>
                      <div className="text-xs text-muted-foreground mb-1">Error Message</div>
                      <div className="text-sm text-red-500">{transaction.error_message}</div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Timestamps */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created</span>
              <span className="font-mono">{formatTimestamp(transaction.created_at)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Updated</span>
              <span className="font-mono">{formatTimestamp(transaction.updated_at)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
