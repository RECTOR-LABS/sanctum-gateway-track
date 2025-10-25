'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { List, X, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface MonitoredWallet {
  address: string;
  startedAt: string;
  isActive: boolean;
  transactionCount: number;
  maxTransactions: number;
  stopReason?: 'manual' | 'limit-reached';
}

export function MonitoredWalletsList() {
  const [wallets, setWallets] = useState<MonitoredWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingWallet, setRemovingWallet] = useState<string | null>(null);
  const [restartingWallet, setRestartingWallet] = useState<string | null>(null);
  const [maxWallets, setMaxWallets] = useState(3);
  const [canAddMore, setCanAddMore] = useState(true);

  // Fetch monitored wallets
  const fetchWallets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/monitor/wallets`);

      if (!response.ok) {
        throw new Error('Failed to fetch monitored wallets');
      }

      const data = await response.json();
      setWallets(data.wallets || []);
      setMaxWallets(data.maxWallets || 3);
      setCanAddMore(data.canAddMore ?? true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallets');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove wallet from monitoring
  const handleStopMonitoring = async (address: string) => {
    try {
      setRemovingWallet(address);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/monitor/wallet/${encodeURIComponent(address)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to stop monitoring');
      }

      // Remove from local state
      setWallets(prev => prev.filter(w => w.address !== address));

      // Show success toast
      const shortAddress = address.slice(0, 8) + '...' + address.slice(-8);
      toast.success('Monitoring Stopped', {
        description: `No longer tracking ${shortAddress}`,
        duration: 3000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop monitoring';
      setError(errorMessage);

      // Show error toast
      toast.error('Failed to Stop Monitoring', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setRemovingWallet(null);
    }
  };

  // Re-start monitoring a stopped wallet
  const handleRestartMonitoring = async (address: string) => {
    try {
      setRestartingWallet(address);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/monitor/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to restart monitoring');
      }

      // Refresh wallets list
      await fetchWallets();

      // Show success toast
      const shortAddress = address.slice(0, 8) + '...' + address.slice(-8);
      toast.success('Monitoring Re-started', {
        description: `Now tracking ${shortAddress} again. Quota usage continues from previous count.`,
        duration: 4000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restart monitoring';
      setError(errorMessage);

      // Show error toast
      toast.error('Failed to Restart Monitoring', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setRestartingWallet(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Load wallets on mount
  useEffect(() => {
    fetchWallets();

    // Refresh every 30 seconds
    const interval = setInterval(fetchWallets, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading && wallets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <List className="h-5 w-5 text-primary" />
            <CardTitle>Monitored Wallets</CardTitle>
          </div>
          <CardDescription>Wallets currently being tracked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="h-5 w-5 text-primary" />
            <CardTitle>Monitored Wallets</CardTitle>
          </div>
          <Badge variant={canAddMore ? "secondary" : "destructive"}>
            {wallets.length}/{maxWallets} wallets
          </Badge>
        </div>
        <CardDescription>
          {wallets.length} of {maxWallets} wallet slots being used
          {!canAddMore && <span className="text-destructive ml-1">(limit reached)</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {wallets.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No wallets being monitored. Add a wallet above to start tracking.
          </div>
        ) : (
          <>
            {/* Quota Info Alert */}
            <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
              <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 Demo Quota Protection:</strong> Each wallet auto-stops after 200 transactions to preserve API quota.
                Click <strong>"Re-watch"</strong> anytime to continue monitoring (transaction count persists).
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {wallets.map((wallet) => {
                const isApproachingLimit = wallet.transactionCount >= 180;
                const isAtLimit = wallet.transactionCount >= wallet.maxTransactions;
                const progressPercent = Math.min((wallet.transactionCount / wallet.maxTransactions) * 100, 100);

                return (
                  <div
                    key={wallet.address}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <code className="text-sm font-mono truncate">{wallet.address}</code>

                        {/* Status Badge */}
                        {wallet.isActive ? (
                          <Badge variant="outline" className="text-green-500 border-green-500/50">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : wallet.stopReason === 'limit-reached' ? (
                          <Badge variant="destructive">
                            🛑 Limit Reached
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-500/50">
                            Stopped
                          </Badge>
                        )}

                        {/* Transaction Count Badge */}
                        <Badge
                          variant={isAtLimit ? "destructive" : isApproachingLimit ? "default" : "secondary"}
                          className={isApproachingLimit && !isAtLimit ? "bg-orange-500 hover:bg-orange-600" : ""}
                        >
                          {wallet.transactionCount}/{wallet.maxTransactions} txs
                          {isApproachingLimit && !isAtLimit && " ⚠️"}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              isAtLimit ? 'bg-red-500' : isApproachingLimit ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Started {formatDate(wallet.startedAt)}
                        {wallet.stopReason === 'limit-reached' && (
                          <span className="ml-2 text-orange-600 dark:text-orange-400 font-medium">
                            • Auto-stopped at {wallet.transactionCount} transactions
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {wallet.isActive ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStopMonitoring(wallet.address)}
                        disabled={removingWallet === wallet.address}
                      >
                        {removingWallet === wallet.address ? (
                          <>Stopping...</>
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Stop
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestartMonitoring(wallet.address)}
                        disabled={restartingWallet === wallet.address}
                        className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                      >
                        {restartingWallet === wallet.address ? (
                          <>Starting...</>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Re-watch
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
