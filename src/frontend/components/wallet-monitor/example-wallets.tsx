'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ExampleWallet {
  address: string;
  label: string;
  description: string;
  activity: 'High' | 'Very High' | 'Moderate';
}

const EXAMPLE_WALLETS: ExampleWallet[] = [
  {
    address: 'REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc',
    label: 'Sanctum Gateway Demo',
    description: 'Our demo wallet with 11 successful Gateway transactions',
    activity: 'Moderate',
  },
  {
    address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    label: 'Jupiter Aggregator',
    description: 'Processes thousands of swaps daily - extremely active',
    activity: 'Very High',
  },
  {
    address: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
    label: 'Raydium AMM',
    description: 'Major DEX protocol with continuous trading activity',
    activity: 'Very High',
  },
  {
    address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    label: 'MEV Trading Bot',
    description: 'High-frequency arbitrage bot with rapid transactions',
    activity: 'High',
  },
  {
    address: 'GThUX1Atko4tqhN2NaiTazWSeFWMuiUvfFnyJyUghFMJ',
    label: 'Whale Wallet',
    description: 'Large holder with regular trading and staking activity',
    activity: 'Moderate',
  },
];

interface ExampleWalletsProps {
  onWalletMonitored?: (address: string) => void;
}

export function ExampleWallets({ onWalletMonitored }: ExampleWalletsProps) {
  const [monitoringWallet, setMonitoringWallet] = useState<string | null>(null);
  const [currentCount, setCurrentCount] = useState(0);
  const [maxWallets, setMaxWallets] = useState(3);
  const [canAddMore, setCanAddMore] = useState(true);

  // Fetch wallet stats to check limits
  const fetchWalletStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/monitor/wallets`);

      if (response.ok) {
        const data = await response.json();
        setCurrentCount(data.currentCount || 0);
        setMaxWallets(data.maxWallets || 3);
        setCanAddMore(data.canAddMore ?? true);
      }
    } catch (error) {
      console.error('Failed to fetch wallet stats:', error);
    }
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchWalletStats();
  }, []);

  const handleMonitor = async (wallet: ExampleWallet) => {
    try {
      setMonitoringWallet(wallet.address);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/monitor/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: wallet.address }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start monitoring');
      }

      // Refresh wallet stats
      await fetchWalletStats();

      const shortAddress = wallet.address.slice(0, 8) + '...' + wallet.address.slice(-8);
      toast.success('Monitoring Started', {
        description: `Now tracking ${wallet.label} (${shortAddress})`,
        duration: 4000,
      });

      // Call parent callback
      if (onWalletMonitored) {
        onWalletMonitored(wallet.address);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start monitoring';

      toast.error('Failed to Start Monitoring', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setMonitoringWallet(null);
    }
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'Very High':
        return 'text-red-600 dark:text-red-400';
      case 'High':
        return 'text-orange-600 dark:text-orange-400';
      case 'Moderate':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'Very High':
        return '🔥';
      case 'High':
        return '⚡';
      case 'Moderate':
        return '📊';
      default:
        return '📈';
    }
  };

  return (
    <div className="rounded-lg border bg-muted/50 p-6">
      <h3 className="text-lg font-semibold mb-4">Example Wallets to Monitor</h3>
      <div className="space-y-3">
        {EXAMPLE_WALLETS.map((wallet) => (
          <div
            key={wallet.address}
            className="rounded-lg border bg-background p-4 space-y-2 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">{wallet.label}</span>
                  <span
                    className={`text-xs font-medium ${getActivityColor(wallet.activity)}`}
                  >
                    {getActivityIcon(wallet.activity)} {wallet.activity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {wallet.description}
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                  {wallet.address}
                </code>
              </div>
              <Button
                size="sm"
                onClick={() => handleMonitor(wallet)}
                disabled={monitoringWallet === wallet.address || !canAddMore}
                className="shrink-0"
              >
                {monitoringWallet === wallet.address ? 'Starting...' : !canAddMore ? 'Limit Reached' : 'Monitor'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>💡 Tip:</strong> Start with Jupiter or Raydium for immediate activity, or use
          the Demo wallet to see historical Gateway transactions right away.
        </p>
      </div>
    </div>
  );
}
