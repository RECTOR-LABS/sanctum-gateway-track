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
}

export function MonitoredWalletsList() {
  const [wallets, setWallets] = useState<MonitoredWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingWallet, setRemovingWallet] = useState<string | null>(null);

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
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-primary" />
          <CardTitle>Monitored Wallets</CardTitle>
        </div>
        <CardDescription>
          {wallets.length} {wallets.length === 1 ? 'wallet' : 'wallets'} currently being tracked
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
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.address}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono truncate">{wallet.address}</code>
                    {wallet.isActive && (
                      <Badge variant="outline" className="text-green-500 border-green-500/50">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Started {formatDate(wallet.startedAt)}
                  </div>
                </div>

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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
