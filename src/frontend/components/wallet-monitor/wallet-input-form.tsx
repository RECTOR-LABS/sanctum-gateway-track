'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Wallet, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

/**
 * Validates if a string is a valid Solana wallet address
 * Solana addresses are base58 encoded and typically 32-44 characters
 */
function isValidSolanaAddress(address: string): boolean {
  // Basic format validation
  if (!address || address.length < 32 || address.length > 44) {
    return false;
  }

  // Check if it's valid base58 (Solana addresses use base58)
  // Base58 alphabet: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  if (!base58Regex.test(address)) {
    return false;
  }

  // Additional check: Solana addresses should not contain 0, O, I, l
  if (/[0OIl]/.test(address)) {
    return false;
  }

  return true;
}

interface WalletInputFormProps {
  onMonitorStart?: (address: string) => void;
  isMonitoring?: boolean;
}

export function WalletInputForm({ onMonitorStart, isMonitoring = false }: WalletInputFormProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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

  const handleAddressChange = (value: string) => {
    setWalletAddress(value.trim());
    setValidationError(null);
    setIsValid(false);
    setSubmitSuccess(false);

    // Real-time validation
    if (value.trim().length === 0) {
      return;
    }

    setIsValidating(true);

    // Debounce validation
    setTimeout(() => {
      const valid = isValidSolanaAddress(value.trim());

      if (valid) {
        setIsValid(true);
        setValidationError(null);
      } else {
        setIsValid(false);
        if (value.trim().length > 0) {
          setValidationError('Invalid Solana wallet address format');
        }
      }

      setIsValidating(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Call API to start monitoring
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/monitor/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: walletAddress }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start monitoring');
      }

      const result = await response.json();
      setSubmitSuccess(true);

      // Update wallet stats
      await fetchWalletStats();

      // Show success toast
      const shortAddress = walletAddress.slice(0, 8) + '...' + walletAddress.slice(-8);
      toast.success('Monitoring Started', {
        description: `Now tracking ${shortAddress} (${result.currentCount || currentCount + 1}/${result.maxWallets || maxWallets})`,
        duration: 4000,
      });

      // Call parent callback
      if (onMonitorStart) {
        onMonitorStart(walletAddress);
      }

      // Clear form after 2 seconds
      setTimeout(() => {
        setWalletAddress('');
        setIsValid(false);
        setSubmitSuccess(false);
      }, 2000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start monitoring';
      setValidationError(errorMessage);

      // Show error toast
      toast.error('Failed to Start Monitoring', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle>Monitor Wallet</CardTitle>
          </div>
          <Badge variant={canAddMore ? "secondary" : "destructive"}>
            {currentCount}/{maxWallets} slots
          </Badge>
        </div>
        <CardDescription>
          Enter any Solana wallet address to monitor transactions and analytics in real-time
          {!canAddMore && (
            <span className="block mt-1 text-destructive font-medium">
              ⚠️ Limit reached - stop monitoring a wallet to add another
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet-address">Solana Wallet Address</Label>
            <div className="relative">
              <Input
                id="wallet-address"
                type="text"
                placeholder="e.g., REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc"
                value={walletAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressChange(e.target.value)}
                disabled={isSubmitting || isMonitoring}
                className={`pr-10 ${
                  isValid ? 'border-green-500' :
                  validationError ? 'border-red-500' : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isValidating && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {!isValidating && isValid && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {!isValidating && validationError && walletAddress.length > 0 && (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>

            {validationError && (
              <p className="text-sm text-red-500">{validationError}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Valid Solana addresses are 32-44 characters (base58 encoded)
            </p>
          </div>

          {submitSuccess && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                Monitoring started successfully! Transactions will appear in the dashboard.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={!isValid || isSubmitting || isMonitoring || !canAddMore}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting Monitor...
              </>
            ) : !canAddMore ? (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Limit Reached ({maxWallets}/{maxWallets})
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Start Monitoring
              </>
            )}
          </Button>

          {isMonitoring && (
            <Alert>
              <AlertDescription>
                Monitoring is active. New transactions will appear automatically.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
